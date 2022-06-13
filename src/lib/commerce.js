import Commerce from "@chec/commerce.js";

//commerce js api key stored inside the enviroment variable, second boolean argument says we are creating a new store
export const commerce = new Commerce(
  process.env.REACT_APP_CHEC_PUBLIC_KEY,
  true
);
