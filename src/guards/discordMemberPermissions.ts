import { Guard } from 'comtroller';
import { Permissions } from 'discord.js';
import { DiscordMessage } from '../utilities/discord';

function hasNoPermission(message: DiscordMessage, permissionFlag: bigint)
{
  const member = message.original.member;
  if(!member)
    return true;

  return !member.permissions.has(permissionFlag);
}

export const noEmotePermissions: Guard = ({ message }: { message: DiscordMessage, }) =>
  hasNoPermission(message, Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS);

export const noRolePermissions: Guard = ({ message }: { message: DiscordMessage, }) =>
  hasNoPermission(message, Permissions.FLAGS.MANAGE_ROLES);

export const noManageChannelPermissions: Guard = ({ message }: { message: DiscordMessage; }) =>
  hasNoPermission(message, Permissions.FLAGS.MANAGE_CHANNELS);
