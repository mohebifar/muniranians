import React from 'react'
import PropTypes from 'prop-types'

import CompetitionPage from '../components/Competition'

const Competition = ({ pathContext }) => <CompetitionPage {...pathContext} />

Competition.propTypes = {
  pathContext: PropTypes.shape({
    preloadedCompetition: PropTypes.object,
  }),
}

export default Competition
