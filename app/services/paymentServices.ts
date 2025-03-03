import { BASE_URL } from "../constants/config";
import { OrderType } from "../constants/types";

export async function fetchPaymentSheetParams(order: OrderType): Promise<any | Error> {
    try {
        const response = await fetch(BASE_URL + "/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ amount: order.payment?.amount, currency: order.payment?.currency, user: `${order.user?.firstName} ${order.user?.lastName}` }),
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
