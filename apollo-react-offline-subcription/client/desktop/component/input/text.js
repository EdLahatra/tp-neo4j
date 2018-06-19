import React from 'react';
import CommonInputText from 'common/component/input/text';

class InputText extends CommonInputText {
  constructor(props) {
    super(props);
    this.onChangeText = this.onChangeText.bind(this);
  }

  onChangeText(event) {
    this.props.onChange(event.target.value);
  }

  static moveCaretAtEnd(e) {
    const tempValue = e.target.value;
    e.target.value = '';
    e.target.value = tempValue;
  }

  render() {
    return (
      <input
        type="text"
        className={this.props.className}
        placeholder={this.props.placeholder}
        value={this.props.value}
        onChange={this.onChangeText}
        // eslint-disable-next-line
        autoFocus
        onFocus={InputText.moveCaretAtEnd}
      />
    );
  }
}

export default InputText;
