import { gql } from "@apollo/client";

export const ADD_PRODUCT = gql`
mutation addToCart($productId: ID!, $quantity: Int!) {
    addToCart(productId: $productId, quantity: $quantity ){
    id
    details {
      image
      title
      id
    }
    quantity
    unitPrice
    subtotal
  }
}`;

export const REMOVE_PRODUCT = gql`
mutation removeFromCart($id: ID!) {
  removeFromCart(id: $id)
}`;

export default {}