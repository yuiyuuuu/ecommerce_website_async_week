//payment form where you enter your card information and zipcode to be processed by stripe

import React from "react";
import { Typography, Button, Divider } from "@material-ui/core";
import {
  Elements,
  CardElement,
  ElementsConsumer,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import Review from "./Review";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY); //fetches the stripe public key from .env file

const PaymentForm = ({
  checkoutToken,
  backStep,
  onCaptureCheckout,
  nextStep,
  shippingData,
}) => {
  const handleSubmit = async (event, elements, stripe) => {
    event.preventDefault(); //no refresh after click

    if (!stripe || !elements) return; //error handling, stripe cannot function if one of these are missing

    //finds the <CardElement/> and stores it in a variable
    const cardElement = elements.getElement(CardElement);

    //creates a payment
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement, //card info from <CardElement/>
    });

    if (error) {
      console.log(error);
    } else {
      const orderData = {
        line_items: checkoutToken.live.line_items, //list of items in the cart from checkoutToken, which stores all the details about the cart
        customer: {
          firstname: shippingData.firstName, //first name from shippingData state
          lastname: shippingData.lastName, //last name from shippingData state
          email: shippingData.email, //email from shippingData state
        },
        shipping: {
          name: "Primary",
          street: shippingData.address1, //address from shippingData state
          town_city: shippingData.city, //city from shippingData state
          county_state: shippingData.shippingSubdivision, //subdivision from shippingData state
          postal_zip_code: shippingData.zip, //zipcode from shippingData state
          country: shippingData.shippingCountry, //country from shippingData state
        },
        fulfillment: { shipping_method: shippingData.shippingOption }, //shipping option from shippingData state
        payment: {
          gateway: "stripe",
          stripe: {
            payment_method_id: paymentMethod.id, //payment method from the payment method we created above with stripe
          },
        },
      };
      onCaptureCheckout(checkoutToken.id, orderData);
      nextStep(); //moves to next step after we capture checkout
    }
  };

  //NOTES FOR BELOW- <CardElement/> is the actual card form where you enter your credit card info and zip. It is provided by stripe
  //in the pay button, we have a check of (!stripe) because we do not want people bashing the button before stripe is loaded
  //everything from stripe is inside the <Elements> tag. That is because anything inside that tag has access to stripe components and the stripe object
  //you can only have one type of each element in each <Element> group, so you cant have two  <CardElement/> in one <Element> parent
  return (
    <>
      <Review checkoutToken={checkoutToken} />
      <Divider />
      <Typography variant="h6" gutterBottom style={{ margin: "20px 0" }}>
        Payment Method
      </Typography>
      <Elements stripe={stripePromise}>
        <ElementsConsumer>
          {({ elements, stripe }) => (
            <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
              <CardElement />
              <br />
              <br />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="outlined" onClick={backStep}>
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!stripe}
                  color="primary"
                >
                  Pay {checkoutToken.live.subtotal.formatted_with_symbol}
                </Button>
              </div>
            </form>
          )}
        </ElementsConsumer>
      </Elements>
    </>
  );
};

export default PaymentForm;
