import React from 'react'
import styled from 'styled-components'
import 'whatwg-fetch'
import Icon from 'react-fontawesome'
import Helmet from 'react-helmet'
import GatsbyLink from 'gatsby-link'

import { Container, Flex, Box, Panel } from '../components/Layout'

const Jumbotron = styled.div`
  background-color: #8a9694;
  background-blend-mode: multiply;
  background-image: url(https://upload.wikimedia.org/wikipedia/commons/c/ce/New_Residence%2C_Memorial_University_of_Newfoundland.jpg);
  background-size: cover;
  background-position: center 30%;
  padding: 120px 0;
  text-align: center;
  color: white;
  margin-bottom: 50px;
  text-shadow: 0 0 25px #000;

  h1 {
    font-weight: 400;
    font-size: 2.5em;
  }

  h2 {
    font-weight: 300;
  }
`

const Button = styled(GatsbyLink)`
  display: block;
  text-align: center;
  border: 1px solid #dadada;
  border-radius: 5px;
  padding: 10px;
  color: #777;

  > .icon {
    font-size: 3.5em;
    margin-bottom: 10px;
  }

  &:hover {
    color: #40b7a1;
    border-color: #40b7a1;
  }
`

const links = [
  {
    title: 'اسکان و محل اقامت',
    path: '/guides/accommodation',
    icon: 'home',
  },
  {
    title: 'بانک و افتتاح حساب',
    path: '/guides/banks',
    icon: 'money',
  },
  {
    title: 'ورود به سینت‌جانز',
    path: '/guides/coming-to-st-johns',
    icon: 'plane',
  },
  {
    title: 'بیمه درمانی',
    path: '/guides/health-insurance',
    icon: 'user-md',
  },
  {
    title: 'حمل و نقل شهری',
    path: '/guides/transportation',
    icon: 'bus',
  },
  {
    title: 'جاذبه‌های گردشگری',
    path: '/guides',
    icon: 'tripadvisor',
  },
]

const GuidesPage = () => (
  <div>
    <Helmet>
      <title>راهنمای ورودی‌های جدید - مان‌ایرانیان</title>
      <meta name="description" content="راهنمای ورود به سینت‌جانز نیوفاوندلند کانادا برای دانشجویان جدید دانشگاه مموریال" />
      <meta name="keywords" content="Memorial University, Iranian, MUNIranians, Guide, Newcomers, Persian, راهنمای ورود به کانادا, حساب بانکی کانادا, بلیت کانادا, نیوفاوندلند, Newfoundland" />
    </Helmet>
    <Jumbotron>
      <h1 className="farsi">راهنمای ورودی‌های جدید</h1>
      <h2>Guides for Newcomers</h2>
    </Jumbotron>

    <Container>
      <Panel>
        <Flex flexDirection={['column', 'row', 'row']} wrap="wrap" flexJustifyContent="space-between">
          {
            links.map(({ path, title, icon }) => (
              <Box key={path} width={[1, 1 / 2, 1 /2 ]} p={[ 5, 5, 5 ]}>
                <Button className="farsi" to={path}>
                  <div className="icon">
                    <Icon name={icon} />
                  </div>
                  <div>{title}</div>
                </Button>
              </Box>
            ))
          }
        </Flex>
      </Panel>
    </Container>
    <div style={{ marginBottom: 50 }} />
  </div>
)

GuidesPage.propTypes = {
}

export default GuidesPage
