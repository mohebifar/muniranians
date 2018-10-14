import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Helmet from 'react-helmet'

import { Container, Flex, Box } from '../components/Layout'
import Testimonial from '../components/Testimonial'
import AboutSection from '../components/AboutSection'
import UpcomingEvents from '../components/UpcomingEvents'
import HelpBanner from '../components/HelpBanner'
import GuideSection from '../components/GuideSection'

const Jumbotron = styled.div`
  background-color: #44c3ac;
  background-image: url(${require('../images/pattern.png')});
  background-size: 30%;
  padding: 60px 0;
  text-align: center;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;

  @media screen and (min-width: 52em) and (min-height: 650px) {
    height: calc(50vh - 35px);
  }

  h1 {
    font-weight: 100;
    font-size: 3em;

    strong {
      font-weight: 400;
    }
  }
`

const testimonials = [
  {
    name: 'Mohamad',
    position: 'Chemistry Student at MUN',
    text:
      'I have joined MUN Iranian not too long ago. Durning my membership, I was able to reunite with Persian culture and find great friends. They accommodate professional and favorable Persian events that I think is beyond the capacity of a volunteer-based student society. I am appreciative of the contributors\' endeavors, and I hope they always keep up the excellent work.',
    photo:
      'https://pbs.twimg.com/profile_images/850830563695046656/0j9F2FV0_400x400.jpg',
  },
  {
    name: 'Hoda',
    position: 'Ph.D. Candidate Civil Engineering',
    text:
      'Doing Ph.D. in Memorial University was a great opportunity for me to flourish both in scientific research as well as other aspects of my life. Although being in a new environment far from my home country put me under a lot of pressure, having such a congenial atmosphere with lots of helping and Iranian friends ease every tension for me!',
    photo:
      'https://firebasestorage.googleapis.com/v0/b/muniranians-121f4.appspot.com/o/contests%2Fauthors%2Fhoda.jpg?alt=media&token=786852fc-871f-4a3a-a0ef-47bc7e1a9164',
  },
  {
    name: 'Mehran',
    position: 'Ph.D. Student Mechanical Engineering',
    text:
      'As a Graduate Researcher in Mechanical Engineering Programs, I have found The engineering faculty logically big, so you\'ll find a variety of people, and it is perfect regarding the overall education. Central Campus is lovely on the outside, but it still has a way to go to improve campus life for international students.',
    photo: require('../images/mehran.jpg'),
  },
]

const IndexPage = ({ pathContext: { events } }) => (
  <div>
    <Helmet>
      <title>MUNIranians - The Iranians Student Society of Memorial University of Newfoundland</title>
      <meta name="description" content="انجمن دانشجویان ایرانی دانشگاه مموریال نیوفاوندلند" />
      <meta name="keywords" content="Memorial University, Iranian, MUNIranians, ایرانیان کانادا, ایرانی های کانادا, ایرانی, نیوفاوندلند, سنت جونز, سینت‌جانز, سینت جانز, دانشگاه مموریال, ایرانیان دانشگاه مموریال نیوفاندلند" />
      <meta property="og:title" content="MUNIranians" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://muniranians.com/" />
      <meta property="og:image" content={require('!!file!../images/logo.png')} />
      <meta property="og:description" content="The Iranians Student Society of Memorial University of Newfoundland" />
    </Helmet>

    <Jumbotron>
      <h1>
        The <strong>Iranians</strong> <br /> Student Society
      </h1>
    </Jumbotron>

    <Container>
      <AboutSection />
    </Container>

    <GuideSection />

    <Container fluid style={{ background: '#f9f9f9' }}>
      <Container>
        <Flex
          flexDirection="column"
          style={{ paddingTop: 40, paddingBottom: 40 }}
        >
          <h2>Events</h2>
          {events
            ? events.map(({ node: event }) => (
                <UpcomingEvents key={event.id} id={event.id} {...event} />
              ))
            : null}
        </Flex>
      </Container>
    </Container>

    <HelpBanner />

    <Container>
      <Flex
        wrap
        flexDirection={['column', 'row', 'row']}
        style={{ padding: '50px 0' }}
      >
        {testimonials.map((item, index) => (
          <Box key={index} width={[1, 1 / 3, 1 / 3]} p={[3, 1, 1]}>
            <Testimonial {...item} />
          </Box>
        ))}
      </Flex>
    </Container>
  </div>
)

IndexPage.propTypes = {
  pathContext: PropTypes.shape({
    events: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string,
      startsAt: PropTypes.any,
      endsAt: PropTypes.any,
    })),
  }),
}

export default IndexPage
