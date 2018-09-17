import React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'

const Wrapper = styled.div`
  background: #eee;
  padding: 50px 0;
  color: #333;
  text-align: center;

  h3 {
    font-weight: 300;
    font-size: 1.7em;
    margin-bottom: 10px;
  }

  h4 {
    font-size: 1em;
    font-weight: 200;
  }
`

const Button = styled(Link)`
  padding: 10px 20px;
  color: #444;
  font-weight: bold;
  border-radius: 3px;
  border: 1px solid #888;
  margin-top: 5px;
  display: inline-block;

  &:hover {
    background-color: #9b0139;
    color: white;
  }

  &, &:hover {
    transition: background-color .3s ease, color .3s ease;
  }
`

const GuideSection = () => (
  <Wrapper>
    <h3 className="farsi">
      راهنمای ورودی‌های جدید
    </h3>
    <h4>Guide for Newcomers <small>(Persian)</small></h4>

    <Button className="farsi" to="/guides">مطالعه راهنمای ورودی‌های جدید</Button>
  </Wrapper>
)

export default GuideSection
