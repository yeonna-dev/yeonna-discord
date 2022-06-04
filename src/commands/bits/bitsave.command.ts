import { Command } from 'comtroller';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { Core } from 'yeonna-core';

export const bitsave: Command =
{
  name: 'bitsave',
  aliases: ['bs'],
  run: async ({ discord, params }: { discord: Discord, params: string, }) =>
  {
    if(!params)
      return discord.send('Please add content to the bit.');

    try
    {
      discord.startTyping();

      const userBit = await Core.Bits.saveUserBit({
        userIdentifier: discord.getAuthorId(),
        content: params,
        discordGuildId: 'true',
      });

      if(!userBit)
        return discord.send('You already saved that bit.');

      discord.send('Saved bit.');
    }
    catch(error)
    {
      Log.error(error);
      discord.send('Could not save bit.');
    }
  },
};
