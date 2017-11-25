import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { branch, compose } from 'recompose'
import { connect } from 'react-redux'
import { firebaseConnect, pathToJS } from 'react-redux-firebase'
import Icon from 'react-fontawesome'

import { Container, Box } from '../components/Layout'

const Wrapper = styled.div`
  min-height: calc(100vh - 130px);
  display: flex;
  flex-direction: column;
`

const ContentWrapper = styled(Container) `
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
`

const FacebookButton = styled.button`
  background: #3b5998;
  border: none;
  color: white;
  padding: 10px;
  cursor: pointer;
  outline: none;

  &:hover {
    opacity: 0.9;
  }
`

const LoginPage = ({ firebase }) => (
  <Wrapper>
    <Container>
      <ContentWrapper>
        <Box p={2}>
          <p>
            {'By logging in to the MUNIranians system, you\'ll get up to $5 discount on any event tickets!'}
          </p>
        </Box>
        <FacebookButton
          onClick={() =>
            firebase
              .login({
                provider: 'facebook',
                type: 'popup',
              })
              .then(() => {
                window.location.href = '/'
              })
          }
        >
          <Icon name="facebook" /> Login with Facebook
        </FacebookButton>
      </ContentWrapper>
    </Container>
  </Wrapper>
)

LoginPage.propTypes = {
  firebase: PropTypes.object,
}

export default branch(
  () => !__SERVER__,
  compose(
    connect(({ firebase }) => {
      return {
        authError: pathToJS(firebase, 'authError'),
        auth: pathToJS(firebase, 'auth'),
        profile: pathToJS(firebase, 'profile'),
      }
    }),
    firebaseConnect()
  )
)(LoginPage)
