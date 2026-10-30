---
name: email-notification
description: Implement or review email notifications in my-ecm, including templates, event contracts, notification consumers, rendering, and SMTP or SES transport configuration.
---

# Email notifications in my-ecm

Inspect the initiating operation, event contract and transport, notification consumer, template, and mailer configuration before changing an email flow. Apply `design-principles`; use `arkenv-config` and `microservice-contract` for their respective boundaries when available.

- **Active welcome flow:** `AuthService.signUp` emits `user.created` through `NotificationClient` after its user transaction. The configured microservice transport is TCP; notification's `UserConsumer` receives the event with `@EventPattern` and calls `EmailService`. Trace actual registrations and consumers before extending the flow; do not treat deprecated Kafka or outbox code as the active path.
- **Contracts:** `PayloadByEvent` maps `user.created` to `UserCreatedPayload`, which validates the event's email. `SendWelcomeEmailData` defines the mail service's input. Reuse and update the appropriate schema, mappings, and consumers when changing data; do not assume all email inputs share one contract.
- **Templates:** Keep React Email templates in `libs/email` following existing exports. `Welcome` has a named export used by the service and a default export for preview. Provide template data explicitly when needed and keep the resulting content consistent with the contract.
- **Rendering and sending:** `EmailService` renders the template to HTML and calls `Mailer.send` with recipient, subject, HTML, and text. Keep the text alternative meaningful and check each representation when changing content; do not consolidate subject, HTML, and text solely because they share wording.
- **Transport:** Email config validates a discriminator for SMTP or SES and returns camelCase properties; `EmailModule` constructs the corresponding transport. Check both variants and their required configuration when changing the transport. Do not log credentials or sensitive payloads.
- **Delivery semantics:** An event emitted after commit prevents emission on transaction rollback but does not guarantee delivery or retry after commit. A transport accepting a message does not prove final delivery. Consider failure handling, retry, and duplicate effects only to the extent required by the task.

Verify contract and registration changes across the flow. Distinguish static checks, transport acceptance, and actual delivered email; do not claim an end-to-end flow was tested without evidence.
