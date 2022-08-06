import { Command } from 'comtroller';
import { Discord } from 'src/libs/discord';
import { CommandResponse } from 'src/responses/common';

export const ping: Command =
{
  name: 'ping',
  run: ({ discord }: { discord: Discord, }) =>
  {
    const response = new CommandResponse(discord);
    response.ping(discord.getPing());
  },
};
