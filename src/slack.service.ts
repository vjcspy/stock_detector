import { App, ExpressReceiver, LogLevel } from '@slack/bolt';
import { Application } from 'express';
import WebClient from '@slack/web-api/dist/WebClient';

export class SlackService {
  private boltApp: App;
  private readonly receiver: ExpressReceiver;
  private boltClient: WebClient;

  constructor() {
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

    this.listenInitDefaultChannel();
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
    return this.receiver.app;
  }

  private listenInitDefaultChannel() {
    this.boltApp.message('init channel', async ({ message, say }) => {
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
              text: `Hey there <@${user}>!, Are you sure to init channel?`,
            },
            accessory: {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Click Me',
              },
              action_id: 'button_init_channel_click',
            },
          },
        ],
        text: `Hey there <@${user}>!, Are you sure to init channel?`,
      });
    });

    this.boltApp.action(
      'button_init_channel_click',
      async ({ body, ack, say }) => {
        // Acknowledge the action
        await ack();
        await say(`<@${body.user.id}> clicked the button init channel`);
        const result = await this.boltClient.conversations.create({
          name: 'general-chiaki-bot-channel',
        });
        console.log('result create general channel', result);
        if (result?.channel?.id) {
          await this.boltClient.chat.postMessage({
            channel: result?.channel?.id,
            text: 'Hello world',
          });
        }
      },
    );
  }
}
