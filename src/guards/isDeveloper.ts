import { Guard } from 'comtroller';
import { Discord } from '../utilities/discord';

export const isDeveloperOnly: Guard = async ({ discord }: { discord: Discord, }) =>
{
  const developerIds = (process.env.DEVELOPER_IDS || '').split(',');
  return !developerIds.includes(discord.getAuthorId());
};
