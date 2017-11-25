import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import Header from '../components/Header'
import Footer from '../components/Footer'

import './index.css'

const TemplateWrapper = ({ children }) => (
  <div>
    <Helmet
      title="MUNIranians - The Iranian Student Society of Memorial University"
      meta={[
        {
          name: 'description',
          content:
            'MUNIranians is an independent, cultural and social student club which continues voluntarily since 2010.',
        },
        {
          name: 'keywords',
          content:
            'persian, culture, events, newfoundland, memorial, mun, muniranians',
        },
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
