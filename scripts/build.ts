import { build } from "bun";

const optionalPackages = [
  "class-transformer",
  "class-validator",
  "@nestjs/microservices",
  "@nestjs/websockets",
  "@fastify/static",
  "mqtt",
  "ioredis",
  "kafkajs",
  "amqplib",
  "amqp-connection-manager",
  "nats",
  "@grpc/grpc-js",
  "@grpc/proto-loader",
];

const external = optionalPackages.filter((pkg) => {
  try {
    require.resolve(pkg);
    return false;
  } catch {
    return true;
  }
});

const result = await build({
  entrypoints: ["src/main.ts"],
  outdir: "./dist",
  target: "bun",
  minify: { syntax: true, whitespace: true },
  external,
  splitting: true,
});

if (!result.success) {
  console.error(result.logs);
  process.exit(1);
}

console.log("Built successfully!");
