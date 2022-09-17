import { Log } from 'src/libs/logger';
import { BitsCommandResponse } from 'src/responses/bits';
import { YeonnaCommand } from 'src/types';
import { Core } from 'yeonna-core';

export const bitsave: YeonnaCommand =
{
  name: 'bitsave',
  aliases: ['bs'],
  run: async ({ discord, params }) =>
  {
    const response = new BitsCommandResponse(discord);

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
