import { BASE_URL } from "../constants/config";
import { CreatePaymentType, PaymentType, RequestType, StripeCustomerType, UserType } from "../constants/types";

export async function fetchPaymentSheetParams(request: RequestType<CreatePaymentType>): Promise<PaymentType | Error> {
    try {
        const response = await fetch(BASE_URL + "/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ amount: request.amount, currency: request.currency, customerId: request.customerId }),
        });
        const data = await response.json();
        if ("error" in data) {
            throw new Error(data.error.message)
        }
        return data
    } catch (error) {
        return error as Error
    }
}

export async function getCustomerService(request: RequestType<UserType>): Promise<StripeCustomerType | Error> {
    try {
        const response = await fetch(BASE_URL + "/getCustomer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        })
        const data = await response.json();
        return data.data as StripeCustomerType
    } catch (error) {
        return error as Error
    }
}

export async function createEphimeralKeyService(request: RequestType<string>): Promise<string | Error> {
    try {
        const response = await fetch(BASE_URL + "/createEphimeralKey", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ customerId: request })
        })
        const data = await response.json();
        return data.ephemeralKey as string
    } catch (error) {
        return error as Error
    }
}