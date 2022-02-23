import { Guard } from 'comtroller';

import { DiscordMessage } from '../utilities/discord';

export const isDeveloperOnly: Guard = async ({ message }: { message: DiscordMessage, }) =>
{
  const developerIds = (process.env.DEVELOPER_IDS || '').split(',');
  return !developerIds.includes(message.author.id);
};
