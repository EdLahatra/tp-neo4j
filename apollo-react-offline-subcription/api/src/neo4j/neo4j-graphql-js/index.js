import { filter, has } from 'lodash';
import { cypherDirectiveArgs, isMutation } from './utils';

const returnTypeEnum = {
  OBJECT: 0,
  ARRAY: 1,
};

export const neo4jgraphql = (object, params, context, resolveInfo, debug = false, dynamique = false) => {
  let query;

  const type = innerType(resolveInfo.returnType).toString();
  const variable = type.charAt(0).toLowerCase() + type.slice(1);
  const mutation = isMutation(resolveInfo);

  if (isMutation(resolveInfo)) {
    query = cypherMutation(params, context, resolveInfo, dynamique);
  } else {
    query = cypherQuery(params, context, resolveInfo);
  }

  if (debug) {
    console.log(query);
  }

  const returnType = resolveInfo.returnType.toString().startsWith('[') ? returnTypeEnum.ARRAY : returnTypeEnum.OBJECT;
  const session = context.driver.session();

  if (mutation) {
    params = { params };
  }

  const data = session.run(query, params).then((result) => {
    if (returnType === returnTypeEnum.ARRAY) {
      return result.records.map(record => record.get(variable));
    } else if (returnType === returnTypeEnum.OBJECT) {
      if (result.records.length > 0) {
        // FIXME: use one of the new neo4j-driver consumers when upgrading neo4j-driver package
        return result.records[0].get(variable);
      }
      return null;
    }
  });

  return data;
};

export const cypherMutation = (params, context, resolveInfo) => {
  if (params.dynamique) {
    switch (params.dynamique) {
      case 'ActionPersonne':
        return `MATCH (c:Personne),(n:Personne) WHERE c.name = '${params.p1}' AND n.name = '${params.p2}' CREATE (c)-[r:${params.relation}]->(n)`;
      case 'AddMessage':
        return `MATCH (c:Personne),(p:Personne) WHERE c.name = '${params.actors}' AND p.name = '${params.to}' CREATE (message:Message) SET message = {text: '${params.text}'} CREATE (c)-[:poster]->(message) CREATE (p)-[:to]->(message) RETURN message`;
      // no default
    }
  }
  // FIXME: lots of duplication here with cypherQuery, extract into util module
  const type = innerType(resolveInfo.returnType).toString(),
    variable = type.charAt(0).toLowerCase() + type.slice(1),
    schemaType = resolveInfo.schema.getType(type);

  const filteredFieldNodes = filter(resolveInfo.fieldNodes, o => o.name.value === resolveInfo.fieldName);

  const selections = filteredFieldNodes[0].selectionSet.selections;

  let query = `CREATE (${variable}:${type}) `;
  query += `SET ${variable} = $params `;
  // query += `RETURN ${variable}`;
  query += `RETURN ${variable} {${buildCypherSelection('', selections, variable, schemaType, resolveInfo)}`;
  query += `} AS ${variable}`;
  return query;
};

// this function is exported so it can be used for Cypher query generation only
export const cypherQuery = (params, context, resolveInfo) => {
  const pageParams = {
    first: params.first === undefined ? -1 : params.first,
    offset: params.offset || 0,
  };

  delete params.first;
  delete params.offset;

  const type = innerType(resolveInfo.returnType).toString(),
    variable = type.charAt(0).toLowerCase() + type.slice(1),
    schemaType = resolveInfo.schema.getType(type);


  const filteredFieldNodes = filter(resolveInfo.fieldNodes, o => o.name.value === resolveInfo.fieldName);

  // FIXME: how to handle multiple fieldNode matches
  const selections = filteredFieldNodes[0].selectionSet.selections;

  let wherePredicate = '';
  if (has(params, '_id')) {
    wherePredicate = `WHERE ID(${variable})=${params._id} `;
    delete params._id;
  }

  const argString = JSON.stringify(params).replace(/\"([^(\")"]+)\":/g, '$1:'); // FIXME: support IN for multiple values -> WHERE
  let query = `MATCH (${variable}:${type} ${argString}) ${wherePredicate}`;

  query = `${query}RETURN ${variable} {${buildCypherSelection('', selections, variable, schemaType, resolveInfo)}`;// ${variable} { ${selection} } as ${variable}`;

  query += `} AS ${variable}`;

  query += ` SKIP ${pageParams.offset}${pageParams.first > -1 ? ` LIMIT ${pageParams.first}` : ''}`;

  return query;
};


