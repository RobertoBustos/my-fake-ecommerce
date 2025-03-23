import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
query {
  getAllProducts {
    id,
    title,
    description,
    image,
    unitPrice,
    currency
  }
}`;

export const GET_PRODUCT_BY_ID = gql`
query {
  getProductById ( productId: $productId ) {
    id
    title
    description
    image
    unitPrice
    currency
  }
}`;

export default {}