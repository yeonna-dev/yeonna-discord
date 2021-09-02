import { GuildMember, Message } from 'discord.js';

import { findDiscordUser } from './findDiscordUser';

import { getTopCollectibles, getTopPoints } from 'yeonna-core';

// TODO: Update responses
export async function getTop(message: Message, collectibles?: boolean)
{
  if(! message.guild)
    return message.channel.send('This command can only be used in a guild.');

  message.channel.startTyping();

  const count = 10;
  const guild = message.guild.id;
  const top = await (collectibles
    ? getTopCollectibles({ count, discordGuildID: guild })
    : getTopPoints({ count, discordGuildID: guild })
  );

  let board = '';
  for(const i in top)
  {
    const { discordID, points } = top[i];
    if(! discordID)
      continue;

    const discordUser = await findDiscordUser(message, discordID);
    if(! discordUser)
      continue;

    const name = discordUser instanceof GuildMember
      ? discordUser.displayName
      : discordUser.username;

    board += `${parseInt(i) + 1}. ${points} - ${name}\n`;
  }

  message.channel.send(board);
  message.channel.stopTyping(true);
}