const buildCypherSelection = (initial, selections, variable, schemaType, resolveInfo) => { // FIXME: resolveInfo not needed
  if (selections.length === 0) {
    return initial;
  }

  const [headSelection, ...tailSelections] = selections;

  const fieldName = headSelection.name.value;
  if (!schemaType.getFields()[fieldName]) {
    // meta field type
    return buildCypherSelection(tailSelections.length === 0 ? initial.substring(initial.lastIndexOf(','), 0) : initial, tailSelections, variable, schemaType, resolveInfo);
  }
  const fieldType = schemaType.getFields()[fieldName].type;

  const inner = innerType(fieldType); // for target "type" aka label

  const fieldHasCypherDirective = schemaType.getFields()[fieldName].astNode.directives.filter(e => e.name.value === 'cypher').length > 0;

  if (fieldHasCypherDirective) {
    const statement = schemaType.getFields()[fieldName].astNode.directives.find(e => e.name.value === 'cypher').arguments.find(e => e.name.value === 'statement').value.value;

    if (inner.constructor.name === 'GraphQLScalarType') {
      return buildCypherSelection(`${initial}${fieldName}: apoc.cypher.runFirstColumn("${statement}", ${cypherDirectiveArgs(variable, headSelection, schemaType)}, false)${tailSelections.length > 0 ? ',' : ''}`, tailSelections, variable, schemaType, resolveInfo);
    }
    // similar: [ x IN apoc.cypher.runFirstColumn("WITH {this} AS this MATCH (this)--(:Genre)--(o:Movie) RETURN o", {this: movie}, true) |x {.title}][1..2])

    const nestedVariable = `${variable}_${ fieldName}`;
    const skipLimit = computeSkipLimit(headSelection);
    const fieldIsList = !!fieldType.ofType;

    return buildCypherSelection(`${initial}${fieldName}: ${fieldIsList ? '' : 'head('}[ ${nestedVariable} IN apoc.cypher.runFirstColumn("${statement}", ${cypherDirectiveArgs(variable, headSelection, schemaType)}, true) | ${nestedVariable} {${buildCypherSelection('', headSelection.selectionSet.selections, nestedVariable, inner, resolveInfo)}}]${fieldIsList ? '': ')'}${skipLimit} ${tailSelections.length > 0 ? ',' : ''}`, tailSelections, variable, schemaType, resolveInfo);
  } else if (innerType(fieldType).constructor.name === 'GraphQLScalarType') {
    return buildCypherSelection(`${initial} .${fieldName} ${tailSelections.length > 0 ? ',' : ''}`, tailSelections, variable, schemaType, resolveInfo);
  }
  // field is an object
  let nestedVariable = `${variable}_${fieldName}`,
    skipLimit = computeSkipLimit(headSelection),
    relationDirective = schemaType.getFields()[fieldName].astNode.directives.find(e => e.name.value === 'relation'),
    relType = relationDirective.arguments.find(e => e.name.value === 'name').value.value,
    relDirection = relationDirective.arguments.find(e => e.name.value === 'direction').value.value;

  const returnType = fieldType.toString().startsWith('[') ? returnTypeEnum.ARRAY : returnTypeEnum.OBJECT;

  let queryParams = '';

  if (selections && selections.length && selections[0].arguments && selections[0].arguments.length) {
    const filters = selections[0].arguments.map((x) => {
      const filterValue = JSON.stringify(x.value.value).replace(/\"([^(\")"]+)\":/g, '$1:'); // FIXME: support IN for multiple values -> WHERE
      return `${x.name.value}: ${filterValue}`;
    });

    queryParams = `{${filters.join(',')}}`;
  }

  return buildCypherSelection(`${initial}${fieldName}: ${returnType === returnTypeEnum.OBJECT ? 'head(' : ''}[(${variable})${relDirection === 'in' || relDirection === 'IN' ? '<' : ''}-[:${relType}]-${relDirection === 'out' || relDirection === 'OUT' ? '>' : ''}(${nestedVariable}:${inner.name}${queryParams}) | ${nestedVariable} {${buildCypherSelection('', headSelection.selectionSet.selections, nestedVariable, inner, resolveInfo)}}]${returnType === returnTypeEnum.OBJECT ? ')' : ''}${skipLimit} ${tailSelections.length > 0 ? ',' : ''}`, tailSelections, variable, schemaType, resolveInfo);
};

const innerType = type => ((type.ofType) ? innerType(type.ofType) : type);

const argumentValue = (selection, name) => {
  const arg = selection.arguments.find(a => a.name.value === name);
  return arg === undefined ? null : arg.value.value;
};

const computeSkipLimit = (selection) => {
  const first = argumentValue(selection, 'first');
  const offset = argumentValue(selection, 'offset');

  if (first === null && offset === null) return '';
  if (offset === null) return `[..${first}]`;
  if (first === null) return `[${offset}..]`;
  return `[${offset}..${parseInt(offset, 10) + parseInt(first, 10)}]`;
};
