import { App, ExpressReceiver, LogLevel } from '@slack/bolt';
import { Application } from 'express';

export class SlackService {
  private boltApp: App;
  private readonly receiver: ExpressReceiver;

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
}
