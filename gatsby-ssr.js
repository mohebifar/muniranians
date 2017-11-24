import React from 'react'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

import createStore from './src/redux/createStore'

global.__SERVER__ = true
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

exports.replaceRenderer = ({ bodyComponent, setHeadComponents, replaceBodyHTMLString, ...rest }) => {
  const sheet = new ServerStyleSheet()

  const store = createStore()

  const ConnectedBody = () => (
    <Provider store={store}>
      <StyleSheetManager sheet={sheet.instance}>
        {bodyComponent}
      </StyleSheetManager>
    </Provider>
  )

  replaceBodyHTMLString(renderToString(<ConnectedBody />))
  setHeadComponents([sheet.getStyleElement()])
}