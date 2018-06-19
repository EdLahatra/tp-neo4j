import React from 'react';
import CommonAddPlace, { reduxConnect } from 'common/component/page/places/addPlace';
import InputText from '../../input/text';

class AddPlace extends CommonAddPlace {
  constructor(props) {
    super(props);

    this.escFunction = this.escFunction.bind(this);
  }

  escFunction(e) {
    const key = e.which || e.keyCode;
    if (key === 27) {
      this.setState({ isOpen: false });
    }
    if (key === 13 && this.state.isOpen) {
      this.addPlace();
      this.toggleOpen();
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false);
  }

  render() {
    if (this.state.isOpen) {
      return (
        <div className="addplace-container">
          <div
            className="add-place"
            onClick={() => this.toggleOpen()}
            role="menuitem"
            tabIndex={0}
          />
          <div className="addplace-field">
            <InputText
              value={this.state.name}
              onChange={this.changeName}
              placeholder={'Place\'s name'}
              autoFocus
            />
            <button
              onClick={() => { this.addPlace(); this.toggleOpen(); }}
              className="btn btn-success"
            >
              Add
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="addplace-container">
        <div onClick={() => this.toggleOpen()} role="menuitem" tabIndex={0} className="add-place" />
      </div>
    );
  }
}

export default reduxConnect(AddPlace);
