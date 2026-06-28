import { apiFetch } from "./api";
import type { CheckoutSession } from "../types/capsule";

export async function createCheckout(capsuleId: string) {
  return apiFetch<{ checkoutSession: CheckoutSession }>("/checkout", {
    method: "POST",
    body: { capsuleId },
  });
}

export async function getCheckoutStatus(capsuleId: string) {
  return apiFetch<{ checkoutSession: CheckoutSession }>(`/checkout/${capsuleId}`);
}
