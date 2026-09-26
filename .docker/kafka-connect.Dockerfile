FROM confluentinc/cp-kafka-connect:8.3.2

RUN confluent-hub install --no-prompt debezium/debezium-connector-postgresql:3.2.6-3