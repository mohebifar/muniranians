import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'

import Header from '../components/Header'
import Footer from '../components/Footer'

import './index.css'

const TemplateWrapper = ({ children }) => (
  <div>
    <Helmet
      title="MUNIranians - The Iranian Student Society of Memorial University"
      meta={[
        { name: 'description', content: 'Sample' },
        { name: 'keywords', content: 'sample, something' },
      ]}
    />
    <Header />
    <div>{children()}</div>
    <Footer />
  </div>
)

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper
