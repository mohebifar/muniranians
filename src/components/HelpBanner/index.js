import React from 'react'
import styled from 'styled-components'

import Typed from '../Typed'

const Wrapper = styled.div`
  background: #44c3ac;
  padding: 50px 0;
  color: white;
  text-align: center;

  h3 {
    font-weight: 300;
    font-size: 2em;
    margin-bottom: 10px;
  }

  h4 {
    font-size: 1em;
    font-weight: 200;
    color: rgba(255, 255, 255, 0.9);
  }
`

const Button = styled.a`
  padding: 10px 20px;
  color: white;
  border-radius: 3px;
  border: 1px solid white;
  margin-top: 5px;
  display: inline-block;
`

const Testimonial = ({ photo, text, name, position }) => (
  <Wrapper>
    <h3>
      Do you know{' '}
      <Typed
        strings={[
          'dancing',
          'photography',
          'film production',
          'singing',
          'narrating',
          'music',
          'cooking',
        ]}
      />?
    </h3>
    <h4>Helping MUNIranians can be really fun!</h4>

    <Button>Get involved</Button>
  </Wrapper>
)

export default Testimonial
