// TODO: update group functionality
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { graphql, compose } from 'react-apollo';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

import GROUP_QUERY from 'common/graphql/group.query';
import { USER_QUERY } from 'common/graphql/user.query';
import DELETE_GROUP_MUTATION from 'common/graphql/delete-group.mutation';
import LEAVE_GROUP_MUTATION from 'common/graphql/leave-group.mutation';

const resetAction = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'Main' }),
  ],
});

class GroupDetails extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title}`,
  });

  constructor(props) {
    super(props);

    this.deleteGroup = this.deleteGroup.bind(this);
    this.leaveGroup = this.leaveGroup.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  deleteGroup() {
    this.props.deleteGroup(this.props.navigation.state.params.id)
      .then(() => {
        this.props.navigation.dispatch(resetAction);
      })
      .catch((e) => {
        console.log(e); // eslint-disable-line no-console
      });
  }

  leaveGroup() {
    this.props.leaveGroup({
      id: this.props.navigation.state.params.id,
    })
      .then(() => {
        this.props.navigation.dispatch(resetAction);
      })
      .catch((e) => {
        console.log(e); // eslint-disable-line no-console
      });
  }

  keyExtractor = item => item.id.toString();

  renderItem = ({ item: user }) => (
    <div>
      <img src="https://reactjs.org/logo-og.png" alt="Girl in a jacket" />
      <span>{user.username}</span>
    </div>
  )

  listHeaderComponent = group => (
    <div>
      <div>
        <button onPress={this.pickGroupImage}>
          <img src="https://reactjs.org/logo-og.png" alt="Girl in a jacket" />
          <p>edit</p>
        </button>
        <div>
          <p>{group.name}</p>
        </div>
      </div>
      <span>
        {`participants: ${group.users.length}`.toUpperCase()}
      </span>
    </div>
  )

  listFooterComponent = () => (
    <div>
      <button title="Leave Group" onPress={this.leaveGroup} />
      <button title="Delete Group" onPress={this.deleteGroup} />
    </div>
  )

  render() {
    const { group, loading } = this.props;

    // render loading placeholder while we fetch messages
    if (!group || loading) {
      return (
        <div>
          loading...
        </div>
      );
    }

    return group.users.map(key => (
      <div>
        { this.listHeaderComponent(key) }
        { this.renderItem(key) }
        { this.listFooterComponent(key) }
      </div>
    ))
  }
}

GroupDetails.propTypes = {
  loading: PropTypes.bool,
  group: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    users: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      username: PropTypes.string,
    })),
  }),
  navigation: PropTypes.shape({
    dispatch: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        title: PropTypes.string,
        id: PropTypes.number,
      }),
    }),
  }),
  deleteGroup: PropTypes.func.isRequired,
  leaveGroup: PropTypes.func.isRequired,
};

const groupQuery = graphql(GROUP_QUERY, {
  options: ownProps => ({ variables: { groupId: ownProps.navigation.state.params.id } }),
  props: ({ data: { loading, group } }) => ({
    loading,
    group,
  }),
});

const deleteGroupMutation = graphql(DELETE_GROUP_MUTATION, {
  props: ({ ownProps, mutate }) => ({
    deleteGroup: id =>
      mutate({
        variables: { id },
        update: (store, { data: { deleteGroup } }) => {
          // Read the data from our cache for this query.
          const data = store.readQuery({ query: USER_QUERY, variables: { id: ownProps.auth.id } });

          // Add our message from the mutation to the end.
          data.user.groups = data.user.groups.filter(g => deleteGroup.id !== g.id);

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

const leaveGroupMutation = graphql(LEAVE_GROUP_MUTATION, {
  props: ({ ownProps, mutate }) => ({
    leaveGroup: ({ id }) =>
      mutate({
        variables: { id },
        update: (store, { data: { leaveGroup } }) => {
          // Read the data from our cache for this query.
          const data = store.readQuery({ query: USER_QUERY, variables: { id: ownProps.auth.id } });

          // Add our message from the mutation to the end.
          data.user.groups = data.user.groups.filter(g => leaveGroup.id !== g.id);

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

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  groupQuery,
  deleteGroupMutation,
  leaveGroupMutation,
)(GroupDetails);
