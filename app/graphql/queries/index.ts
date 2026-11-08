import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
query GetProducts ($id: ID, $first: Int, $after: String){
  products (id: $id, first: $first, after: $after){
    edges {
      node {
        id
        title
        description
        category
        image
        unitPrice
        currency
        stock
        purchaseLimits {
          min
          max
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}`;

// Order.payment and paymentDetails call Stripe on every request: only ask for them on a single order
export const GET_ORDERS = gql`
query GetOrders($id: ID){
  orders (id: $id){
    edges {
      node {
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
          currency
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
  }
}`;

export const GET_INCOMPLETE_ORDERS = gql`
query GetIncompleteOrders ($cart: String) {
  incompleteOrders (cart: $cart) {
    edges {
      node {
        id
        status
        totals {
          currency
          total
        }
        details {
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
    }
  }
}`;

export const GET_CART = gql`
query GetCart($cartId: String, $first: Int) {
  carts (cartId: $cartId, first: $first){
    edges {
      node {
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
  }
}`

export default {}