import { registerAs } from '@nestjs/config';

export default registerAs('rabbitmq', () => {
  console.log('RABBITMQ_URL from ENV:', process.env.RABBITMQ_URL);
  return {
    url: process.env.RABBITMQ_URL,
    queues: {
      precoUpdates: 'preco-updates',
    },
    exchanges: {
      precoNotifications: 'preco-notifications',
    },
  };
});
