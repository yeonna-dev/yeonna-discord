import { Guard } from 'comtroller';
import { Permissions } from 'discord.js';
import { DiscordMessage } from '../utilities/discord';

export const hasNoEmotePermissions: Guard = ({ message }: { message: DiscordMessage, }) =>
{
  const member = message.original.member;
  if(!member)
    return true;

  return !member.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS);
};
