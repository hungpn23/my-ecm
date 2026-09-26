function getOrThrow(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);

  return value;
}

const KAFKA_CONNECT_URL = `http://${getOrThrow("APP_HOST")}:${getOrThrow("KAFKA_CONNECT_PORT")}`;
const APP_NAME = getOrThrow("APP_NAME");
const SAFE_APP_NAME = APP_NAME.replaceAll("-", "_");

const CONFIG = {
  "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
  "database.hostname": "db",
  "database.port": "5432",
  "database.user": getOrThrow("DB_USER"),
  "database.password": getOrThrow("DB_PASSWORD"),
  "database.dbname": APP_NAME,
  "plugin.name": "pgoutput",
  "snapshot.mode": "initial",
  "publication.autocreate.mode": "filtered",
  "table.include.list": "public.outbox_event",
  transforms: "outbox",
  "transforms.outbox.type": "io.debezium.transforms.outbox.EventRouter",
  "transforms.outbox.table.field.event.id": "id",
  "transforms.outbox.table.field.event.key": "aggregate_id",
  "transforms.outbox.table.field.event.payload": "payload",
  "transforms.outbox.route.by.field": "event_type",
  "transforms.outbox.route.topic.replacement": "${routedByValue}",
  "transforms.outbox.table.expand.json.payload": "true",
  "topic.prefix": APP_NAME,
  "slot.name": SAFE_APP_NAME,
  "publication.name": SAFE_APP_NAME,
} as const satisfies Record<string, string>;

const heathCheckOrThrow = async (): Promise<void> => {
  let errorMessage = "No response";

  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      const response = await fetch(`${KAFKA_CONNECT_URL}/connector-plugins`);
      if (response.ok) return;

      errorMessage = `Kafka Connect returned HTTP ${response.status}`;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : String(error);
    }

    await Bun.sleep(1000);
  }

  throw new Error(`Kafka Connect is unavailable at ${KAFKA_CONNECT_URL}: ${errorMessage}`);
};

await heathCheckOrThrow();

const response = await fetch(`${KAFKA_CONNECT_URL}/connectors/${APP_NAME}/config`, {
  method: "PUT",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(CONFIG),
});

if (!response.ok) {
  throw new Error(
    `Failed to register ${APP_NAME}: HTTP ${response.status} ${await response.text()}`,
  );
}

console.log(`✅ Registered connector: ${APP_NAME}`);
