import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createHttpLink } from 'apollo-link-http';
import { createStore, /* combineReducers, */ applyMiddleware } from 'redux';
import { ReduxCache, apolloReducer } from 'apollo-cache-redux';
import ReduxLink from 'apollo-link-redux';
import { onError } from 'apollo-link-error';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { persistStore, persistCombineReducers } from 'redux-persist';
import thunk from 'redux-thunk';
import { setContext } from 'apollo-link-context';

import storage from 'redux-persist/es/storage';

import { App } from './App';

const httpLink = createHttpLink({ uri: 'http://localhost:8080/graphiql' });
const config = {
  key: 'root',
  storage,
  // blacklist: ['nav'], // don't persist nav for now
};

const reducer = persistCombineReducers(config, {
  apollo: apolloReducer,
  auth: 'token123456',
});

export const store = createStore(
  reducer,
  {}, // initial state
  composeWithDevTools(applyMiddleware(thunk)),
);

// persistent storage
export const persistor = persistStore(store);

const cache = new ReduxCache({ store });

const reduxLink = new ReduxLink(store);

// middleware for requests
const middlewareLink = setContext((req, previousContext) => {
  // get the authentication token from local storage if it exists
  const { jwt } = store.getState().auth;
  if (jwt) {
    return {
      headers: {
        authorization: `Bearer ${jwt}`,
      },
    };
  }

  return previousContext;
});

// afterware for responses
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    // eslint-disable-next-line
    console.log({ graphQLErrors });
    graphQLErrors.forEach(({ message, locations, path }) => {
      // eslint-disable-next-line
      console.log({ message, locations, path });
      if (message === 'Unauthorized') {
        // eslint-disable-next-line
        console.log('logout()');
      }
    });
  }
  if (networkError) {
    // eslint-disable-next-line
    console.log('[Network error]:');
    // eslint-disable-next-line
    console.log({ networkError });
    if (networkError.statusCode === 401) {
      // eslint-disable-next-line
      console.log('logout()');
    }
  }
});

// Create WebSocket client
export const wsClient = new SubscriptionClient('ws://localhost:8080/subscriptions', {
  lazy: true,
  reconnect: true,
  connectionParams() {
    // get the authentication token from local storage if it exists v
    return {
      jwt: store.getState().auth && store.getState().auth.jwt ? store.getState().auth.jwt : null,
    };
  },
});

const webSocketLink = new WebSocketLink(wsClient);

const requestLink = ({ queryOrMutationLink, subscriptionLink }) =>
  ApolloLink.split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    subscriptionLink,
    queryOrMutationLink,
  );

const link = ApolloLink.from([
  reduxLink,
  errorLink,
  requestLink({
    queryOrMutationLink: middlewareLink.concat(httpLink),
    subscriptionLink: webSocketLink,
  }),
]);

export const client = new ApolloClient({
  link,
  cache,
});


const WrappedApp = (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

render(WrappedApp, document.getElementById('root'));
