---
name: microservice-contract
description: Implement or review my-ecm microservice commands and events, including ArkType contracts, registries, TCP clients and consumers, validation, and RPC responses.
---

# Microservice contracts in my-ecm

Trace the initiating caller, client registration, transport, consumer, schemas, and response or error path before changing a cross-service contract. Apply `design-principles` and `arktype-schema`; preserve existing contracts unless the task requires a change.

- **Commands and events:** Use `MICROSERVICE_COMMANDS` for request-response commands and `MICROSERVICE_EVENTS` for events. Consumers use `@MessagePattern` for commands and `@EventPattern` for events. Choose the interaction according to the required behavior; an event does not provide a command response.
- **Registries:** Add each command and its `[payloadSchema, responseSchema]` pair to `ContractByCommand`, and each event and payload schema to `PayloadByEvent`. Keep them aligned with `MICROSERVICE_COMMANDS` / `MICROSERVICE_EVENTS`. `PayloadByCommand` and `ResponseByCommand` are types derived from `ContractByCommand`, not separate registries. `as const satisfies Record<...>` checks coverage but does not register a handler or prove runtime behavior.
- **Clients and handlers:** `AbstractMicroserviceClient.send` asserts the command payload and response and applies a timeout; `emit` asserts the event payload. Consumer payloads use their schema with `@Payload`, and the connected microservice registers its validation pipe. Check the handler, module, client provider, and TCP address registration when adding or changing a flow.
- **Dates across boundaries:** Reuse `DateValue` where the contract needs to accept an in-memory `Date` or an ISO string and parse the string to a `Date`. `CreatePayment`, composed from `Payment`, is used by both `ContractByCommand` and the consumer. The command client accepts the payload schema's `.inferIn`, asserts it before sending, and asserts the response on receipt; consumer validation applies its payload schema. Account separately for transport serialization, and verify the actual boundary before changing schemas or inferred types. Do not recreate separate `*FromRpc` or sender schemas merely to handle this existing date conversion.
- **Errors and scope:** Trace the errors actually produced, `RpcExceptionFilter`, and the shared client's `ServerError` validation and `HttpException` reconstruction. At the client, rethrow other errors without inventing new exception types. Check the authenticated actor and resource scope at each boundary; do not infer authorization or context propagation from a client type or a successful schema parse.
- **Delivery and legacy paths:** The configured client transport is TCP. Do not describe deprecated Kafka or outbox code as a required active path. An event emitted after commit does not by itself guarantee delivery or retries; assess failure and duplicate effects according to the requested reliability.

When reviewing, cite the actual registration and call path and distinguish static contract checks from runtime or end-to-end verification.
