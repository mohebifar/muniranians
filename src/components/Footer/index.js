import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'styled-components'
import Icon from 'react-fontawesome'
import moment from 'moment-timezone'

import { Container } from '../Layout'

const Wrapper = styled(Container)`
  background: #34495e;
  padding: 20px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-size: 0.7em;

  a {
    color: white;

    &:hover {
      color: rgba(255, 255, 255, 0.8);
    }
  }
`

const UpcomingEvents = ({ title, description, start, end, location }) => (
  <Wrapper fluid>
    Designed and implemented by{' '}
    <a href="https://twitter.com/mohebifar">@mohebifar</a>
    {' - '}
    <a target="__blank" href="https://github.com/mohebifar/muniranians">
      Source code
    </a>
  </Wrapper>
)

UpcomingEvents.propTypes = {
  start: PropTypes.object,
  env: PropTypes.object,
  title: PropTypes.string,
  description: PropTypes.string,
  location: PropTypes.string,
}

export default UpcomingEvents
