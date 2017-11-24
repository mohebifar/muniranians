import { createStore, compose } from 'redux'
import { reactReduxFirebase } from 'react-redux-firebase'
import rootReducer from './reducers'
import { ifClient } from '../hoc'
import config from '../config'

const reduxFirebaseConfig = {
  userProfile: 'users',
  enableRedirectHandling: false,
}

export default function create() {
  // Add redux Firebase to compose
  const composedCreateStore = compose(
    ifClient(reactReduxFirebase(config.firebase, reduxFirebaseConfig))
  )(createStore)

  // Create store with reducers and initial state
  const initialState = {}
  const store = composedCreateStore(rootReducer, initialState)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
