import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { graphql, compose } from 'react-apollo';
import moment from 'moment';
import { connect } from 'react-redux';

import { USER_QUERY } from 'common/graphql/user.query';

// format createdAt with moment
const formatCreatedAt = createdAt => moment(createdAt).calendar(null, {
  sameDay: '[Today]',
  nextDay: '[Tomorrow]',
  nextWeek: 'dddd',
  lastDay: '[Yesterday]',
  lastWeek: 'dddd',
  sameElse: 'DD/MM/YYYY',
});

const Header = ({ onPress }) => (
  <div>
    <button title="New Group" onPress={onPress} />
  </div>
);
Header.propTypes = {
  onPress: PropTypes.func.isRequired,
};

class Group extends Component {
  constructor(props) {
    super(props);

    this.goToMessages = this.props.goToMessages.bind(this, this.props.group);
  }

  render() {
    const { id, name, messages } = this.props.group;
    return (
      <button
        key={id}
        onPress={this.goToMessages}
      >
        <div>
          <img src="https://reactjs.org/logo-og.png" alt="Girl in a jacket" />
          <div>
            <div>
              <p>{`${name}`}</p>
              <span>
                {messages.edges.length ?
                  formatCreatedAt(messages.edges[0].node.createdAt) : ''}
              </span>
            </div>
            <p>
              {messages.edges.length ?
                `${messages.edges[0].node.from.username}:` : ''}
            </p>
            <p>
              {messages.edges.length ? messages.edges[0].node.text : ''}
            </p>
          </div>
          Icon
        </div>
      </button>
    );
  }
}

Group.propTypes = {
  goToMessages: PropTypes.func.isRequired,
  group: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    messages: PropTypes.shape({
      edges: PropTypes.arrayOf(PropTypes.shape({
        cursor: PropTypes.string,
        node: PropTypes.object,
      })),
    }),
  }),
};

class Groups extends Component {
  static navigationOptions = {
    title: 'Chats',
  };

  constructor(props) {
    super(props);
    this.goToMessages = this.goToMessages.bind(this);
    this.goToNewGroup = this.goToNewGroup.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }

  onRefresh() {
    this.props.refetch();
    // faking unauthorized status
  }

  keyExtractor = item => item.id.toString();

  goToMessages(group) {
    const { navigate } = this.props.navigation;
    navigate('Messages', { groupId: group.id, title: group.name });
  }

  goToNewGroup() {
    const { navigate } = this.props.navigation;
    navigate('NewGroup');
  }

  renderItem = ({ item }) => <Group group={item} goToMessages={this.goToMessages} />;

  render() {
    const { loading, user, networkStatus } = this.props;

    // render loading placeholder while we fetch messages
    if (loading || !user) {
      return (
        <div>
          loading ...
        </div>
      );
    }

    if (user && !user.groups.length) {
      return (
        <div>
          <Header onPress={this.goToNewGroup} />
          <p>You do not have any groups.</p>
        </div>
      );
    }

    // render list of groups for user
    return user.groups.map(key => {
      
    })
    (
      <div style={styles.container}>
        <FlatList
          data={user.groups}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          ListHeaderComponent={() => <Header onPress={this.goToNewGroup} />}
          onRefresh={this.onRefresh}
          refreshing={networkStatus === 4}
        />
      </div>
    );
  }
}
Groups.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  loading: PropTypes.bool,
  networkStatus: PropTypes.number,
  refetch: PropTypes.func,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    groups: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })),
  }),
};

const userQuery = graphql(USER_QUERY, {
  skip: ownProps => !ownProps.auth || !ownProps.auth.jwt,
  options: ownProps => ({ variables: { id: ownProps.auth.id } }),
  props: ({
    data: {
      loading, networkStatus, refetch, user,
    },
  }) => ({
    loading, networkStatus, refetch, user,
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  connect(mapStateToProps),
  userQuery,
)(Groups);
