import React, { Component } from 'react'
import * as PropTypes from 'prop-types'

const propTypes = {
  headComponents: PropTypes.node.isRequired,
  body: PropTypes.node.isRequired,
  postBodyComponents: PropTypes.node.isRequired,
}

class Html extends Component {
  render() {
    return (
      <html op="news" lang="en">
        <head>
          {this.props.headComponents}

          <meta name="referrer" content="origin" />
          <meta charSet="utf-8" />
          {process.env.NODE_ENV === 'production' ? (
            <link href="/styles.css" rel="stylesheet" type="text/css" />
          ) : null}
          <link
            href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700"
            rel="stylesheet"
            type="text/css"
          />
          <link
            href="https://cdn.rawgit.com/rastikerdar/vazir-font/v16.1.0/dist/font-face.css"
            rel="stylesheet"
            type="text/css"
          />
          <link
            href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
            rel="stylesheet"
            type="text/css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/Ladda/1.0.0/ladda.min.css"
          />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link rel="shortcut icon" href="/favicons/favicon.ico" type="image/x-icon" />
          <link rel="icon" href="/favicons/favicon-16x16.png" sizes="16x16" type="image/png" />
          <link rel="icon" href="/favicons/favicon-32x32.png" sizes="32x32" type="image/png" />
        </head>
        <body>
          <div
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: this.props.body }}
          />
          {this.props.postBodyComponents}
        </body>
      </html>
    )
  }
}

Html.propTypes = propTypes

module.exports = Html
