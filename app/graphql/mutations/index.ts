import { gql } from "@apollo/client";

export const ADD_PRODUCT = gql`
mutation AddToCart($input: AddToCart!) {
  addToCart(input: $input) {
      code
      success
      message
      data {
        id
        productId
        quantity
        unitPrice
        subtotal
        currency
        product {
          image
          title
          id
        }
      }
    }
}`;

export const REMOVE_PRODUCT = gql`
mutation RemoveFromCart($input: RemoveFromCart!){
  removeFromCart(input: $input) {
    code
    success
    message
  }
}`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrder!) {
  createOrder(input: $input) {
    code
    success
    message
    data {
      id
    }
  }
}`;

export const UPDATE_ORDER = gql`
mutation UpdateOrder($input: UpdateOrder!){
  updateOrder (input: $input){
    code
    success
    message
    data {
      id
      cart
      status
      customer {
        id
        email
        name
        phone
      }
      address {
        address
        zipCode
        coords {
          latitude
          longitude
          latitudeDelta
          longitudeDelta
        }
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
  }
}`

export const CREATE_ORDER_PAYMENT = gql`
mutation CreateOrderPayment($input: CreateOrderPayment!){
  createOrderPayment (input: $input){
    code
    success
    message
    data {
      paymentId
      clientSecret
      ephimeralKey
    }
  }
}`

export const CANCEL_ORDER = gql`
mutation CancelOrder($input: CancelOrder!){
  cancelOrder (input: $input){
    code
    success
    message
  }
}`

export default {}