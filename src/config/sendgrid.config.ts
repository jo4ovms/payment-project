import { registerAs } from '@nestjs/config';

export default registerAs('sendgrid', () => ({
  apiKey: process.env.SENDGRID_API_KEY,
  fromEmail: process.env.SENDGRID_FROM_EMAIL,
  templates: {
    precoUpdate: process.env.SENDGRID_PRECO_UPDATE_TEMPLATE_ID,
  },
}));
