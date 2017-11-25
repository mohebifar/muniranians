import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import LaddaButton, { XS, ZOOM_OUT } from 'react-ladda'

import { Flex } from '../Layout'

const Wrapper = styled.div`
  filter: drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.3));
  font-size: 0.9rem;
  * {
    box-sizing: content-box;
  }

  .top,
  .bottom {
    > div {
      padding: 0 18px;
      &:first-child {
        padding-top: 18px;
      }
      &:last-child {
        padding-bottom: 18px;
      }
    }
    img {
      padding: 18px 0;
    }
  }
  .top,
  .bottom,
  .rip {
    background-color: #fff;
  }
  .top {
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    .deetz {
      padding-bottom: 10px !important;
    }

    .event {
      flex-grow: 1;
    }
  }
  .bottom {
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    padding: 18px;
    height: 30px;
    padding-top: 10px;
    .barcode {
      flex-grow: 1;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF4AAAABCAYAAABXChlMAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuOWwzfk4AAACPSURBVChTXVAJDsMgDOsrVpELiqb+/4c0dgstq7jmyognh2gdvg5vfxfcrizac6botnonfpvaumnmwb/71frrm8xvgykker1/g9WzMOsohaOGNziRs5inDsAn8yEPengTapJ5bmdZ2Yv7VvfPN6AH2NJx7nOWPTf1/78hoqgxhzw3ZqYG1Dr/9ur3y8vMxgNZhcAUnR4xKgAAAABJRU5ErkJggg==);
      background-repeat: repeat-y;
      min-width: 58px;
    }
    .sold-out {
      color: red;
      font-weight: bold;
      border: 2px solid;
      line-height: 1.8;
      border-radius: 6px;
      transform: rotate(-7deg);
    }
  }
  .rip {
    height: 20px;
    margin: 0 10px;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAACCAYAAAB7Xa1eAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuOWwzfk4AAAAaSURBVBhXY5g7f97/2XPn/AcCBmSMQ+I/AwB2eyNBlrqzUQAAAABJRU5ErkJggg==);
    background-size: 4px 2px;
    background-repeat: repeat-x;
    background-position: center;
    position: relative;
    box-shadow: 0 1px 0 0 #fff, 0 -1px 0 0 #fff;
    &:before,
    &:after {
      content: "";
      position: absolute;
      width: 20px;
      height: 20px;
      top: 50%;
      transform: translate(-50%, -50%) rotate(45deg);
      border: 5px solid transparent;
      border-top-color: #fff;
      border-right-color: #fff;
      border-radius: 100%;
      pointer-events: none;
    }
    &:before {
      left: -10px;
    }
    &:after {
      transform: translate(-50%, -50%) rotate(225deg);
      right: -40px;
    }
  }
  .image {
    background-size: cover;
    height: 200px;
    margin: 10px 0;
  }
  .-bold {
    font-weight: bold;
  }
`

const Ticket = ({
  image,
  quantity,
  defaultImage,
  subtitle,
  faSubtitle,
  title,
  faTitle,
  price,
  onBuyTicket,
  loading,
}) => (
  <Wrapper>
    <Flex flexDirection="column" className="top">
      <div className="bandname -bold">{title}</div>
      <div className="tourname farsi">{faTitle}</div>
      <div
        className="image"
        style={{ backgroundImage: `url(${image || defaultImage})` }}
      />
      <Flex flexDirection="row" className="deetz">
        <Flex flexDirection="column" className="event">
          <div>{subtitle}</div>
          <div className="farsi">{faSubtitle}</div>
        </Flex>
        <Flex flexDirection="column" className="price">
          <div className="label">{price === 0 ? null : 'Price'}</div>
          <div className="cost -bold">{price > 0 ? `$${price}` : 'FREE'}</div>
        </Flex>
      </Flex>
    </Flex>
    <div className="rip" />
    <Flex flexDirection="row" className="bottom">
      <div className="barcode" />

      {quantity > 0 ? (
        <LaddaButton
          loading={loading}
          onClick={onBuyTicket}
          data-color="blue"
          data-size={XS}
          data-style={ZOOM_OUT}
        >
          BUY TICKET
        </LaddaButton>
      ) : (
        <div className="sold-out">SOLD OUT</div>
      )}
    </Flex>
  </Wrapper>
)

Ticket.propTypes = {
  image: PropTypes.string,
  quantity: PropTypes.number,
  defaultImage: PropTypes.string,
  subtitle: PropTypes.string,
  faSubtitle: PropTypes.string,
  title: PropTypes.string,
  faTitle: PropTypes.string,
  price: PropTypes.number,
  onBuyTicket: PropTypes.func,
  loading: PropTypes.bool,
}

export default Ticket
