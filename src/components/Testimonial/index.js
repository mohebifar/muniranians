import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'
import styled from 'styled-components'

import { Container } from '../Layout'

const Wrapper = styled.div`
  box-shadow: 0 10px 20px 0 rgba(11, 15, 21, 0.1);
  border-radius: 6px;
  background-color: #ffffff;
  padding: 40px 20px 20px;
  line-height: 1.4;
  border: 1px solid #f3f3f3;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  position: relative;
`

const ProfilePhoto = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  position: absolute;
  top: -25px;
  left: 25px;
  border: 1px solid #f3f3f3;
`

const Description = styled.p`
  flex-grow: 1;
  font-size: 0.85em;
`

const Name = styled.div`
  color: #777;
`

const Position = styled.div`
  color: #999;
  font-size: 0.8em;
  font-style: italic;
`

const Testimonial = ({ photo, text, name, position }) => (
  <Wrapper>
    <ProfilePhoto src={photo} />
    <Description>{text}</Description>
    <Name>{name}</Name>
    <Position>{position}</Position>
  </Wrapper>
)

Testimonial.propTypes = {
  photo: PropTypes.string,
  text: PropTypes.string,
  name: PropTypes.string,
  position: PropTypes.string,
}

export default Testimonial
