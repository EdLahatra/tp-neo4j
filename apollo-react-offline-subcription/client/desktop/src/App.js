import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import qs from 'qs';

export const HERO_QUERY = gql`
  query Personne($name: String) {
    Personne(name: $name) {
      name
    }
  }
`;

export const HeroQuery = ({ name, children }) => (
  <Query query={HERO_QUERY} variables={{ name }}>
    {(result) => {
      const newData = qs.stringify(result);
      // eslint-disable-next-line
      console.log('loading, error, data', newData);
      const { loading, error, data } = newData;
      return children({
        loading,
        error,
        hero: data && data.Personne,
      });
    }}
  </Query>
);

export const Character = ({ loading, error, hero }) => {
  if (loading) {
    return <div>Loading</div>;
  }
  if (error) {
    return <h1>ERROR</h1>;
  }
  return (
    <div>
      {hero && (
        <div>
          <h3>{'hero.name'}</h3>
          {hero.map(
            friend => (
              <h6 key={friend.name}>
                {friend.name}
              </h6>
            ),
          )}
        </div>
      )}
    </div>
  );
};

export const App = () => (
  <HeroQuery episode="EMPIRE">{result => <Character {...result} />}</HeroQuery>
);
