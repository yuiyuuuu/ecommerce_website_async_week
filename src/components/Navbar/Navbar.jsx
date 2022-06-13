import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  MenuItem,
  Menu,
  Typography,
} from "@material-ui/core";
import { ShoppingCart } from "@material-ui/icons";
import shopfiy from "../../assets/shopify.png";
import useStyles from "./styles";

const Navbar = ({ cart }) => {
  const classes = useStyles();
  const location = useLocation();

  //NOTES FOR BELOW
  //Toolbar- does not work on its own. Works with app bar. Horizontally aligns all the items- https://www.geeksforgeeks.org/material-ui-toolbar/
  //class.grow is meant to fill the space in between cart icon  and store name
  //to use Link from react router dom, IconButton allows you to add a component (in this case its Link) and then we can add a to=path and it will work like a regular link. Same thing with typography
  //useLocation is to ensure when we are on /cart we will not see the cart button. the && only runs if the first part is true
  return (
    <>
      <AppBar position="fixed" className={classes.appBar} color="inherit">
        <Toolbar>
          <Typography
            vairant="h6"
            className={classes.title}
            component={Link}
            to="/"
          >
            <img
              src={shopfiy}
              alt="Commerce.JS"
              height="25px"
              className={classes.image}
            />
            Yingson's Amazing Shop
          </Typography>
          <div className={classes.grow} />
          <div className={classes.button}>
            {location.pathname === "/" && (
              <IconButton
                aria-label="Show cart items"
                color="inherit"
                component={Link}
                to="/cart"
              >
                <Badge badgeContent={cart.total_items} color="secondary">
                  <ShoppingCart />
                </Badge>
              </IconButton>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
