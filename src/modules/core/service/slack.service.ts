import { App, ExpressReceiver, LogLevel } from '@slack/bolt';
import { Application } from 'express';
import WebClient from '@slack/web-api/dist/WebClient';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import _ from 'lodash';
import { isDevelopment } from '@module/core/util/env';

@Injectable()
export class SlackService {
  private readonly logger = new Logger('SlackService');
  private readonly boltApp?: App;
  private readonly receiver?: ExpressReceiver;
  private boltClient?: WebClient;

  protected channels: any[] = [];

  constructor(private readonly configService: ConfigService) {
    if (isDevelopment()) {
      this.logger.log('Skip initialize slack in development');
      return;
    }

    if (!this.isConfiguredSlack()) {
      this.logger.log('Skip initialize slack due to missing configurations');
      return;
    }

    this.receiver = new ExpressReceiver({
      signingSecret: process.env.SLACK_SIGNING_SECRET,
      endpoints: '/',
    });

    this.boltApp = new App({
      token: process.env.SLACK_BOT_TOKEN,
      receiver: this.receiver,
      logLevel: LogLevel.DEBUG,
    });

    this.boltClient = this.boltApp.client;

    this.boltApp.event('app_mention', this.onAppMention.bind(this));
    this.boltApp.message('hello', async ({ message, say }) => {
      // say() sends a message to the channel where the event was triggered
      let user = 'X';
      if ('user' in message) {
        user = message.user;
      }

      await say({
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `Hey there <@${user}>!`,
            },
            accessory: {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Click Me',
              },
              action_id: 'button_click',
            },
          },
        ],
        text: `Hey there <@${user}>!`,
      });
    });

    this.boltApp.action('button_click', async ({ body, ack, say }) => {
      // Acknowledge the action
      await ack();
      await say(`<@${body.user.id}> clicked the button`);
    });
  }

  private isConfiguredSlack() {
    return !!process.env.SLACK_SIGNING_SECRET && !!process.env.SLACK_BOT_TOKEN;
  }

  public isReady() {
    return this.receiver && this.boltApp;
  }

  public async onAppMention({ event, client, logger }) {
    try {
      console.log(this);
      console.log(event);
    } catch (error) {
      logger.error(error);
    }
  }
  public use(): Application {
    return this.receiver?.app;
  }

  async getAllChannel(): Promise<any[]> {
    try {
      const result = await this.boltClient?.conversations.list();

      return Array.isArray(result.channels) ? result.channels : [];
    } catch (e) {
      this.logger.error('get slack channel error');
      return [];
    }
  }

  async registerChannels() {
    if (!this.isReady()) {
      return;
    }
    const channels = await this.getAllChannel();
    const expectedChannels = this.configService.get('slack.channels') ?? [];
    const channelsNeedCreate = _.filter(expectedChannels, (_ec: string) => {
      const channel = channels.find((_cc) => _cc?.name === _ec);

      if (channel) {
        this.channels.push(channel);
      }

      return !channel;
    });
    try {
      for (let i = 0; i < channelsNeedCreate.length; i++) {
        const result = await this.boltClient.conversations.create({
          name: channelsNeedCreate[i],
        });

        if (result?.channel?.id) {
          this.channels.push(result.channel);
        }
      }
    } catch (e) {
      this.logger.error('create channel error', e);
    }

    this.logger.log('Register slack channels successfully');
    this.postMessage('general-chiaki-bot-channel', {
      text: `Chiaki server[${process.env.INSTANCE_ID}:${process.env.PORT}] boot successfully`,
    });
  }

  async postMessage(channelName: string, messageOptions: any) {
    if (!this.isReady()) {
      return;
    }

    const registeredChannel = _.find(
      this.channels,
      (_rc) => _rc?.name === channelName,
    );
    if (registeredChannel && registeredChannel?.id) {
      try {
        await this.boltClient.chat.postMessage({
          channel: registeredChannel?.id,
          ...messageOptions,
        });
      } catch (e) {
        this.logger.error(`Error Post message to channel ${channelName}`, e);
      }
    } else {
      this.logger.error('Could not post message to unregistered channel');
    }
  }
}
