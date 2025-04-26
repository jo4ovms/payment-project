import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private isConfigured: boolean = false;

  async onModuleInit() {
    await this.initializeSendGrid();
  }

  private async initializeSendGrid(): Promise<void> {
    try {
      const apiKey = process.env.SENDGRID_API_KEY;

      if (!apiKey) {
        this.logger.warn('Chave API do SendGrid não configurada. O serviço de email não funcionará.');
        return;
      }

      SendGrid.setApiKey(apiKey);

      this.isConfigured = true;
      this.logger.log('SendGrid configurado.');
    } catch (error) {
      this.logger.error(`Erro ao inicializar SendGrid: ${error.message}`, error.stack);
    }
  }

  async sendTemplateEmail(to: string, templateId: string, dynamicData: any): Promise<boolean> {
    try {
      const fromEmail = process.env.SENDGRID_FROM_EMAIL;
      if (!fromEmail) {
        throw new Error('Sender email not configured');
      }

      const isOutlookEmail =
        to.toLowerCase().includes('@outlook.com') ||
        to.toLowerCase().includes('@hotmail.com') ||
        to.toLowerCase().includes('@live.com');

      if (isOutlookEmail) {
        this.logger.warn(`Email Outlook/Hotmail detectado, há bloqueio por parte do outlook.`);
        return;
      }

      const msg = {
        to,
        from: fromEmail,
        templateId,
        dynamicTemplateData: dynamicData,
      };

      await SendGrid.send(msg);
      return true;
    } catch (error) {
      let errorMessage = error.message;
      if (error.response && error.response.body && error.response.body.errors) {
        errorMessage = JSON.stringify(error.response.body.errors);
      }

      if (
        errorMessage.includes('block list') ||
        errorMessage.includes('550 5.7.1') ||
        errorMessage.includes('mail.live.com')
      ) {
        this.logger.warn(`Email bloqueado pelo Outlook/Hotmail.`);
      }

      return ('' + errorMessage).includes('block list');
    }
  }
}
