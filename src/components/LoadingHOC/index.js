import React from 'react'
import styled from 'styled-components'
import { isLoaded } from 'react-redux-firebase'
import { branch, renderComponent } from 'recompose'

const Loader = props => {
  let Component = 'div'
  if (!__SERVER__) {
    Component = require('halogen/SyncLoader')
  }

  return <Component {...props} />
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 138px);
`

const Loading = () => (
  <Wrapper>
    <Loader color="#26A65B" size="16px" margin="4px" />
  </Wrapper>
)

const loadingHoc = selector =>
  branch(props => !isLoaded(selector(props)), renderComponent(Loading))

export default loadingHoc
