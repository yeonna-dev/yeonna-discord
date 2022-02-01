import { Core } from 'yeonna-core';
import { DiscordMessage } from '../utilities/discord';

// TODO: Update responses
export async function getTop(message: DiscordMessage, collectibles?: boolean)
{
  if(message.channel.isDM())
    return message.channel.send('This command can only be used in a guild.');

  message.channel.startTyping();

  const count = 10;
  const guild = message.guild.id;
  const top = await (collectibles
    ? Core.Users.getTopCollectibles({ count, discordGuildId: guild })
    : Core.Users.getTopPoints({ count, discordGuildId: guild })
  );

  if(top.length === 0)
    return message.channel.send('No top users.');

  let board = '';
  for(const i in top)
  {
    const { discordId, amount } = top[i];
    if(!discordId)
      continue;

    let username;
    const member = await message.guild.getMember(discordId);
    if(!member)
    {
      const user = await message.client.getUser(discordId);
      if(!user)
        continue;

      username = user.username;
    }
    else username = member.displayName;

    board += `${parseInt(i) + 1}. ${amount} - ${username}\n`;
  }

  message.channel.send(board);
}
