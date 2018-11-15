import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Field } from 'react-final-form'
import styled from 'styled-components'
import LaddaButton, { L, ZOOM_OUT } from 'react-ladda'
import { branch, compose } from 'recompose'
import { connect } from 'react-redux'
import { firebaseConnect, pathToJS } from 'react-redux-firebase'
import 'whatwg-fetch'
import Icon from 'react-fontawesome'

import { CardElement, injectStripe } from 'react-stripe-elements'

import config from '../../config'

const required = value => (value ? undefined : 'Required')
// eslint-disable-next-line
const mustBeEmail = value => (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) ? 'Must be a valid email address' : undefined)
const composeValidators = (...validators) => value => validators.reduce((error, validator) => error || validator(value), undefined)

const Note = styled.div`
  font-weight: 700;
  font-size: 12px;
  margin-bottom: 20px;
`

const InputWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  line-height: 2em;
  margin-bottom: 15px;
  position: relative;

  & > label {
    color: #333;
    width: 110px;
    font-size: .9em;
    line-height: 32px;
  }
  & > input,
  & > select,
  & > textarea {
    flex: 1;
    padding: 3px 5px;
    font-size: .9em;
    margin-left: 15px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }
  & > input[type="checkbox"] {
    margin-top: 7px;
  }
  & > div {
    margin-left: 16px;
    & > label {
      display: block;
      & > input {
        margin-right: 3px;
      }
    }
  }
  & > span {
    margin-left: 126px;
    background: #de4e4e;
    position: absolute;
    color: white;
    font-size: 0.7em;
    padding: 2px 12px;
    border-radius: 3px;
    top: 100%;
    z-index: 999;
  }
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;

  > button {
    background: #40b7a1;
    color: white;
    border: none;
    padding: 10px;
    outline: none;
    cursor: pointer;

    &:hover {
      opacity: .7;
    }
  }
`

const PaymentMethod = styled.button`
  outline: none;
  border: 1px solid #eee;
  border-radius: 3px;
  background: #fff;
  margin-right: 10px;
  cursor: pointer;
  padding: 10px;

  &:not(:disabled):hover {
    opacity: .7;
    transition: opacity .3s ease;
  }

  ${props => props.active ? `box-shadow: 0 0 2px #5f9eea;
  border-color: #3aadff;` : null}

  &:disabled {
    cursor: not-allowed;
    img {
      filter: grayscale(100%);
      opacity: .3
    }
  }
`

const Image = styled.img`
  height: 80px;
  margin: 0;
`

const Hint = styled.ul`
  margin-top: 15px;
  font-size: .8em;

  > li {
    margin: 0;
  }
`

const InteracResult = styled.div`
  display: flex;
  flex-direction: column;
  font-size: .9em;
  padding: 10px 0;

  > div {
    display: flex;
    flex-direction: row;
    margin-bottom: 5px;

    > :first-child {
      flex-basis: 150px;
      font-weight: bold;
    }

    > :last-child {
      flex-grow: 1;
    }
  }
`

const StripeContainer = styled.div`
  label {
    color: #6b7c93;
    font-weight: 300;
    letter-spacing: 0.025em;
  }
  input,
  .StripeElement {
    display: block;
    margin: 10px 0 20px 0;
    max-width: 500px;
    padding: 10px 14px;
    font-size: 1em;
    font-family: 'Source Code Pro', monospace;
    box-shadow: rgba(50, 50, 93, 0.14902) 0px 1px 3px, rgba(0, 0, 0, 0.0196078) 0px 1px 0px;
    border: 0;
    outline: 0;
    border-radius: 4px;
    background: white;
  }
  input::placeholder {
    color: #aab7c4;
  }
  input:focus,
  .StripeElement--focus {
    box-shadow: rgba(50, 50, 93, 0.109804) 0px 4px 6px, rgba(0, 0, 0, 0.0784314) 0px 1px 3px;
    -webkit-transition: all 150ms ease;
    transition: all 150ms ease;
  }
  .StripeElement.IdealBankElement,
  .StripeElement.PaymentRequestButton {
    padding: 0;
  }
