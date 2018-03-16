import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'styled-components'

import { compose, withProps, branch } from 'recompose'
import { connect } from 'react-redux'
import {
  firebaseConnect,
  pathToJS,
  isLoaded,
  isEmpty,
} from 'react-redux-firebase'

import { Container, Flex } from '../Layout'

const Wrapper = styled.div`
  background: #40b7a1;
  padding: 20px 0;
`

const NavLink = styled(Link) `
  display: block;
  font-size: 0.9em;
  font-weight: 400;
  color: #fff;
  margin: 0 16px;
  padding: 10px 0;
  line-height: 15px;
  position: relative;
  cursor: pointer;
`

const LogoWrapper = styled.div`
  flex-grow: 1;
`

const Logo = styled(Link) `
  background-image: url('${require('../../images/logo.png')}');
  display: block;
  width: 168px;
  height: 32px;
  background-size: contain;
  background-repeat: no-repeat;
`

const UserBox = styled.div`
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 0.9em;
  font-weight: 100;
  margin-left: 16px;
  position: relative;
  cursor: pointer;

  .dropdown {
    position: absolute;
    top: 120%;
    background: white;
    color: #444;
    left: 0;
    right: 0;
    box-shadow: 0 0 10px #0000001f;
    z-index: 9999;

    > button {
      padding: 10px;
      width: 100%;
      background: none;
      border: none;
      text-align: left;

      &:hover {
        background: #f5f5f5;
        cursor: pointer;
      }
    }
  }

  img {
    width: 32px;
    height: 32px;
    border-radius: 16px;
    margin: 0 0 0 10px;
  }
`

class Header extends Component {
  state = {
    isOpen: false,
  }

  toggleDropDown = () => {
    this.setState(state => { return { isOpen: !state.isOpen } })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.auth !== nextProps.auth && window.drift) {
      window.drift.reset()

      if (nextProps.auth) {
        window.drift.identify(nextProps.auth.uid, { email: nextProps.auth.email })
      }
    }
  }

  render() {
    const { isAuthenticated, auth, firebase: { logout } } = this.props

    return (
      <Wrapper>
        <Container>
          <Flex
            flexDirection={['column', 'row', 'row']}
            style={{ alignItems: 'center' }}
          >
            <LogoWrapper>
              <Logo to="/" />
            </LogoWrapper>
            <Flex flexDirection={['column', 'row', 'row']}>
              {/* <NavLink to="about-us">About us</NavLink> */}
              {/* <NavLink to="help">Help us</NavLink> */}
              <NavLink to="/">Home</NavLink>
              {isAuthenticated ? (
                <UserBox onClick={this.toggleDropDown}>
                  {auth.displayName}
                  <img src={auth.photoURL} />
                  {this.state.isOpen ? (
                    <div className="dropdown">
                      <button onClick={logout}>Log out</button>
                    </div>
                  ) : null}
                </UserBox>
              ) : (
                  <NavLink to="login">Login</NavLink>
                )}
            </Flex>
          </Flex>
        </Container>
      </Wrapper>
    )
  }
}

Header.propTypes = {
  children: PropTypes.node,
  isAuthenticated: PropTypes.bool,
  firebase: PropTypes.shape({
    logout: PropTypes.func.isRequired,
  }),
  auth: PropTypes.shape({
    email: PropTypes.string,
    uid: PropTypes.string,
    displayName: PropTypes.string,
    photoURL: PropTypes.string,
  }),
}

export default compose(
  connect(({ firebase }) => {
    return {
      auth: pathToJS(firebase, 'auth'),
      account: pathToJS(firebase, 'profile'),
    }
  }),
  branch(
    () => !__SERVER__,
    compose(
      firebaseConnect(),
      withProps(props => {
        return {
          isAuthenticated: isLoaded(props.auth) && !isEmpty(props.auth),
        }
      })
    ),
    withProps(() => {
      return {
        firebase: {},
      }
    })
  )
)(Header)
