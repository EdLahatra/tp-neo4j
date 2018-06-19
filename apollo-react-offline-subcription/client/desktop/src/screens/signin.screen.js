import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingdiv,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  div,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';

import { setCurrentUser } from 'common/actions/auth.actions';
import LOGIN_MUTATION from 'common/graphql/login.mutation';
import SIGNUP_MUTATION from 'common/graphql/signup.mutation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#eeeeee',
    paddingHorizontal: 50,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderRadius: 4,
    marginVertical: 6,
    padding: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  loadingContainer: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  switchAction: {
    paddingHorizontal: 4,
    color: 'blue',
  },
  submit: {
    marginVertical: 6,
  },
});

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

class Signin extends Component {
  static navigationOptions = {
    title: 'Chatty',
    headerLeft: null,
  };

  constructor(props) {
    super(props);

    if (props.auth && props.auth.jwt) {
      props.navigation.goBack();
    }

    this.state = {
      div: 'login',
      email: 'Jovanny91@yahoo.com',
      password: 'HbXNFGAfJ8cFYg2',
    };
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.switchdiv = this.switchdiv.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.jwt) {
      nextProps.navigation.goBack();
    }
  }

  login() {
    // const { email, password } = this.state;

    this.setState({ loading: true });

    // this.props.login({ email, password })
    this.props.login({ email: 'Elbert.King@yahoo.com', password: 'HbXNFGAfJ8cFYg2' })
      .then(({ data: { login: user } }) => {
        this.props.dispatch(setCurrentUser(user));
        this.setState({ loading: false });
      }).catch((error) => {
        this.setState({ loading: false });
        Alert.alert(
          `${capitalizeFirstLetter(this.state.div)} error`,
          error.message,
          [
            { text: 'OK', onPress: () => console.log('OK pressed') }, // eslint-disable-line no-console
            { text: 'Forgot password', onPress: () => console.log('Forgot Pressed'), style: 'cancel' }, // eslint-disable-line no-console
          ],
        );
      });
  }

  signup() {
    this.setState({ loading: true });
    const { email, password } = this.state;
    this.props.signup({ email, password })
      .then(({ data: { signup: user } }) => {
        this.props.dispatch(setCurrentUser(user));
        this.setState({ loading: false });
      }).catch((error) => {
        this.setState({ loading: false });
        Alert.alert(
          `${capitalizeFirstLetter(this.state.div)} error`,
          error.message,
          [{ text: 'OK', onPress: () => console.log('OK pressed') }], // eslint-disable-line no-console
        );
      });
  }

  switchdiv() {
    this.setState({ div: this.state.div === 'signup' ? 'login' : 'signup' });
  }

  render() {
    const { div } = this.state;

    return (
      <KeyboardAvoidingdiv
        behavior="padding"
        style={styles.container}
      >
        {this.state.loading ?
          <div style={styles.loadingContainer}>
            <ActivityIndicator />
          </div> : undefined}
        <div style={styles.inputContainer}>
          <TextInput
            onChangeText={email => this.setState({ email })}
            placeholder="Email"
            style={styles.input}
          />
          <TextInput
            onChangeText={password => this.setState({ password })}
            placeholder="Password"
            secureTextEntry
            style={styles.input}
          />
        </div>
        <Button
          onPress={this[div]}
          style={styles.submit}
          title={div === 'signup' ? 'Sign up' : 'Login'}
          disabled={this.state.loading || !!this.props.auth.jwt}
        />
        <div style={styles.switchContainer}>
          <Text>
            { div === 'signup' ?
              'Already have an account?' : 'New to Chatty?' }
          </Text>
          <TouchableOpacity
            onPress={this.switchdiv}
          >
            <Text style={styles.switchAction}>
              {div === 'login' ? 'Sign up' : 'Login'}
            </Text>
          </TouchableOpacity>
        </div>
      </KeyboardAvoidingdiv>
    );
  }
}
Signin.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
  }),
  auth: PropTypes.shape({
    loading: PropTypes.bool,
    jwt: PropTypes.string,
  }),
  dispatch: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired,
};

const login = graphql(LOGIN_MUTATION, {
  props: ({ mutate }) => ({
    login: user =>
      mutate({
        variables: { user },
      }),
  }),
});

const signup = graphql(SIGNUP_MUTATION, {
  props: ({ mutate }) => ({
    signup: user =>
      mutate({
        variables: { user },
      }),
  }),
});

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default compose(
  login,
  signup,
  connect(mapStateToProps),
)(Signin);
