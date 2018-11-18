import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { branch, compose, withProps } from 'recompose'
import { connect } from 'react-redux'
import { firebaseConnect, dataToJS } from 'react-redux-firebase'
import qs from 'qs'
import _ from 'lodash'
import 'whatwg-fetch'
import QRCode from 'qrcode.react'
import Icon from 'react-fontawesome'

import { Container, Flex, Box, Panel } from '../components/Layout'
import loadingHOC from '../components/LoadingHOC'

import config from '../config'

const Jumbotron = styled.div`
  background-color: #44c3ac;
  background-image: url(${require('../images/yalda.jpg')});
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

const Description = styled.div`
  font-size: 0.9rem;
  p {
    margin-bottom: 5px;
  }
`

const Button = styled.a`
  border: 1px solid #eee;
  background: #f9f9f9;
  padding: 10px;
  cursor: pointer;

  &:hover {
    background: #fcfcfc;
  }
`

class AttendeePage extends Component {
  state = {
    downloadUrl: null,
  }

  componentDidMount() {
    // const jsPDF = require('jspdf')
    // const canvas = document
    //   .querySelector('.attendee-info canvas')
    //   .toDataURL('image/jpeg', 1.0)
    // const pdf = new jsPDF()
    // pdf.text(`Thank you for buying a ticket for ${event.name}!`, 20, 20)
    // pdf.text(`See you in ${event.location.address}`, 20, 30)
    // pdf.addImage(canvas, 'JPEG', 70, 40)
    // pdf.save(`${event.name}-ticket.pdf`)
    this.props.firebase
      .storage()
      .refFromURL(`gs://muniranians-tickets/${this.props.attendeeId}.pdf`)
      .getDownloadURL()
      .then(downloadUrl => {
        this.setState({ downloadUrl })
      })
  }

  render() {
    const { attendeeId, event } = this.props

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
                <Description className="attendee-info">
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <QRCode value={`attendee/${attendeeId}`} />
                    <div style={{ marginLeft: 20 }}>
                      Please download your ticket and bring it with you to the
                      event. You can either print out a paper copy OR simply have a
                      copy of the file on your smartphone.
                      <div style={{ paddingTop: 15 }}>
                      {
                        this.state.downloadUrl && (
                          <Button target="_blank" href={this.state.downloadUrl}>
                            <Icon name="ticket" /> Download Your Ticket
                          </Button>
                        )
                      }
                      </div>
                    </div>
                  </div>
                </Description>
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
        <div style={{ marginBottom: 50 }} />
      </div>
    )
    
  }
}
AttendeePage.propTypes = {
  attendeeId: PropTypes.string,
  attendee: PropTypes.object,
  event: PropTypes.shape({
    name: PropTypes.string,
    faName: PropTypes.string,
    location: PropTypes.shape({
      lat: PropTypes.number,
      lon: PropTypes.number,
      address: PropTypes.string,
    }),
  }),
  firebase: PropTypes.shape({
    storage: PropTypes.func.isRequired,
  }).isRequired,
}

export default compose(
  withProps(props => {return {
    attendeeId: qs.parse(props.location.search.replace(/^\?/, '')).id,
  }}),
  branch(
    () => !__SERVER__,
    firebaseConnect(props => [
      {
        path: `attendees/${props.attendeeId}`,
        storeAs: 'attendee',
      },
    ])
  ),
  connect(state => {return {
    attendee: dataToJS(state.firebase, 'attendee') || {},
  }}),
  branch(
    () => !__SERVER__,
    firebaseConnect(props => [
      {
        path: `events/${props.attendee.eventId}`,
        storeAs: 'event',
      },
    ])
  ),
  loadingHOC(props => props.attendee),
  connect(state => {return {
    event: dataToJS(state.firebase, 'event') || {},
  }})
)(AttendeePage)
