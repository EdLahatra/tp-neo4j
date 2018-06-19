import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class SelectedUserListItem extends Component {
  constructor(props) {
    super(props);

    this.remove = this.remove.bind(this);
  }

  remove() {
    this.props.remove(this.props.user);
  }

  render() {
    const { username, id } = this.props.user;

    return (
      <div key={id ? id.toString() : username}>
        <div>
          <img src="https://reactjs.org/logo-og.png" alt="Girl in a jacket" />
          <button onPress={this.remove}>
            Icone
          </button>
        </div>
        <span>{username}</span>
      </div>
    );
  }
}
SelectedUserListItem.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
  }),
  remove: PropTypes.func,
};

class SelectedUserList extends Component {
  constructor(props) {
    super(props);

    this.renderItem = this.renderItem.bind(this);
  }

  keyExtractor = item => item.id.toString();

  renderItem({ item: user }) {
    return (
      <SelectedUserListItem user={user} remove={this.props.remove} />
    );
  }

  render() {
    let result = null;
    const { data } = this.props;
    if (data && data.length > 0) {
      result = data.map(key => this.renderItem(key));
    }
    return result;
  }
}
SelectedUserList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  remove: PropTypes.func,
};

export default SelectedUserList;
