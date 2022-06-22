export const SLACK_CHANNEL = {
  GENERAL_CHIAKI_BOT_CHANNEL: 'general-chiaki-bot-channel',
  JOB_MONITORING_OM: 'job-monitoring-om',
};
export default () => ({
  slack: {
    channels: [
      SLACK_CHANNEL.GENERAL_CHIAKI_BOT_CHANNEL,
      SLACK_CHANNEL.JOB_MONITORING_OM,
    ],
  },
});
