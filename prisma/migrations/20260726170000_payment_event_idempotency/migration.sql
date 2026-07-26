-- Prevent duplicate processing when a payment provider retries the same IPN.
DROP INDEX IF EXISTS "PaymentEvent_provider_externalId_idx";
CREATE UNIQUE INDEX "PaymentEvent_provider_externalId_key"
ON "PaymentEvent"("provider", "externalId");