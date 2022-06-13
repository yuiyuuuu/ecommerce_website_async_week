//Summarizes the cart with order total, items in cart, quantity of each item, cost of each item

import React from "react";
import { Typography, List, ListItem, ListItemText } from "@material-ui/core";

const Review = ({ checkoutToken }) => {
  //notes for below- checkout token is passed as a prop from checkout.jsx where the state is
  //checkoutToken.live.line_items is the list of items in the current cart, it is an array of objects so we map over it to display every item in our cart
  //every item in our cart is displayed with <ListItem> in the parent <List>. The text for each item is under <ListItemText> with the name and quantity.
  //in the typography below the listitemtext, we have the item total
  //below that, we have the order subtotal in the typography under the parent <ListItemText> and <ListItem>
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      <List disablePadding>
        {checkoutToken.live.line_items.map((product) => (
          <ListItem style={{ padding: "10px 0" }} key={product.name}>
            <ListItemText
              primary={product.name}
              secondary={`Quantity: ${product.quantity}`}
            />
            <Typography variant="body2">
              {product.line_total.formatted_with_symbol}
            </Typography>
          </ListItem>
        ))}
        <ListItem style={{ padding: "10px 0" }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" style={{ fontWeight: 700 }}>
            {checkoutToken.live.subtotal.formatted_with_symbol}
          </Typography>
        </ListItem>
      </List>
    </>
  );
};

export default Review;
