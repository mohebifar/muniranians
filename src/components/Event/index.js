import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Helmet from 'react-helmet'
import { branch, compose, mapProps } from 'recompose'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import moment from 'moment'
import Icon from 'react-fontawesome'
import { firebaseConnect, dataToJS, pathToJS } from 'react-redux-firebase'
import _ from 'lodash'
import 'whatwg-fetch'
import load from 'little-loader'

import { Container, Flex, Box, Panel } from '../Layout'
import PurchaseTicket from '../PurchaseTicket'
import Ticket from '../Ticket'

import config from '../../config'

const Jumbotron = styled.div`
  position: relative;
  background-color: #44c3ac;
  background-size: cover;
  background-position: center 60%;
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
`

const Description = styled.div`
  font-size: 0.9rem;
  p {
    margin-bottom: 5px;
  }
`

const Spacer = styled.div`
  margin-top: 50px;
`

const LoginOffer = styled.div`
  margin-top: 50px;
  background: #2a8bb1;
  color: white;
  text-align: center;
  padding: 20px;

  button {
    border: none;
    background: none;
    color: #efefef;
    outline: none;
    border-bottom: 1px solid white;
    border-radius: 0;
    cursor: pointer;

    &:hover {
      opacity: .8;
    }
  }
`

const DateTime = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: #00000038;
  padding: 15px 0;
`

class EventPage extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    eventId: PropTypes.string.isRequired,
    auth: PropTypes.object,
    firebase: PropTypes.object,
  }

  state = {
    buying: null,
    modalOpen: false,
  }

  componentDidMount() {
    if (this.props.event.eventBriteId) {
      const eventId = this.props.event.eventBriteId
      load('https://www.eventbrite.com/static/widgets/eb_widgets.js', () => {
        var exampleCallback = function () {
          console.log('Order complete!')
        }

        window.EBWidgets.createWidget({
          widgetType: 'checkout',
          eventId,
          iframeContainerId: `eventbrite-widget-container-${eventId}`,
  
          iframeContainerHeight: 425,
          onOrderComplete: exampleCallback,
        })
      })
    }
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
    const { event, eventId, auth, firebase } = this.props
    const tickets = _.get(event, 'tickets', null)

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
            { name: 'description', content: event.metaDescription },
          ]}
        />
        <Jumbotron style={{ backgroundImage: `url(${event.coverPhoto})` }}>
          <h1>{event.name}</h1>
          <h2 className="farsi">{event.faName}</h2>
          <DateTime>
            <Icon name="calendar" />
            {' '}
            {moment(event.startsAt).format('MMM DD YYYY, h:mm A')}
            {' - '}
            {moment(event.endsAt).format('h:mm A')}
          </DateTime>
        </Jumbotron>

        <Container>
          <Flex flexDirection={['column', 'row', 'row']}>
            <Box width={[1, 1 / 2, 15 / 24]} p={[2, 1, 1]}>
              <Panel>
                <Description
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />

                {
                  event.eventBriteId ? (
                    <div id={`eventbrite-widget-container-${event.eventBriteId}`} />
                  ) : null
                }
              </Panel>
            </Box>
            <Box width={[1, 1 / 2, 9 / 24]} p={[2, 1, 1]}>
              <Panel>
                <Address><Icon name="map-marker" /> {_.get(event, 'location.address', '')}</Address>
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
        <Spacer />
        {
          tickets ? (
            <TicketArea>
              <Container>
                <Flex flexWrap="wrap" flexDirection={['column', 'row', 'row']}>
                  {Object.keys(tickets).map(key => (
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
          ) :
            null
        }
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
      firebase: props.firebase,
    }
  })
)(EventPage)
