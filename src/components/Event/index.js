import React, { Component } from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'
import { branch, compose, withProps } from 'recompose'
import { connect } from 'react-redux'
import {
  firebaseConnect,
  isLoaded,
  isEmpty,
  dataToJS,
  pathToJS,
} from 'react-redux-firebase'
import qs from 'qs'
import _ from 'lodash'
import 'whatwg-fetch'

import { Container, Flex, Box, Panel } from '../Layout'
import Testimonial from '../Testimonial'
import AboutSection from '../AboutSection'
import UpcomingEvents from '../UpcomingEvents'
import HelpBanner from '../HelpBanner'
import Ticket from '../Ticket'

import config from '../../config'

const Jumbotron = styled.div`
  background-color: #44c3ac;
  background-image: url(${require('../../images/yalda.jpg')});
  background-size: cover;
  padding: 60px 0;
  text-align: center;
  color: white;
  margin-bottom: 50px;
  text-shadow: 0 0 25px #000;

  h1 {
    font-weight: 400;
    font-size: 2.5em;
  }

  h2 {
    font-weight: 300;
  }
`

const MapIFrame = styled.iframe`
  width: 100%;
  height: 270px;
  margin: 0;
`

const Address = styled.p`
  font-size: 0.8em;
  margin-bottom: 10px;
`

const TicketArea = styled.div`
  background-image: linear-gradient(-45deg, #8067b7, #ec87c0);
  padding: 50px 0;
  margin-top: 50px;
`

const Description = styled.div`
  font-size: 0.9rem;
  p {
    margin-bottom: 5px;
  }
`

class EventPage extends Component {
  state = {
    buying: null,
  }

  handleBuyTicket = async (eventId, ticketId) => {
    this.setState({
      buying: ticketId,
    })
    try {
      const buyTicketUrl = `${config.firebase.functionsBaseUrl}/buyTicket`
      const result = await fetch(buyTicketUrl, {
        method: 'POST',
        body: JSON.stringify({
          eventId,
          ticketId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const json = await result.json()
      window.location.href = json.redirectTo
    } catch (error) {
      console.error(error)
      alert('There was an error while initiating the payment request')
    }
  }

  render() {
    const { eventId, event } = this.props

    return (
      <div>
        <Jumbotron>
          <h1>{event.name}</h1>
          <h2 className="farsi">{event.faName}</h2>
        </Jumbotron>

        <Container>
          <Flex flexDirection={['column', 'row', 'row']}>
            <Box width={[1, 1 / 2, 15 / 24]} p={[2, 1, 1]}>
              <Panel>
                <Description
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </Panel>
            </Box>
            <Box width={[1, 1 / 2, 9 / 24]} p={[2, 1, 1]}>
              <Panel>
                <Address>{_.get(event, 'location.address', '')}</Address>
                {_.has(event, 'location') ? (
                  <MapIFrame
                    src={`https://www.google.com/maps/embed/v1/view?zoom=17&center=${
                      event.location.lat
                    },${event.location.lon}&key=${config.googleMaps.apiKey}`}
                    frameBorder="0"
                    allowFullScreen
                  />
                ) : null}
              </Panel>
            </Box>
          </Flex>
        </Container>
        <TicketArea>
          <Container>
            {/* JSON.stringify(event) */}
            <Flex flexWrap="wrap" flexDirection={['column', 'row', 'row']}>
              {Object.keys(_.get(event, 'tickets', {})).map(key => (
                <Box width={[1 / 2, 1 / 3, 1 / 3]} p={[2, 2, 2]} key={key}>
                  <Ticket
                    image={event.tickets[key].image}
                    title={event.tickets[key].name}
                    faTitle={event.tickets[key].faName}
                    subtitle={event.tickets[key].subtitle}
                    faSubtitle={event.tickets[key].faSubtitle}
                    price={event.tickets[key].price}
                    quantity={event.tickets[key].quantity}
                    onBuyTicket={this.handleBuyTicket.bind(this, eventId, key)}
                    loading={this.state.buying === key}
                    defaultImage={require('../../images/yalda.jpg')}
                  />
                </Box>
              ))}
            </Flex>
          </Container>
        </TicketArea>
      </div>
    )
  }
}

export default compose(
  branch(
    () => !__SERVER__,
    compose(
      firebaseConnect(props => [
        {
          path: `events/${props.eventId}`,
          storeAs: 'event',
        },
      ]),
      connect(state => ({
        event: dataToJS(state.firebase, 'event') || {},
      }))
    )
  )
)(EventPage)
