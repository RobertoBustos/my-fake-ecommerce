import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
query getAllProducts {
  products {
    id,
    title,
    description,
    image,
    unitPrice,
    currency
  }
}`;

export const GET_PRODUCT_BY_ID = gql`
query getProductById($id: ID!){
  product(id: $id) {
    id
    title
    description
    image
    unitPrice
    currency
    stock
  }
}`;

export default {}