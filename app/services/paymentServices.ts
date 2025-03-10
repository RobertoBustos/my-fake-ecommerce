import { BASE_URL } from "../constants/config";
import { OrderType, PaymentMethodType, PaymentType, RequestType, ResponseType, UpdateOrderCustomerDataType, UpdateOrderItemsType } from "../constants/types";

export async function searchPaymentService(request: RequestType<{ paymentId: string, orderId: number }>): ResponseType<PaymentMethodType | undefined> {
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

export async function createPaymentService(request: RequestType<OrderType>): ResponseType<PaymentType | undefined> {
    try {
        const response = await fetch(BASE_URL + "/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ order: JSON.stringify(request) }),
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

export async function updatePaymentService(request: RequestType<UpdateOrderCustomerDataType>): ResponseType<PaymentType | undefined> {
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

export async function updatePaymentAmountService(request: RequestType<UpdateOrderItemsType>): ResponseType<PaymentType | undefined> {
    try {
        const response = await fetch(BASE_URL + "/update-payment-intent-amount", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ paymentId: request.paymentId, amount: request.summary.total }),
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

export async function preparePaymentSheetService(request: RequestType<{ paymentId: string, customerId: string }>): ResponseType<{ clientSecret: string, ephemeralKey: string } | undefined> {
    try {
        const response = await fetch(BASE_URL + "/prepare-payment-sheet", {
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