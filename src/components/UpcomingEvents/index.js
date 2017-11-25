import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'styled-components'
import Icon from 'react-fontawesome'
import moment from 'moment-timezone'

const Wrapper = styled.div`
  overflow: hidden;
  margin: 4px 0;
  padding: 10px;
  background-color: #ffffff;
  border: 1px solid #efefef;
  border-radius: 3px;
  display: flex;
  flex-direction: row;
  font-weight: 700;
`

const Date = styled.div`
  border-right: 0.25em solid #1abc9c;
  margin-right: 0.75em;
  padding-right: 0.625em;
  padding-left: 0.3em;
  text-align: center;
  width: 50px;

  .month {
    font-size: 0.75em;
  }

  .day {
    margin-top: -2px;
    font-size: 1.3em;
  }
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;

  h3 {
    font-weight: 700;
    font-size: 1.2em;
    margin: 0;
  }

  .metadata {
    font-size: 0.8em;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.5);
  }
`

const BuyTicket = styled(Link)`
  color: #289a86;
  border: 1px dashed #289a86;
  border-radius: 3px;
  padding: 10px;
  display: block;
  font-weight: 400;

  &,
  &:hover {
    transition: background-color 0.3s ease, color 0.3s ease,
      border-style 0.2s ease;
  }

  &:hover {
    color: white;
    background-color: rgba(40, 154, 134, 0.78);
    border-style: solid;
  }
`

const UpcomingEvents = ({
  id,
  name,
  description,
  startsAt,
  endsAt,
  location,
}) => (
  <Wrapper>
    <Date>
      <div className="month">{moment(startsAt).format('MMM')}</div>
      <div className="day">{moment(startsAt).format('DD')}</div>
    </Date>
    <Info>
      <h3>{name}</h3>
      <div className="metadata">
        {moment(startsAt).format('h:mm A')} to {moment(endsAt).format('h:mm A')}{' '}
        | {location.address}
      </div>
    </Info>
    <div>
      <BuyTicket to={`/events/${id}`}>
        <Icon name="ticket" /> Buy Ticket
      </BuyTicket>
    </div>
  </Wrapper>
)

UpcomingEvents.propTypes = {
  startsAt: PropTypes.number.isRequired,
  endsAt: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  description: PropTypes.string,
  location: PropTypes.shape({
    address: PropTypes.string,
  }).isRequired,
}

export default UpcomingEvents
