import { _ } from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { graphql, compose } from 'react-apollo';
import { NavigationActions } from 'react-navigation';
import update from 'immutability-helper';
import { connect } from 'react-redux';

import { USER_QUERY } from 'common/graphql/user.query';
import CREATE_GROUP_MUTATION from 'common/graphql/create-group.mutation';
import SelectedUserList from '../components/selected-user-list.component';

const goToNewGroup = group => NavigationActions.reset({
  index: 1,
  actions: [
    NavigationActions.navigate({ routeName: 'Main' }),
    NavigationActions.navigate({ routeName: 'Messages', params: { groupId: group.id, title: group.name } }),
  ],
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  detailsContainer: {
    padding: 20,
    flexDirection: 'row',
  },
  imageContainer: {
    paddingRight: 20,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  input: {
    color: 'black',
    height: 32,
  },
  inputBorder: {
    borderColor: '#dbdbdb',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingVertical: 8,
  },
  inputInstructions: {
    paddingTop: 6,
    color: '#777',
    fontSize: 12,
  },
  groupImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  selected: {
    flexDirection: 'row',
  },
  loading: {
    justifyContent: 'center',
    flex: 1,
  },
  navIcon: {
    color: 'blue',
    fontSize: 18,
    paddingTop: 2,
  },
  participants: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    backgroundColor: '#dbdbdb',
    color: '#777',
  },
});

class FinalizeGroup extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    const isReady = state.params && state.params.mode === 'ready';
    return {
      title: 'New Group d',
      headerRight: (
        isReady ? <button
          title="Create"
          onPress={state.params.create}
        /> : undefined
      ),
    };
  };

  constructor(props) {
    super(props);

    const { selected } = props.navigation.state.params;

    this.state = {
      selected,
    };

    this.create = this.create.bind(this);
    this.pop = this.pop.bind(this);
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.refreshNavigation(this.state.selected.length && this.state.name);
  }

  componentWillUpdate(nextProps, nextState) {
    if ((nextState.selected.length && nextState.name) !==
      (this.state.selected.length && this.state.name)) {
      this.refreshNavigation(nextState.selected.length && nextState.name);
    }
  }

  pop() {
    this.props.navigation.goBack();
  }

  remove(user) {
    const index = this.state.selected.indexOf(user);
    // eslint-disable-next-line
    if (~index) {
      const selected = update(this.state.selected, { $splice: [[index, 1]] });
      this.setState({
        selected,
      });
    }
  }

  create() {
    const { createGroup } = this.props;

    createGroup({
      name: this.state.name,
      userIds: _.map(this.state.selected, 'id'),
    }).then((res) => {
      this.props.navigation.dispatch(goToNewGroup(res.data.createGroup));
    }).catch((error) => {
      alert(
        'Error Creating New Group',
        error.message,
      );
    });
  }

  refreshNavigation(ready) {
    const { navigation } = this.props;
    navigation.setParams({
      mode: ready ? 'ready' : undefined,
      create: this.create,
    });
  }

  render() {
    const { friendCount } = this.props.navigation.state.params;

    return (
      <div style={styles.container}>
        <div style={styles.detailsContainer}>
          <button style={styles.imageContainer}>
            <img src="https://reactjs.org/logo-og.png" alt="Girl in a jacket" />
            <span>edit</span>
          </button>
          <div style={styles.inputContainer}>
            <div style={styles.inputBorder}>
              <input
                autoFocus
                onChange={e => this.setState({ name: e.target.value })}
                placeholder="Group Subject"
              />
            </div>
            <span>
              {'Please provide a group subject and optional group icon'}
            </span>
          </div>
        </div>
        <span style={styles.participants}>
          {`participants: ${this.state.selected.length} of ${friendCount}`.toUpperCase()}
        </span>
        <div style={styles.selected}>
          {this.state.selected.length ?
            <SelectedUserList
              data={this.state.selected}
              remove={this.remove}
            /> : undefined}
        </div>
      </div>
    );
  }
}

FinalizeGroup.propTypes = {
  createGroup: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
    goBack: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        friendCount: PropTypes.number.isRequired,
      }),
    }),
  }),
};

const createGroupMutation = graphql(CREATE_GROUP_MUTATION, {
  props: ({ ownProps, mutate }) => ({
    createGroup: group =>
      mutate({
        variables: { group },
        update: (store, { data: { createGroup } }) => {
          // Read the data from our cache for this query.
          const data = store.readQuery({ query: USER_QUERY, variables: { id: ownProps.auth.id } });

          // Add our message from the mutation to the end.
          data.user.groups.push(createGroup);

          // Write our data back to the cache.
          store.writeQuery({
            query: USER_QUERY,
            variables: { id: ownProps.auth.id },
            data,
          });
        },
      }),
  }),
});

const userQuery = graphql(USER_QUERY, {
  options: ownProps => ({
    variables: {
      id: ownProps.navigation.state.params.userId,
    },
  }),
  props: ({ data: { loading, user } }) => ({
    loading, user,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  userQuery,
  createGroupMutation,
)(FinalizeGroup);