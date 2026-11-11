---
name: microservice-contract
description: Implement or review my-ecm microservice commands and events, including ArkType contracts, registries, TCP clients and consumers, validation, and RPC responses.
---

# Microservice contracts in my-ecm

Trace the initiating caller, client registration, transport, consumer, schemas, and response or error path before changing a cross-service contract. Apply `design-principles` and `arktype-schema`; preserve existing contracts unless the task requires a change.

- **Commands and events:** Use `MICROSERVICE_COMMANDS` for request-response commands and `MICROSERVICE_EVENTS` for events. Consumers use `@MessagePattern` for commands and `@EventPattern` for events. Choose the interaction according to the required behavior; an event does not provide a command response.
- **Registries:** Keep the command or event name, contract schema, and corresponding `PayloadByCommand` or `PayloadByEvent` entry aligned. Commands also require a `ResponseByCommand` entry. The registries use `as const satisfies Record<...>` to check coverage; type coverage alone does not register a handler or prove runtime behavior.
- **Clients and handlers:** `AbstractMicroserviceClient.send` asserts the command payload and response and applies a timeout; `emit` asserts the event payload. Consumer payloads use their schema with `@Payload`, and the connected microservice registers its validation pipe. Check the handler, module, client provider, and TCP address registration when adding or changing a flow.
- **Payload dates:** When a command needs separate sender and receiver schemas because a `Date` field such as `expiresAt` has different representations across the transport, name the sender schema registered in `PayloadByCommand` `<Name>Payload` and use `DateToISOString` with `.inferIn` for its input. Name the receiver schema `<Name>`, use `DateFromISOString`, and use its `.infer` type in the consumer and service. For example, `CreatePaymentPayload` is the sender schema and `CreatePayment` is the receiver schema. For events, likewise serialize and parse dates at the appropriate boundaries. Do not add the `Payload` suffix solely for consistency when no distinction is needed; preserve unrelated existing names.
- **Response dates:** Service and consumer return types describe in-memory data using the response schema's `.inferIn` when it has `DateToISOString`. Reserve `*FromRpc` for response schemas that parse transported values at the RPC client; the client returns their `.infer` type. For example, `EntityResponseFromRpc` parses ISO strings with `DateFromISOString`. Do not use `*FromRpc` for request payloads or apply the response parser to producer-side `Date` values.
- **Errors and scope:** Trace the errors actually produced, `RpcExceptionFilter`, and the shared client's `ServerError` validation and `HttpException` reconstruction. At the client, rethrow other errors without inventing new exception types. Check the authenticated actor and resource scope at each boundary; do not infer authorization or context propagation from a client type or a successful schema parse.
- **Delivery and legacy paths:** The configured client transport is TCP. Do not describe deprecated Kafka or outbox code as a required active path. An event emitted after commit does not by itself guarantee delivery or retries; assess failure and duplicate effects according to the requested reliability.

When reviewing, cite the actual registration and call path and distinguish static contract checks from runtime or end-to-end verification.
