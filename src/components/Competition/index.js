import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Helmet from 'react-helmet'
import { branch, compose, mapProps } from 'recompose'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import YouTube from 'react-youtube'
import Icon from 'react-fontawesome'
import Masonry from 'react-masonry-component'
import { firebaseConnect, dataToJS, pathToJS } from 'react-redux-firebase'
import _ from 'lodash'
import 'whatwg-fetch'

import { Container } from '../Layout'

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
  cursor: pointer;

  .play-icon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: white;
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.41);
    font-size: 5em;
  }

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
  padding: 10px;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;

  @media(min-width: 720px) {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
  

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

const modalStyle = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
}

class CompetitionPage extends Component {
  static propTypes = {
    competition: PropTypes.object.isRequired,
    competitionId: PropTypes.string.isRequired,
    auth: PropTypes.object,
    firebase: PropTypes.object,
  }

  state = {
    temporaryLikes: [],
    selectedItem: null,
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
      <GalleryItem
        onClick={() => this.setState({ selectedItem: key })}
        key={key}
        width={[1, 1 / 2, 1 / 3]}
        m={[2, 1, 1]}
      >
        {
          item.youtube
            ? <Icon
              className="play-icon"
              name="play-circle"
            />
            : null
        }
        <img src={item.url} />
        <CardCaption onClick={e => e.stopPropagation()}>
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
              <Icon
                name={`heart${liked ? '' : '-o'}`}
              />
            </VoteButton>
          </span>
        </CardCaption>
      </GalleryItem>
    )
  }

  renderModal() {
    const { competition } = this.props
    const { selectedItem: key } = this.state
    const item = competition.items[key]
    const liked = this.isLiked(item, key)

    return (
      <div style={{ backgroundColor: 'white' }}>
        <button
          onClick={() => this.setState({ selectedItem: null })}
          style={{ border: 'none', right: 15, top: 15, position: 'absolute', borderRadius: 5, cursor: 'pointer' }}
        >
          <Icon name="times" />
        </button>

        {
          item.youtube
            ? <YouTube
              className="Youtube-Video"
              videoId={item.youtube}
            />
            : <img src={item.url} />
        }


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
      </div>
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
          <Modal
            onRequestClose={() => this.setState({ selectedItem: null })}
            isOpen={this.state.selectedItem !== null}
            contentLabel=""
            className="Modal"
            overlayClassName="Overlay"
          >
            {
              this.state.selectedItem !== null
                ? this.renderModal()
                : null
            }
          </Modal>
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
