import { Command } from 'comtroller';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { BitCommandResponse } from 'src/responses/bits';
import { Core } from 'yeonna-core';

export const bitsave: Command =
{
  name: 'bitsave',
  aliases: ['bs'],
  run: async ({ discord, params }: { discord: Discord, params: string, }) =>
  {
    const response = new BitCommandResponse(discord);

    if(!params)
      return response.noContent();

    try
    {
      discord.startTyping();

      const userBit = await Core.Bits.saveUserBit({
        userIdentifier: discord.getAuthorId(),
        content: params,
        discordGuildId: 'true',
      });

      if(!userBit)
        return response.alreadySaved();

      response.saved();
    }
    catch(error)
    {
      Log.error(error);
      response.couldNotSave();
    }
  },
};
