import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Helmet from 'react-helmet'
import { branch, compose, mapProps } from 'recompose'
import { connect } from 'react-redux'
import ImageGallery from 'react-image-gallery'
import Masonry from 'react-masonry-component'
import moment from 'moment'
import { firebaseConnect, dataToJS, pathToJS } from 'react-redux-firebase'
import _ from 'lodash'
import 'whatwg-fetch'

import { Container, Flex, Box, Panel } from '../Layout'
import 'react-image-gallery/styles/css/image-gallery.css'

const masonryOptions = {
  transitionDuration: 0,
}

const Jumbotron = styled.div`
  position: relative;
  background-color: #44c3ac;
  background-size: cover;
  background-position: center 70%;
  padding: 30px 0;
  text-align: center;
  color: white;
  text-shadow: 0 0 25px #000;

  h1 {
    font-weight: 400;
    font-size: 2.5em;
  }

  h2 {
    font-weight: 300;
  }
`
const GalleryItem = styled.li`
  display: block;
  width: 48%;
  margin: 15px 1%;
  border: 1px solid #eee;
  box-shadow: 0 0 15px rgba(0,0,0,0.3);
  border-radius: 5px;
  overflow: hidden;

  @media(max-width: 720px) {
    width: 90%;
    margin: 15px 5%;
  }

  > img {
    width: 100%;
    margin: 0;
    display: block;
  }

  @media(min-width: 720px) {
    &:hover {
      > img {
        transform: translateY(-50px);
      }

      > div {
        transform: translateY(0);
      }
    }

    &, &:hover {
      > div {
        transition: transform 200ms ease 100ms;
      }
      > img {
        transition: transform 300ms ease;
      }
    }

    > div {
      transform: translateY(50px);
    }
  }
`

const Wrapper = styled.div`
  .contest-gallery {
    list-style: none;
    margin: 0;
    padding: 0;
  }
`

const CardCaption = styled.div`
  background-color: white;
  margin: 0;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  

  > img {
    width: 30px;
    height: 30px;
    border-radius: 50px;
    margin: 0 10px 0 0;
  }

  > .name {
    font-size: .8em;
    color: #555;
    flex-grow: 1;
  }

  > .votes {
    font-size: .7em;
    color: #888;
    padding-right: 5px;
  }
`

const VoteButton = styled.button`
  margin: 0;
  padding: 0;
  background: none;
  border: none;
  font-size: 2em;
  margin-left: 10px;
  outline: none;
  box-shadow: none;
  cursor: pointer;

  color: ${({ liked }) => liked ? 'red' : '#444'};
  
  &:hover {
    color: red;
  }

  &, &:hover {
    transition: color 300ms ease;
  }
`

const DEFAULT_AUTHOR_PHOTO = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'

class CompetitionPage extends Component {
  static propTypes = {
    competition: PropTypes.object.isRequired,
    competitionId: PropTypes.string.isRequired,
    auth: PropTypes.object,
    firebase: PropTypes.object,
  }

  state = {
    temporaryLikes: [],
  }

  handleVote = (item, itemId) => {
    const { auth, firebase, competitionId } = this.props

    if (!auth) {
      firebase
        .login({
          provider: 'facebook',
          type: 'popup',
        })
    } else {
      const liked = this.isLiked(item, itemId)
      const ref = firebase.ref(`competitions/${competitionId}/items/${itemId}/votes/${auth.uid}`)

      if (liked) {
        this.setState({
          temporaryLikes: this.state.temporaryLikes.filter(i => i !== itemId),
        })

        ref.remove()
      } else {
        this.setState({
          temporaryLikes: [
            ...this.state.temporaryLikes,
            itemId,
          ],
        })

        ref.set({
          timestamp: Date.now(),
        })
      }
    }
  }

  isLiked = (item, key) => {
    const uid = _.get(this.props, 'auth.uid')
    const votes = item.votes ? Object.keys(item.votes) : []
    return this.state.temporaryLikes.includes(key) || votes.includes(uid)
  }

  renderItem = (item, key) => {
    const liked = this.isLiked(item, key)

    return (
      <GalleryItem key={key} width={[1, 1 / 2, 1 / 3]} m={[2, 1, 1]}>
        <img src={item.url} />
        <CardCaption>
          <img src={item.authorPhoto || DEFAULT_AUTHOR_PHOTO} />
          <span className="name">
            by {item.author}
          </span>
          <span className="votes">
            {item.votes ? Object.keys(item.votes).length : 0} votes
          <VoteButton
              liked={liked}
              onClick={() => {
                this.handleVote(item, key)
              }}
            >
              <i
                className={`fa fa-heart${liked ? '' : '-o'}`}
              />
            </VoteButton>
          </span>
        </CardCaption>
      </GalleryItem>
    )
  }

  render() {
    const { competition } = this.props

    return (
      <Wrapper>
        <Helmet
          title={`${competition.name} - MUNIranians`}
          meta={[
            { name: 'description', content: competition.name },
          ]}
        />

        <Jumbotron style={{ backgroundImage: `url(${competition.coverPhoto})` }}>
          <h1>{competition.name}</h1>
          <h2 className="farsi">{competition.faName}</h2>
        </Jumbotron>

        <Container style={{ padding: '40px 0' }}>
          <Masonry
            className="contest-gallery"
            elementType="ul"
            options={masonryOptions}
            disableImagesLoaded={false}
            updateOnEachImageLoad={false}
          >
            {
              competition.items.map(this.renderItem)
            }
          </Masonry>
          {/* <ImageGallery
            items={competition.items}
            lazyLoad={false}
            showFullscreenButton
            showThumbnails
            showNav
            thumbnailPosition="bottom"
            additionalClass="app-image-gallery"
          /> */}
        </Container>
      </Wrapper>
    )
  }
}

export default compose(
  branch(
    () => !__SERVER__,
    compose(
      firebaseConnect(props => [
        {
          path: `competitions/${props.competitionId}`,
          storeAs: 'competition',
        },
      ]),
      connect(
        ({ firebase }) => {
          return {
            auth: pathToJS(firebase, 'auth'),
            competitionRedux: dataToJS(firebase, 'competition') || {},
          }
        }
      )
    )
  ),
  mapProps(props => {
    return {
      competition: !_.isEmpty(props.competitionRedux) ? props.competitionRedux : props.preloadedCompetition,
      competitionId: props.competitionId,
      auth: props.auth,
      firebase: props.firebase,
    }
  })
)(CompetitionPage)
