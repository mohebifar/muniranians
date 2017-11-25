import React from 'react'
import styled from 'styled-components'

import { Container } from '../Layout'

const Wrapper = styled(Container)`
  background: #34495e;
  padding: 20px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-size: 0.7em;

  a {
    color: white;

    &:hover {
      color: rgba(255, 255, 255, 0.8);
    }
  }
`

const Footer = () => (
  <Wrapper fluid>
    Designed and implemented by{' '}
    <a href="https://twitter.com/mohebifar">@mohebifar</a>
    {' - '}
    <a target="__blank" href="https://github.com/mohebifar/muniranians">
      Source code
    </a>
  </Wrapper>
)

export default Footer
