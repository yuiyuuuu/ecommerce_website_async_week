//Checkout form, renderes the payment form and address form. Has two visible steps, first you enter your address in the address form, which is stored in the shipping data state
//after the first step is completed you go to the second step (payment form), where you enter your payment information to be processed by stripe and captured by commerce.js

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  CircularProgress,
  Divider,
  Button,
} from "@material-ui/core";
//CircularProgress for a circle when loading, stepper moves as you moves through steps, like a form. Step and Step labels are used for Stepper.

import Review from "../Review";
import { commerce } from "../../../lib/commerce";
import useStyles from "./styles";
import AddressForm from "../AddressForm";
import PaymentForm from "../PaymentForm";

const steps = ["Shipping Address", "Payment Details"];

const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
  //active step tells us which step we are in. If we are at 0, then we are at 'shipping address' in the steps array above. If it is 1, then we are at 'payment details' and the previous step is marked with a checkmark
  const [activeStep, setActiveStep] = useState(0);
  //holds the checkout token, which contains info like items in our cart. generates a new one everytime we add/remove items
  const [checkoutToken, setCheckoutToken] = useState(null);
  //holds all shipping data we received by calling next() in addressform
  const [shippingData, setShippingData] = useState({});
  const classes = useStyles();

  useEffect(() => {
    //generates a token. commercejs generate token takes in two parameter, first is cart id, second is options.
    //token contains cart info and info about shipping options, tax, totals, and alot more.
    const generateToken = async () => {
      try {
        const token = await commerce.checkout.generateToken(cart.id, {
          type: "cart",
        });

        //sets checkoutToken state with the retrieved token
        setCheckoutToken(token);
      } catch (error) {
        console.log(error);
      }
    };
    //the reason we are making a function and calling it right after instead of making it the callback for use effect is because we cannot make the callback func parameter an async for useeffect
    generateToken();
  }, [cart]);

  //go to next step. WE must call it as a callback function to not mutate the previous state
  const nextStep = () =>
    setActiveStep((previousActiveStep) => previousActiveStep + 1);
  //same thing, but back one step
  const backStep = () =>
    setActiveStep((previousActiveStep) => previousActiveStep - 1);

  //use the data retrieved from the shipping form in address form and set the shippingData state with the data received
  const next = (data) => {
    setShippingData(data);
    nextStep();
  };

  let Confirmation = () =>
    order.customer ? (
      <>
        <div>
          <Typography variant="h5">
            {" "}
            Thank you for your purchase, {shippingData.firstName}{" "}
            {shippingData.lastName}
          </Typography>
        </div>
        <Divider className={classes.divider} />
        <Typography variant="h5">
          Your Order Number: {order.customer_reference}
        </Typography>
        <Divider className={classes.divider} />
        <Review checkoutToken={checkoutToken} />
        <Divider className={classes.divider} />
        <Typography variant="h5">
          Contact Information:
          <Typography variant="body1">{order.customer.email}</Typography>
        </Typography>
        <Divider className={classes.divider} />
        <Typography variant="h5">
          Shipping Information:
          <Typography variant="body1">
            <div>
              {order.customer.firstname} {order.customer.lastname} <br />
              {order.shipping.street} <br />
              {order.shipping.town_city} {order.shipping.county_state},{" "}
              {order.shipping.postal_zip_code} <br />
              {order.shipping.country}
            </div>
          </Typography>
        </Typography>
        <br />
        <Button component={Link} to="/" variant="outlined" type="button">
          Continue Shopping
        </Button>
      </>
    ) : (
      <>
        <div>
          <Typography variant="h5">
            Your order is being processed, please wait
          </Typography>
        </div>
        <br />
        <div className={classes.spinner}>
          <CircularProgress />
        </div>
      </>
    );

  if (error) {
    Confirmation = () => (
      <>
        <Typography variant="h5">
          {" "}
          Something went wrong, please refresh
        </Typography>
        <br />
        <Button component={Link} to="/" variant="outlined" type="button">
          Back to Home
        </Button>
      </>
    );
  }

  const Form = () =>
    activeStep === 0 ? (
      <AddressForm checkoutToken={checkoutToken} next={next} />
    ) : (
      <PaymentForm
        checkoutToken={checkoutToken}
        backStep={backStep}
        onCaptureCheckout={onCaptureCheckout}
        nextStep={nextStep}
        shippingData={shippingData}
      />
    );

  //NOTES FOR BELOW- stepper builds the actual stepper above the checkout form
  //below stepper, if active step is the last step (2 in this case) we will show confirmation, else we will render Form component
  //Form component will render addressform or payment form based on if active step is 0 or 1, 0 being address and 1 being payment
  //the reason we need checkoutToken in order to render <Form/> - without checking if checkoutToken is present, we will crash because out <AddressForm/> depends on it.
  //continued^ reason being react renders all jsx and rerenders if needed. without checking if checkouttoken is present, we load <AddressForm/> without it and we crash
  return (
    <>
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((step) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <Confirmation />
          ) : (
            checkoutToken && <Form />
          )}
        </Paper>
      </main>
    </>
  );
};

export default Checkout;
