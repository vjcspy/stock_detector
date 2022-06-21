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
      await say(`Hey there!`);
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
