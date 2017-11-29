import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Helmet from 'react-helmet'
import { branch, compose, mapProps } from 'recompose'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import { firebaseConnect, dataToJS, pathToJS } from 'react-redux-firebase'
import _ from 'lodash'
import 'whatwg-fetch'

import { Container, Flex, Box, Panel } from '../Layout'
import PurchaseTicket from '../PurchaseTicket'
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
  static propTypes = {
    event: PropTypes.object.isRequired,
    eventId: PropTypes.string.isRequired,
    auth: PropTypes.object,
  }

  state = {
    buying: null,
    modalOpen: false,
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

  handleBuyTicket = async (ticketId) => {
    this.setState({
      ticketId,
      modalOpen: true,
    })
  }

  render() {
    const { event, eventId, auth } = this.props

    return (
      <div>
        <Modal
          isOpen={this.state.modalOpen}
          contentLabel="Ticket Purchase"
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              transform: 'translate(-50%, -50%)',
              maxWidth: '100%',
              minWidth: '40vw',
              overflowY: 'auto',
              maxHeight: '98vh',
            },
          }}
        >
          <PurchaseTicket
            event={event}
            close={this.closeModal}
            eventId={eventId}
            ticketId={this.state.ticketId}
          />
        </Modal>

        <Helmet
          title={`${event.name} - MUNIranians`}
          meta={[
            { name: 'description', content: event.description },
          ]}
        />
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
            <Flex flexWrap="wrap" flexDirection={['column', 'row', 'row']}>
              {Object.keys(_.get(event, 'tickets', {})).map(key => (
                <Box width={[1, 1 / 2, 1 / 3]} p={[2, 2, 2]} key={key}>
                  <Ticket
                    image={event.tickets[key].image}
                    title={event.tickets[key].name}
                    faTitle={event.tickets[key].faName}
                    subtitle={event.tickets[key].subtitle}
                    faSubtitle={event.tickets[key].faSubtitle}
                    actualPrice={event.tickets[key].price}
                    price={Math.max(0, event.tickets[key].price - (auth ? 1 : 0))}
                    quantity={event.tickets[key].quantity}
                    onBuyTicket={this.handleBuyTicket.bind(this, key)}
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
      connect(
        ({ firebase }) => {
          return {
            auth: pathToJS(firebase, 'auth'),
            eventRedux: dataToJS(firebase, 'event') || {},
          }
        }
      )
    )
  ),
  mapProps(props => {
    return {
      event: !_.isEmpty(props.eventRedux) ? props.eventRedux : props.preloadedEvent,
      eventId: props.eventId,
      auth: props.auth,
    }
  })
)(EventPage)
