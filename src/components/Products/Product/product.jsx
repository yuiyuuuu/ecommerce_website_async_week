import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
} from "@material-ui/core";
import useStyles from "./styles";

import { AddShoppingCart } from "@material-ui/icons";

const Product = ({ product, onATC }) => {
  //useStyles is like a hook, everything we write using makeStyles can be used now with classes.nameofclass.
  //for example, we have a classes.root below. in styles.jsx file, we wrote make styles with the root class with max width of 100%
  //if you would do a css equilivient, it might be comething like
  /* .root{
  
  }*/

  const classes = useStyles();

  //PROJECT PURPOSE ONLY- console log the product to see the product object
  //to be able to put it together below
  // console.log(product);

  //NOTES FOR EVERYTHING BELOW
  //Cardmedia creates a card like component that is mapped in Products.jsx
  //cardcontent is everything inside the card, such as name, price,description
  //card actions will be actions such as atc
  //Typography is used for any text element in materialUI
  //"dangerouslySetInnerHTML" for the description solves the issue where html code is being rendered to the page. typography becomes self closing after this.
  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        image={product.image.url}
        title={product.name}
      />
      <CardContent>
        <div className={classes.carContent}>
          <Typography variant="h5" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="h5" gutterBottom>
            {product.price.formatted_with_symbol}
          </Typography>
          <Typography
            dangerouslySetInnerHTML={{ __html: product.description }}
            variant="body2"
            color="textSecondary"
          />
        </div>
      </CardContent>
      <CardActions disableSpacing className={classes.cardActions}>
        <IconButton
          aria-label="Add to Cart"
          onClick={() => onATC(product.id, 1)}
        >
          <AddShoppingCart />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default Product;
