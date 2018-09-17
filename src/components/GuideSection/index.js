import React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'

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

const Button = styled(Link)`
  padding: 10px 20px;
  color: white;
  border-radius: 3px;
  border: 1px solid white;
  margin-top: 5px;
  display: inline-block;

  &:hover {
    background-color: white;
    color: #44c3ac;
  }

  &, &:hover {
    transition: background-color .3s ease, color .3s ease;
  }
`

const HelpBanner = () => (
  <Wrapper>
    <h3 className="farsi">
      راهنمای ورودی‌های جدید
    </h3>
    <h4>Guide for Newcomers <small>(Persian)</small></h4>

    <Button className="farsi" to="/guides">مطالعه راهنمای ورودی‌های جدید</Button>
  </Wrapper>
)

export default HelpBanner
