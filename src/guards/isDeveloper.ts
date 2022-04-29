import { Guard } from 'comtroller';
import { Discord } from '../libs/discord';

export const isDeveloperOnly: Guard = async ({ discord }: { discord: Discord, }) =>
{
  const developerIds = (process.env.DEVELOPER_IDS || '').split(',');
  return !developerIds.includes(discord.getAuthorId());
};
