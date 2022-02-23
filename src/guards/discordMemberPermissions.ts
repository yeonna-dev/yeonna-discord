import { Guard } from 'comtroller';
import { Permissions } from 'discord.js';
import { DiscordMessage } from '../utilities/discord';

function getMember(message: DiscordMessage)
{
  return message.original.member;
}

export const noEmotePermissions: Guard = ({ message }: { message: DiscordMessage, }) =>
{
  const member = getMember(message);
  if(!member)
    return true;

  return !member.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS);
};

export const noRolePermissions: Guard = ({ message }: { message: DiscordMessage, }) =>
{
  const member = getMember(message);
  if(!member)
    return true;

  return !member.permissions.has(Permissions.FLAGS.MANAGE_ROLES);
};

export const noManageChannelPermissions: Guard = ({ message }: { message: DiscordMessage; }) =>
{
  const member = getMember(message);
  if(!member)
    return true;

  return !member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS);
};
