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
import { FORM_ERROR } from 'final-form'

import { CardElement, injectStripe } from 'react-stripe-elements'

import config from '../../config'

const required = value => (value ? undefined : 'This field is required')
// eslint-disable-next-line
const mustBeEmail = value => (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) ? 'Must be a valid email address' : undefined)
const mustBeMoneyAmount = value => !value ? undefined : (!/^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/.test(value.trim()) ? 'Must be a valid money amount like 10.00.' : undefined)
const composeValidators = (...validators) => value => validators.reduce((error, validator) => error || validator(value), undefined)

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

// const InteracResult = styled.div`
//   display: flex;
//   flex-direction: column;
//   font-size: .9em;
//   padding: 10px 0;

//   > div {
//     display: flex;
//     flex-direction: row;
//     margin-bottom: 5px;

//     > :first-child {
//       flex-basis: 150px;
//       font-weight: bold;
//     }

//     > :last-child {
//       flex-grow: 1;
//     }
//   }
// `

const StripeContainer = styled.div`
  label {
    color: #6b7c93;
    font-weight: 300;
    letter-spacing: 0.025em;
  }
  input[type=text],
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
  input[type=text]::placeholder {
    color: #aab7c4;
  }
  input[type=text]:focus,
  .StripeElement--focus {
    box-shadow: rgba(50, 50, 93, 0.109804) 0px 4px 6px, rgba(0, 0, 0, 0.0784314) 0px 1px 3px;
    -webkit-transition: all 150ms ease;
    transition: all 150ms ease;
  }
  input[type=checkbox] {
    margin-right: 15px;
  }
  .StripeElement.IdealBankElement,
  .StripeElement.PaymentRequestButton {
    padding: 0;
  }
  .error {
    color: tomato;
    font-size: .8em;
    margin-bottom: 10px;
  }
  .donate {
    margin-bottom: 10px;
  }
`

// eslint-disable-next-line react/prop-types, no-unused-vars
const renderPaymentMethod = ({ input }) => (
  <div>
    <PaymentMethod disabled active={input.value === 'interac'} type="button" onClick={() => input.onChange('interac')}>
      <Image src="http://www.rbcroyalbank.com/products/deposits/_assets-custom/images/interac-email-transfer-logo.png" />
    </PaymentMethod>
    <PaymentMethod disabled active={input.value === 'paypal'} type="button" onClick={() => input.onChange('paypal')}>
      <Image src="https://img.talkandroid.com/uploads/2017/04/paypal_logo_square.png" />
    </PaymentMethod>
    <PaymentMethod active={input.value === 'stripe'} type="button" onClick={() => input.onChange('stripe')}>
      <Image src="http://www.pngmart.com/files/3/Credit-Card-Visa-And-Master-Card-PNG-Photos.png" />
    </PaymentMethod>

    <Hint>
      <li>Your credit/debit card information is processed by Stripe. MUNIranians will have no access to these information.</li>
      {/* <li>
        We are currently unable to process payments via PayPal due to some compliance issue.
      </li>
      <li>
        By choosing the Interac e-transfer method, you will be asked to transfer money via email, then the ticket will be sent to your email address within an hour.
      </li> */}
    </Hint>
  </div>
)

// eslint-disable-next-line react/prop-types
const renderTextInput = ({ input, label, placeholder, meta }) => (
  <div className={meta.error && meta.touched ? 'hasError' : null}>
    <label>
      {label}
      {meta.error && meta.touched && <span className="error"> - {meta.error}</span>}
    </label>
    <input {...input} type="text" placeholder={placeholder || label} />
  </div>
)

// eslint-disable-next-line react/prop-types
const renderCheckInput = ({ input, label }) => (
  <div>
    <label>
      <input {...input} type="checkbox" />
      {label}
    </label>
  </div>
)

class PurchaseTicket extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    eventId: PropTypes.string.isRequired,
    ticketId: PropTypes.string.isRequired,
    auth: PropTypes.object,
    close: PropTypes.func,
    stripe: PropTypes.shape({
      createToken: PropTypes.func.isRequired,
    }).isRequired,
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
      const stripeResponse = await this.props.stripe.createToken()
      if (stripeResponse.error) {
        return { [FORM_ERROR]: stripeResponse.error.message }
      }

      data.token = stripeResponse.token.id
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
        case 'stripe':
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
    const { event, ticketId, auth, close } = this.props

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
          render={({ handleSubmit, stripe, submitting, submitError, values }) => (
            <form onSubmit={handleSubmit} style={{ margin: 0 }}>
              <StripeContainer>
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
                {submitError && <div className="error">{submitError}</div>}
                {/* <Field name="paymentMethod" validate={required}>
                  {renderPaymentMethod}
                </Field> */}
                <div className="donate">
                  <Field name="willDonate" type="check" label={<span>I would like to make an <strong>additional donation</strong> to MUNIranians.</span>}>
                    {renderCheckInput}
                  </Field>
                  <div style={{ marginTop: 10 }} />
                  {
                    values.willDonate ? 
                    <Field name="donation" type="text" label="Thanks for your donation! How much would you like to donate?" placeholder="e.g. 10" validate={values.willDonate && mustBeMoneyAmount}>
                      {renderTextInput}
                    </Field> : null
                  }
                </div>
                <div>
                  Your total is: 
                  <strong>
                    ${event.tickets[ticketId].price + (values.donation ? Number(values.donation) : 0) + (auth ? -1 : 0)}
                  </strong>
                </div>
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
          )}
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
