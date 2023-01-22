import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { TimeLogsCommandResponse } from 'src/responses/timeLogs';
import { Core } from 'yeonna-core';
import { TimeLog } from 'yeonna-core/dist/modules/timeLogs/services/TimeLogService';

export async function getTimeLogsByDate(discord: Discord, date?: Date)
{
  const response = new TimeLogsCommandResponse(discord);

  discord.startTyping();

  const userIdentifier = discord.getAuthorId();
  const discordGuildId = discord.getGuildId();
  let timeLogs: TimeLog[];
  try
  {
    const timeLogsData = await Core.TimeLogs.getByDate({
      userIdentifier,
      discordGuildId,
      date
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

  if(!timeLogs || timeLogs.length === 0)
    return response.noTimeLogs();

  response.showTimeLogs(timeLogs);
}
