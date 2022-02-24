import { Guard } from 'comtroller';
import { Message, Permissions } from 'discord.js';

function hasNoPermission(message: Message, permissionFlag: bigint)
{
  const member = message.member;
  if(!member)
    return true;

  return !member.permissions.has(permissionFlag);
}

export const noEmotePermissions: Guard = ({ message }: { message: Message, }) =>
  hasNoPermission(message, Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS);

export const noRolePermissions: Guard = ({ message }: { message: Message, }) =>
  hasNoPermission(message, Permissions.FLAGS.MANAGE_ROLES);

export const noManageChannelPermissions: Guard = ({ message }: { message: Message; }) =>
  hasNoPermission(message, Permissions.FLAGS.MANAGE_CHANNELS);
