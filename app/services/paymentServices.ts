import { initPaymentSheet } from "@stripe/stripe-react-native";
import { BASE_URL } from "../constants/config";
import { PaymentMethodType, PaymentType } from "../constants/types";
import { searchOrderInAsyncStorage } from "./orderServices";
import { CancelPayment, CreatePayment, PreparePaymentSheet, RequestType, ResponseType, SearchPayment, UpdatePaymentAmount, UpdatePaymentCustomer } from "./serviceTypes";

export async function searchPaymentService(request: RequestType<SearchPayment>): ResponseType<PaymentMethodType | undefined> {
    try {
        const response = await fetch(BASE_URL + "/search-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request),
        });
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message)
        }
        return { data }
    } catch (error) {
        return { data: undefined, error: error as Error }
    }
}

export async function createPaymentService(request: RequestType<CreatePayment>): ResponseType<PaymentType | undefined> {
    try {
        const response = await fetch(BASE_URL + "/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request),
        });
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message)
        }
        return { data }
    } catch (error) {
        return { data: undefined, error: error as Error }
    }
}

export async function updatePaymentCustomerService(request: RequestType<UpdatePaymentCustomer>): ResponseType<PaymentType | undefined> {
    try {
        const response = await fetch(BASE_URL + "/update-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request),
        });
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message)
        }
        return { data }
    } catch (error) {
        return { data: undefined, error: error as Error }
    }
}

export async function updatePaymentAmountService(request: RequestType<UpdatePaymentAmount>): ResponseType<PaymentType | undefined> {
    try {
        const response = await fetch(BASE_URL + "/update-payment-intent-amount", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request),
        });
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message)
        }
        return { data }
    } catch (error) {
        return { data: undefined, error: error as Error }
    }
}

export async function preparePaymentSheetService(request: RequestType<PreparePaymentSheet>): ResponseType<boolean> {
    try {
        const orderData = await searchOrderInAsyncStorage(request.orderId)
        if (!orderData) {
            throw new Error("Order Not Found")
        }
        if (orderData.customerData === null || orderData.customerData.customerId === "") {
            throw new Error("Customer Not Found")
        }
        if (orderData.paymentIntent === null || orderData.paymentIntent.paymentId === null) {
            throw new Error("Payment Not Found")
        }
        const response = await fetch(BASE_URL + "/prepare-payment-sheet", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ paymentId: orderData.paymentIntent.paymentId, customerId: orderData.customerData.customerId }),
        });
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message)
        }
        const { clientSecret, ephemeralKey } = data
        const paymentSheetResponse = await initPaymentSheet({
            customerId: orderData.customerData.customerId,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: clientSecret,
            merchantDisplayName: "My Fake Ecommerce",
            allowsDelayedPaymentMethods: true,
            returnURL: "stripe-example://stripe-redirect",
            defaultBillingDetails: {
                name: orderData.customerData.userName,
                email: orderData.customerData.email,
            },
        });
        if (paymentSheetResponse.error) {
            throw new Error(paymentSheetResponse.error.message)
        }
        return { data: true }
    } catch (error) {
        return { data: false, error: error as Error }
    }
}

export async function cancelPaymentService(request: RequestType<CancelPayment>): ResponseType<boolean> {
    try {
        const response = await fetch(BASE_URL + "/cancel-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request),
        });
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message)
        }
        return { data: true }
    } catch (error) {
        return { data: false, error: error as Error }
    }
}

export default {}