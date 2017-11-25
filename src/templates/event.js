import React from 'react'
import PropTypes from 'prop-types'

import EventPage from '../components/Event'

const Event = ({ pathContext }) => <EventPage {...pathContext} />

Event.propTypes = {
  pathContext: PropTypes.shape({
    preloadedEvents: PropTypes.array,
  }),
}

export default Event
