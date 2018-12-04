import React, { Component } from 'react'
import { tween } from 'react-imation'
import { Track, TrackDocument } from 'react-track'
import {
  rgb,
  scale,
  rotate,
  translate3d,
  translate,
} from 'react-imation/tween-value-factories'
import { calculateScrollY } from 'react-track/tracking-formulas'
import { Easer } from 'functional-easing'
import styled from 'styled-components'

import { Flex, Box } from '../Layout'

const easing = new Easer().using('in-cubic')

const Wrapper = styled(Flex)`
  @media screen and (min-width: 52em) and (min-height: 650px) {
    height: calc(50vh - 40px);
  }
`

class AboutSection extends Component {
  renderSvg(scrollY) {
    return Path => {
      const posTop = 0
      const scale1Style = tween(
        scrollY,
        [[posTop, scale(2.5)], [posTop + 200, scale(1)]],
        easing
      )

      const translate1Style = tween(
        scrollY,
        [[posTop, translate(-800, -900)], [posTop + 200, translate(0, 0)]],
        easing
      )

      const scaleStyle = tween(
        scrollY,
        [[posTop, scale(1.8)], [posTop + 200, scale(1)]],
        easing
      )

      const translateStyle = tween(
        scrollY,
        [[posTop, translate(-450, -600)], [posTop + 200, translate(0, 0)]],
        easing
      )

      const rotateStyle = tween(
        scrollY,
        [[posTop, rotate(30)], [posTop + 200, rotate(0)]],
        easing
      )

      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 899 470"
          style={{ padding: '20px 0' }}
        >
          <g>
            <Path
              style={{ fill: '#ffffff' }}
              d="M710,75s-33.217,32.878-106,59c-45.866,16.462-82.038,59.571-82.038,59.571L517,268.929V284L775,123.238,772,106"
            />
            <Path
              style={{
                transform: `${translateStyle} ${rotateStyle} ${scaleStyle}`,
                fill: '#ed1c24',
              }}
              d="M599.018,276.633C526,320.943,528.543,343.308,515,363.918c-5.962-37.179-2.77-80.4,1.909-90.465,3.417-7.352,15.5-15.06,21-22.464,20.866-28.079,50.974-44.954,82.745-61.642,23.779-12.49,48.076-20.9,71.289-32.732,20.594-10.5,40.86-24.7,59.2-37.866,7.722-5.545,16.449-13.95,24.187-8.344,7.719,17.039,39.16,44.807,38.19,54.554-21.777,10.758-46.07,25.914-105,49.384C630.575,245.388,644.434,249.072,599.018,276.633ZM526,361"
            />
            <Path
              style={{
                transform: `${translate1Style} ${rotateStyle} ${scale1Style}`,
                fill: '#00a651',
              }}
              d="M672.72,44.048c3.072,0,3.333-6.818,9.216,0,5.834,10.445,15.744,21.6,26.112,27.648,3.6,2.809,1.716,5.358,0,6.144-49.664,46.9-140.928,55.8-181.248,119.808-5.989,5.033-5.607,4.782-6.144,0q0.768-26.877,1.536-53.76c20.564-31.864,71.554-41.138,105.984-59.9C645.709,74.428,658.614,57.291,672.72,44.048Z"
            />
          </g>
          <Path
            style={tween(
              scrollY,
              [
                [
                  posTop + 100,
                  {
                    fill: rgb(145, 0, 50),
                    opacity: 0,
                    transform: translate3d(-10, 0, 0),
                  },
                ],
                [
                  posTop + 190,
                  {
                    fill: rgb(145, 0, 50),
                    opacity: 1,
                    transform: translate3d(0, 0, 0),
                  },
                ],
              ],
              easing
            )}
            d="M607.211,457.828q-0.838-55.413-1.678-110.838c-5.395,74.226-40.3,121.841-141.2,117.922-26.617-1.034-50.374-7.609-68.608-19.456-38.549-25.045-36.755-63.617-56.982-108.542V459.508c-20.782.585-51.865,0.989-69.994,0.284-1.119-59.332-1.037-122.324-2.155-181.656v5.038c-25.679,25.479-30.863,141.528-57.049,176.334H150.821q-27.682-92.356-55.37-184.731l-3.356,5.038c7.8,28.582,6.733,159.841-3.356,181.372H87.061c-21.251-1.679-42.818,1.308-64.069-.371,0-.56.309-5.787,0.309-6.346l10.068-28.55q-0.839-45.338-1.678-90.686l8.39-36.946c-1.731-6.49-10.962-10.508-13.423-15.114v-53.74L1.488,162.259l1.678-1.679,52.015-5.038L97.129,158.9c18.5-3.229,27.433-9.883,50.338-10.077q16.776,84.8,33.558,169.617H182.7q0.84-1.68,1.678-3.359Q202,227.764,219.615,140.428c81.3-2.9,136.736-38.077,206.382-45.343V348.669c12.908,38.08,87.643,59.306,87.251,0,3.915,0,2.469-3.565,6.384-3.565,15.108-70.953,153.041-119.74,216.777-150.937,17.693-8.659,62.863-33.8,73.828-30.228q1.679-81.441,3.356-162.9h83.9V457.828H811.915c-8.9-3.434-12.775-16.278-18.457-23.511-13.534-17.228-87.617-112.655-100.674-117.556V457.828H607.211Zm60.4-418.162c9.321-.144,10.029-1.126,13.424,5.038-15.811,9.391-29.291,26.512-45.3,36.946l-75.5,33.587-38.592,33.587V63.177h3.356Z"
          />
        </svg>
      )
    }
  }

  render() {
    return (
      <Wrapper
        flexDirection={['column', 'column', 'row']}
        style={{ paddingTop: 30 }}
      >
        <Box width={[1, 1, 1 / 3]} p={[3, 3, 3]}>
          <TrackDocument formulas={[calculateScrollY]}>
            {scrollY => (
              <Track component="path">{this.renderSvg(scrollY)}</Track>
            )}
          </TrackDocument>
        </Box>
        <Box width={[1, 1, 2 / 3]} p={[3, 3, 3]}>
          <p>
          <strong>MUNIranians</strong>, established in 2010, is a volunteer-based independent student club at the Memorial University of Newfoundland (MUN). We made it our mission to maintain and proclaim the Iranian culture by promoting proper social mediums. Concurrently, we support our members by offering academic assistance. At MUNIranians we proudly organize social activities to unify and support the Iranian community while cultivating and celebrating Iranian culture with other citizenries.
          </p>
        </Box>
      </Wrapper>
    )
  }
}

export default AboutSection
