import React from 'react';
import CommonInputText from 'common/component/input/text';

class InputTextarea extends CommonInputText {
  constructor(props) {
    super(props);
    this.onChangeText = this.onChangeText.bind(this);
  }

  onChangeText(event) {
    this.props.onChange(event.target.value);
  }

  render() {
    return (
      <textarea
        value={this.props.value}
        placeholder={this.props.placeholder}
        onChange={this.onChangeText}
      />
    );
  }
}

export default InputTextarea;
