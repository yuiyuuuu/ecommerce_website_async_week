import React from "react";
import { Container, Typography, Button, Grid } from "@material-ui/core";
import useStyle from "./styles";
import CartItem from "./CartItem/CartItem";
import { Link } from "react-router-dom";

const Cart = ({
  cart,
  handleUpdateCartQty,
  removeFromCart,
  handleEmptyCart,
}) => {
  const classes = useStyle();
  console.log(cart.line_items);

  const EmptyCart = () => (
    <Typography variant="subtitle1">
      You have no items in your shopping cart,&nbsp;
      <Link to="/" className="classes.link">
        let's fix that
      </Link>
    </Typography>
  );

  //without this line, cart page will break. Cart will return as empty and we cannot map.
  //can use other stuff like null, the return is simply a placeholder
  if (!cart.line_items) return "loading";

  //   xs and sm handles device sizes. small (mobile) devices will have 4/12 spaces.
  const FilledCart = () => {
    return (
      <>
        <Grid container spacing={3}>
          {cart.line_items.map((item) => (
            <Grid item xs={12} sm={4} key={item.id}>
              <CartItem
                item={item}
                removeFromCart={removeFromCart}
                handleUpdateCartQty={handleUpdateCartQty}
              />
            </Grid>
          ))}
        </Grid>
        <div className={classes.cardDetails}>
          <Typography variant="h4">
            Subtotal: {cart.subtotal.formatted_with_symbol}
          </Typography>

          <div>
            <Button
              className={classes.emptyButtom}
              size="large"
              type="button"
              variant="contained"
              color="secondary"
              onClick={handleEmptyCart}
            >
              Empty Cart
            </Button>
            <Button
              className={classes.checkoutButton}
              size="large"
              type="button"
              variant="contained"
              color="primary"
              component={Link}
              to="/checkout"
            >
              Checkout
            </Button>
          </div>
        </div>
      </>
    );
  };

  //NOTES FOR BELOW- container is basically a div, but materialui provides padding and other ui stuff
  return (
    <Container>
      <div className={classes.toolbar} />
      <Typography gutterBottom className={classes.title} varaint="h3">
        Your Shoppping Cart
      </Typography>
      {!cart.line_items.length ? <EmptyCart /> : FilledCart()}
    </Container>
  );
};

export default Cart;
