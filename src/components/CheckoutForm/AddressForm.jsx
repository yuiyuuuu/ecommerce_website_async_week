import React, { useState, useEffect } from "react";
//Select is a basic html <select>, MenuItem is <options>
import {
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
} from "@material-ui/core";
import { FormProvider, useForm } from "react-hook-form";
import FormInput from "./FormInput";

//allows us to make api calls to commerce js to fetch countries, etc
import { commerce } from "../../lib/commerce";
import { Link } from "react-router-dom";

const AddressForm = ({ checkoutToken, next }) => {
  //list of countries
  const [shippingCountries, setShippingCountries] = useState([]);
  //chosen country. NOTE TO SELF: we are never using the full country name (like United States). We are only using the id (US is the id for united states) for this state.
  const [shippingCountry, setShippingCountry] = useState("");
  //list of subdivision for the selected country
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  //chosen subdivision
  const [shippingSubdivision, setShippingSubdivision] = useState("");
  //list of shipping options for the selected country and subdivision
  const [shippingOptions, setShippingOptions] = useState([]);
  //chosen shipping option
  const [shippingOption, setShippingOption] = useState("");

  const fetchShippingCountries = async (checkoutTokenId) => {
    //fetch shipping countries from commerce js api using the checkout token
    const { countries } = await commerce.services.localeListShippingCountries(
      checkoutTokenId
    );
    //set shippingcountries state with the fetched countries
    setShippingCountries(countries);

    //countries returns as an object in this format:
    /*{
        US:united States,
        AL: Albania, and so on
    } 
    an array would be way easier to traverse through, so we use Object.keys */
    //this will set the default to united states
    setShippingCountry(
      Object.keys(countries).find((country) => country === "US")
    );
  };

  const fetchSubdivisions = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListSubdivisions(
      countryCode
    );

    setShippingSubdivisions(subdivisions);
    //same thing as fetchShipping countries explanation
    setShippingSubdivision(Object.keys(subdivisions)[0]);
  };

  const fetchShippingOptions = async (
    checkoutTokenId,
    country,
    region = null
  ) => {
    //fetch shipping rates/options from commerce js api
    const options = await commerce.checkout.getShippingOptions(
      checkoutTokenId,
      { country, region }
    );

    //sets the shipping options state with the options
    setShippingOptions(options);
    //sets the default selected shipping option as the first one
    setShippingOption(options[0].id);
  };

  useEffect(() => {
    fetchShippingCountries(checkoutToken.id); //fetch shipping countries on load
  }, []);

  useEffect(() => {
    if (shippingCountry) fetchSubdivisions(shippingCountry);
  }, [shippingCountry]); //everytime the shipping country changes, we fetch that country's subdivision

  useEffect(() => {
    if (shippingSubdivision)
      fetchShippingOptions(
        checkoutToken.id,
        shippingCountry,
        shippingSubdivision
      );
  }, [shippingSubdivision]); //everytime the subdivision changes, we rerender the shipping options available

  const methods = useForm();

  //this allows us to turn Object.entries, which is an array of arrays, and turn it into one array of objects. Each object returns with the {country code, country name} format, which is very easy to loop through
  const countries = Object.entries(shippingCountries).map(([code, name]) => ({
    id: code,
    label: name,
  }));

  console.log("countries:" + shippingCountry);
  //same as countries above
  const subdivisions = Object.entries(shippingSubdivisions).map(
    ([code, name]) => ({
      id: code,
      label: name,
    })
  );

  //map over immediately because shipping Options is an array by default
  //every single shipping option is returned as an object in an array in the format {id, label}. Label includes the price and the method of ship(overnight, domestic, etc)
  const options = shippingOptions.map((option) => ({
    id: option.id,
    label: `${option.description} - (${option.price.formatted_with_symbol})`,
  }));
  console.log(shippingOptions);

  //NOTES FOR BELOW- reason we use react form input is because that way we dont have to manage state.
  //onsubmit calls next() which sets the shippingData state in checkout.jsx with the object passed
  //the reason we spread data (...data) for the onsubmit is because data only contains the information for the <FormInput> and not the select below for shippping countries and subdivisions
  //those are stored in the states we created above, so we spread it and add the selected shipping country, subdivision, and option to create one object
  //onsubmit has if state to check if shipping option and subdivision was loaded, if not, we prevent user from going next page. this handles data error if we are missing one of those fields
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping Address
      </Typography>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit((data) => {
            if (!shippingOption || !shippingSubdivision) {
              return;
            } else {
              next({
                ...data,
                shippingCountry,
                shippingSubdivision,
                shippingOption,
              });
            }
          })}
        >
          <Grid container spacing={3}>
            <FormInput required name="firstName" label="First Name" />
            <FormInput required name="lastName" label="Last Name" />
            <FormInput required name="address1" label="Address" />
            <FormInput required name="email" label=" Email" />
            <FormInput required name="city" label="City" />
            <FormInput required name="zip" label="Zip / Postal Code" />
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Country</InputLabel>
              <Select
                value={shippingCountry}
                fullWidth
                onChange={(e) => setShippingCountry(e.target.value)}
              >
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Subdivision</InputLabel>
              <Select
                value={shippingSubdivision}
                fullWidth
                onChange={(e) => setShippingSubdivision(e.target.value)}
              >
                {subdivisions.map((subdivision) => (
                  <MenuItem key={subdivision.id} value={subdivision.id}>
                    {subdivision.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Options</InputLabel>
              <Select
                value={shippingOption}
                fullWidth
                onChange={(e) => setShippingOption(e.target.value)}
              >
                {options.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          <br />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" component={Link} to="/cart">
              Back To Cart
            </Button>
            <Button variant="contained" type="submit" color="primary">
              {" "}
              Next
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default AddressForm;
