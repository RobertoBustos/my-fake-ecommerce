import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
query GetProducts ($filter: Filter){
  products (filter: $filter){
    id
    title
    description
    image
    unitPrice
    currency
    stock
    purchaseLimits {
      min
      max
    }
  }
}`;

export const GET_ORDERS = gql`
query GetOrders($filter: Filter){
  orders (filter: $filter){
    id
    cart
    status
    customer {
      id
      email
      name
    }
    address {
      address
      zipCode
    }
    totals {
      currency
      subTotal
      taxes
      discount
      total
      units
      items
    }
    details {
      id
        productId
        quantity
        unitPrice
        subtotal
        product {
          image
          title
          id
        }
    }
    payment {
      id
      amount
      status
      customer
      payment_method
      paymentDetails {
        id
        card {
          brand
          display_brand
          exp_month
          exp_year
          fingerprint
          last4
          checks {
            cvc_check
          }
        }
      }
    }
  }
}`;

export const GET_INCOMPLETE_ORDERS = gql`
query GetIncompleteOrders ($filter: Filter) {
   incompleteOrders (filter: $filter) {
    id
    status
    totals {
      total
    }
  }
}`;

export const GET_CART = gql`
query GetCart($filter: Filter) {
  carts (filter: $filter){
    id
    productId
    quantity
    unitPrice
    subtotal
    product {
      image
      title
      id
    }
  }
}`

export default {}