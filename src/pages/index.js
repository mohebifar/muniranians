import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Container, Flex, Box } from '../components/Layout'
import Testimonial from '../components/Testimonial'
import AboutSection from '../components/AboutSection'
import UpcomingEvents from '../components/UpcomingEvents'
import HelpBanner from '../components/HelpBanner'

const Jumbotron = styled.div`
  background-color: #44c3ac;
  background-image: url(${require('../images/pattern.png')});
  background-size: 30%;
  padding: 60px 0;
  text-align: center;
  color: white;

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
      'Studying a Ph.D. in Memorial University was a great opportunity for me to flourish both in  scientific research as well as other aspects of my life. Although being in a new environment far from my home country made me be under a lot of pressure, having such a congenial atmosphere with lots of helping and warm Iranian friends ease every tension for me!',
    photo:
      'https://scontent.fyqm1-1.fna.fbcdn.net/v/t31.0-8/21994118_10155770527339764_4655392796706713389_o.jpg?oh=116ae529adb921ba8bf22201b5f2df2d&oe=5A9F3A50',
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
    <Jumbotron>
      <h1>
        The <strong>Iranians</strong> <br /> Student Society
      </h1>
    </Jumbotron>

    <Container>
      <AboutSection />
    </Container>

    <Container fluid style={{ background: '#f9f9f9' }}>
      <Container>
        <Flex
          flexDirection="column"
          style={{ paddingTop: 40, paddingBottom: 40, marginTop: 20 }}
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
