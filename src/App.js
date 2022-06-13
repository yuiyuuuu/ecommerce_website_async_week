//Routes and holds state which contain information about products, cart information, and order information and their functions that are passed down.

import React, { useState, useEffect } from "react";
//allows us to make api calls to commerce js to fetch products, remove product from cart, etc
import { commerce } from "./lib/commerce";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Products, Navbar, Cart, Checkout } from "./components";

//NOTES- commerce.js takes care of all backend stuff, such as atc, removing item from cart, updating cart, etc, so I did very little with backend on this project.
//commerce js allows you to remove item, atc, etc in almost plain english
//my intentions with this project was to learn about payment processors such as stripe and also frontend stuff with materialUI. I used a video on youtube as a guide and materialUI documentations as resources
//materialUI is great and all but some stuff are deprecated today, but still a great beginner resource to build frontend stuff

const App = () => {
  //products state
  const [products, setProducts] = useState([]);
  //cart state, used for the cart holding products
  const [cart, setCart] = useState({});
  //state with the order details
  const [order, setOrder] = useState({});
  //error handling state, stores the error message if an error occured during handleCheckoutCapture function
  const [errorMessage, setErrorMessage] = useState("");

  const fetchProducts = async () => {
    //fetch products, returns a promise so we use await
    const { data } = await commerce.products.list();

    //us the returned data to set the products state
    setProducts(data);
  };

  //commerce js cart retrieve
  const fetchCart = async () => {
    setCart(await commerce.cart.retrieve());
  };

  //atc handler
  const handleAddToCart = async (productId, quantity) => {
    //add an item from id to cart, qty will always be 1 for now
    const { cart } = await commerce.cart.add(productId, quantity);

    //set cart after the item is added as the variable
    setCart(cart);
  };

  //adds or subtracts one from cart, used in the - and + on cart page
  const handleUpdateCartQty = async (productId, quantity) => {
    const { cart } = await commerce.cart.update(productId, { quantity });
    setCart(cart);
  };

  //removes an item from the cart on the carts page
  const removeFromCart = async (productId) => {
    //removes an item from id from cart
    const { cart } = await commerce.cart.remove(productId);
    setCart(cart);
  };

  //empties a cart, used on the empty button on the cart page
  const handleEmptyCart = async () => {
    const { cart } = await commerce.cart.empty();
    setCart(cart);
  };

  //refresh a cart. It is used after you submit an order and it will refresh the cart, Called in handleCaptureCheckout function
  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh();
    setCart(newCart);
  };

  //captures the checkout by using commerce.js capture function. Takes in the checkout token id and the order details
  const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
    try {
      const incomingOrder = await commerce.checkout.capture(
        checkoutTokenId,
        newOrder
      );

      //set the order state with the order we just captured.
      setOrder(incomingOrder);
      //once the order is done, we refresh the cart
      refreshCart();
    } catch (error) {
      //error handling, sets the error state with the error message if an error occured.
      setErrorMessage(error.data.error.message);
    }
  };

  //component did mount functional hook equal
  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  return (
    <Router>
      <div>
        <Navbar cart={cart} />
        <Switch>
          <Route exact path="/">
            <Products products={products} onATC={handleAddToCart} />
          </Route>

          <Route exact path="/cart">
            <Cart
              cart={cart}
              handleUpdateCartQty={handleUpdateCartQty}
              removeFromCart={removeFromCart}
              handleEmptyCart={handleEmptyCart}
            />
          </Route>

          <Route exact path="/checkout">
            <Checkout
              cart={cart}
              order={order}
              onCaptureCheckout={handleCaptureCheckout}
              error={errorMessage}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
