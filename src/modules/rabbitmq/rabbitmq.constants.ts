export const RABBITMQ_EXCHANGE =
  process.env.RABBITMQ_EXCHANGE || 'batch-exchange';
export const RABBITMQ_ROUTING_KEY =
  process.env.RABBITMQ_ROUTING_KEY || 'batch.process';
export const RABBITMQ_QUEUE =
  process.env.RABBITMQ_QUEUE || 'batch-processing-queue';
export const RABBITMQ_MANAGEMENT_URL =
  process.env.RABBITMQ_MANAGEMENT_URL || 'http://rabbitmq:15672';
