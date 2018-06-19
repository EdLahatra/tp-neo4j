import React from 'react';
import CommonInputText from 'common/component/input/text';

class InputNumber extends CommonInputText {
  constructor(props) {
    super(props);
    this.onChangeText = this.onChangeText.bind(this);
  }

  onChangeText(event) {
    this.props.onChange(event.target.value);
  }

  render() {
    return (
      <input
        type="number"
        className={this.props.className}
        placeholder={this.props.placeholder}
        value={this.props.value}
        onChange={this.onChangeText}
        // eslint-disable-next-line
        autoFocus={this.props.autoFocus}
      />
    );
  }
}

export default InputNumber;
