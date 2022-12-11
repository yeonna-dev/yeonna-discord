import { Command } from 'comtroller';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { TimeLogsCommandResponse } from 'src/responses/timeLogs';
import { Core } from 'yeonna-core';
import { TimeLog } from 'yeonna-core/dist/modules/timeLogs/services/TimeLogService';

export const timelogs: Command =
{
  name: 'timelogs',
  aliases: ['tl'],
  run: async ({ discord }: { discord: Discord; }) =>
  {
    const response = new TimeLogsCommandResponse(discord);

    const userIdentifier = discord.getAuthorId();
    const discordGuildId = discord.getGuildId();
    let timeLogs: TimeLog[];
    try
    {
      const timeLogsData = await Core.TimeLogs.get({
        userIdentifier,
        discordGuildId,
      });

      if(!timeLogsData)
        return;

      timeLogs = timeLogsData;
    }
    catch(error)
    {
      Log.error(error);
      return response.cannotGetTimelogs();
    }

    if(!timeLogs)
      return;

    response.showTimeLogs(timeLogs);
  },
};
