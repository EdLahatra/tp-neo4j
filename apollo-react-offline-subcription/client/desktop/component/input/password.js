import React from 'react';
import CommonInputPassword from 'common/component/input/password';

class InputPassword extends CommonInputPassword {
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
        type="password"
        value={this.props.value}
        onChange={this.onChangeText}
        placeholder={this.props.placeholder}
      />
    );
  }
}

export default InputPassword;
