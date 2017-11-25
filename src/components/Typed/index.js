import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Typed extends Component {
  static propTypes = {
    strings: PropTypes.arrayOf(PropTypes.string).isRequired,
  }

  componentDidMount() {
    const { strings } = this.props

    const options = {
      // required - for now, only accepting texts
      strings,
      // optional
      typeSpeed: 55, // default
      // optional
      backSpeed: 45, // default
      // optional
      startDelay: 500, // default
      // optional
      backDelay: 500, // default
      // optional
      loop: true, // default
      // optional
      showCursor: true, // default
      // optional
      cursorChar: '|', // default
    }

    // this.el refers to the <span> in the render() method
    this.typed = require('ityped').init(this.el, options)
  }

  componentWillUnmount() {
    // Make sure to destroy Typed instance on unmounting
    // to prevent memory leaks
    require('ityped').destroy(this.el)
  }

  render() {
    return (
      <span
        style={{ whiteSpace: 'pre' }}
        ref={el => {
          this.el = el
        }}
      />
    )
  }
}

export default Typed