`

// eslint-disable-next-line react/prop-types
const renderPaymentMethod = ({ input }) => (
  <div>
    <PaymentMethod active={input.value === 'interac'} type="button" onClick={() => input.onChange('interac')}>
      <Image src="http://www.rbcroyalbank.com/products/deposits/_assets-custom/images/interac-email-transfer-logo.png" />
    </PaymentMethod>
    <PaymentMethod active={input.value === 'paypal'} type="button" onClick={() => input.onChange('paypal')}>
      <Image src="https://img.talkandroid.com/uploads/2017/04/paypal_logo_square.png" />
    </PaymentMethod>
    <PaymentMethod active={input.value === 'stripe'} type="button" onClick={() => input.onChange('stripe')}>
      <Image src="http://www.pngmart.com/files/3/Credit-Card-Visa-And-Master-Card-PNG-Photos.png" />
    </PaymentMethod>

    <Hint>
      <li>
        We are currently unable to process payments via PayPal due to some compliance issue.
      </li>
      <li>
        By choosing the Interac e-transfer method, you will be asked to transfer money via email, then the ticket will be sent to your email address within an hour.
      </li>
    </Hint>
  </div>
)

// eslint-disable-next-line react/prop-types
const renderTextInput = ({ input, label, meta }) => (
  <div>
    <label>{label}</label>
    <input {...input} type="text" placeholder={label} />
    {meta.error && meta.touched && <span>{meta.error}</span>}
  </div>
)


// // eslint-disable-next-line react/prop-types
// const RegistrationForm = ({ handleSubmit, reset, submitting, pristine, values }) => (
//   <form onSubmit={handleSubmit} style={{ margin: 0 }}>
//     <Field name="name" label="Your name" validate={required}>
//       {renderTextInput}
//     </Field>
//     <Field name="email" type="email" label="Email Address" validate={composeValidators(required, mustBeEmail)}>
//       {renderTextInput}
//     </Field>
//     <div style={{ marginBottom: 15 }}>
//       <p style={{ marginBottom: 15, fontSize: '.9em' }}>Choose a payment method:</p>

//       <Field name="paymentMethod" validate={required}>
//         {renderPaymentMethod}
//       </Field>
//     </div>
//     <ButtonWrapper>
//       <LaddaButton
//         loading={submitting}
//         type="submit"
//         data-color="blue"
//         data-size={L}
//         data-style={ZOOM_OUT}
//       >
//         Proceed to Checkout
//       </LaddaButton>
//     </ButtonWrapper>
//   </form>
// )

const StripeForm = ({ handleSubmit, stripe, submitting }) => {
  return (
    <form onSubmit={handleSubmit} style={{ margin: 0 }}>
      <StripeContainer>
        <Note>We never store your card information. All payments are processed via Stripe, a third-party payment solution.</Note>
        <Field name="name" label="Your name" validate={required}>
          {renderTextInput}
        </Field>
        <Field name="email" type="email" label="Email Address" validate={composeValidators(required, mustBeEmail)}>
          {renderTextInput}
        </Field>
        <label>
          Card Information
        <CardElement />
        </label>
        <Field name="paymentMethod" validate={required}>
          {renderPaymentMethod}
        </Field>
        <ButtonWrapper>
          <LaddaButton
            loading={submitting}
            type="submit"
            data-color="blue"
            data-size={L}
            data-style={ZOOM_OUT}
          >
            Pay
      </LaddaButton>
        </ButtonWrapper>
      </StripeContainer>
    </form>
  )
}

class PurchaseTicket extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    eventId: PropTypes.string.isRequired,
    ticketId: PropTypes.string.isRequired,
    auth: PropTypes.object,
    close: PropTypes.func,
  }

  state = {
    loading: false,
    processed: false,
    result: {},
  }

  handleSubmit = async (data) => {
    const { eventId, ticketId, auth } = this.props
    let token

    if (auth) {
      token = await auth.getToken()
    }

    this.setState({ buying: ticketId })

    if (data.paymentMethod === 'stripe') {
      const stripeToken = await this.props.stripe.createToken()
      data.token = stripeToken.token.id;
    }

    try {
      const buyTicketUrl = `${config.firebase.functionsBaseUrl}/buyTicket`
      const response = await fetch(buyTicketUrl, {
        method: 'POST',
        body: JSON.stringify({
          eventId,
          ticketId,
          ...data,
        }),
        headers: {
          ...(
            token
              ? {
                'authorization': `Bearer ${token}`,
              }
              : undefined
          ),
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()

      switch (data.paymentMethod) {
        case 'paypal':
          window.location.href = result.redirectTo
          break
        case 'interac':
        default:
          this.setState({ result, processed: true })
          break
      }
    } catch (error) {
      console.error(error)
      alert('There was an error while initiating the payment request')
    }
  }

  render() {
    const { auth, close } = this.props

    return (
      <div>
        <button onClick={close} style={{ border: 'none' }}><Icon name="times" /></button>
        <hr />
        <Form
          initialValues={{
            paymentMethod: 'stripe',
            email: auth && auth.email,
            name: auth && auth.displayName,
          }}
          onSubmit={this.handleSubmit}
          render={StripeForm}
        />
      </div>
    )

    // return (
    //   <Wrapper>
    //     <button onClick={close} style={{ border: 'none' }}><Icon name="times" /></button>
    //     <hr />
    //     {
    //       this.state.processed
    //         ? (
    //           <div>
    //             <p style={{ fontSize: '.9em' }}>
    //               Please transfer <strong>${this.state.result.price}</strong> to <strong>muniranians@gmail.com</strong> via Interac e-transfer and use the following information for the security question and the answer:
    //             </p>

    //             <InteracResult>
    //               <div>
    //                 <div>Security Question:</div>
    //                 <div>{this.state.result.question}</div>
    //               </div>
    //               <div>
    //                 <div>Answer:</div>
    //                 <div>{this.state.result.answer}</div>
    //               </div>
    //               <div>
    //                 <div>Recipient Email:</div>
    //                 <div>muniranians@gmail.com</div>
    //               </div>
    //               <div>
    //                 <div>Amount $:</div>
    //                 <div>{Number(this.state.result.price).toFixed(2)}</div>
    //               </div>
    //             </InteracResult>

    //             <p style={{ fontSize: '.9em' }}>
    //               We will send your ticket to your email address once we process your payment within an hour.
    //             </p>

    //             <hr />

    //             <p style={{ fontSize: '.8em' }}>
    //               If it{'\''}s your first time using e-transfer, here are the instructions for different banks:

    //               <Hint>
    //                 <li><a target="blank" href="http://www.scotiabank.com/ca/en/0,,10443,00.html">ScotiaBank</a></li>
    //                 <li><a target="blank" href="http://www.rbcroyalbank.com/campaign/interac-etransfer-2013/_assets-custom/includes/how-to-send-an-interac-etransfer-popup.html">RBC</a></li>
    //                 <li><a target="blank" href="https://www.cibc.com/en/personal-banking/ways-to-bank/how-to/send-interac-e-transfer.html">CIBC</a></li>
    //               </Hint>
    //             </p>
    //           </div>
    //         )
    //         : (
    //           <Form
    //             initialValues={{
    //               paymentMethod: 'paypal',
    //               email: auth && auth.email,
    //               name: auth && auth.displayName,
    //             }}
    //             onSubmit={this.handleSubmit}
    //             render={RegistrationForm}
    //           />
    //         )
    //     }
    //   </Wrapper>
    // )
  }
}

export default compose(
  branch(
    () => !__SERVER__,
    compose(
      firebaseConnect(),
      connect(
        ({ firebase }) => {
          return {
            auth: pathToJS(firebase, 'auth'),
          }
        }
      )
    )
  ),
  injectStripe,
)(PurchaseTicket)
