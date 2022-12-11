import { Command } from 'comtroller';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { TimeLogsCommandResponse } from 'src/responses/timeLogs';
import { Core } from 'yeonna-core';
import { TimeLog } from 'yeonna-core/dist/modules/timeLogs/services/TimeLogService';

dayjs.extend(customParseFormat);

export const timelogadd: Command =
{
  name: 'timelogadd',
  aliases: ['tla'],
  run: async ({ discord, params }: { discord: Discord, params: string; }) =>
  {
    const response = new TimeLogsCommandResponse(discord);

    if(!params)
      return response.noTimeAndActivity();

    /* Get the time and activity parts of the string params.
      The time part is the substring before the first `-`
      and the activity part is the substring after it. */
    const firstDashIndex = params.indexOf('-');
    let timeString = params.substring(0, firstDashIndex).trim().toLowerCase();
    const activityString = params.substring(firstDashIndex + 1).trim();
    if(!activityString)
      return response.noTimeAndActivity();

    let time;
    if(!timeString)
    {
      time = new Date().toISOString();
    }
    else
    {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s*(am|pm|AM|PM)?$/g;
      if(!timeRegex.test(timeString))
        return response.invalidTime();

      /* Parse the time. Attempt to parse the following formats:
        - h:mma (1:45am, 10:30pm)
        - h:mm a (1:45 am, 10:30 pm)
        - H:mm (1:45, 22:30)
        - HH:mm (01:45, 22:30)
      */
      const formats = ['h:mma', 'h:mm a', 'H:mm', 'HH:mm'];
      for(const format of formats)
      {
        const parsedTime = dayjs(timeString, format);
        if(parsedTime.isValid())
        {
          time = parsedTime.toISOString();
          break;
        }
      }
    }

    if(!time)
      return response.invalidTime();

    discord.startTyping();

    /* Save the time log in the database */
    const userIdentifier = discord.getAuthorId();
    const discordGuildId = discord.getGuildId();
    let timeLog: TimeLog;
    try
    {
      const createdTimeLogs = await Core.TimeLogs.create({
        userIdentifier,
        discordGuildId,
        timeLogs: [
          {
            datetime: time,
            activity: activityString
          }
        ]
      });

      if(!createdTimeLogs)
        return;

      timeLog = createdTimeLogs[0];
    }
    catch(error)
    {
      Log.error(error);
      return response.cannotAddTimeLog();
    }

    if(!timeLog)
      return;

    const { datetime, activity } = timeLog;
    response.timeLogAdded(datetime, activity);
  },
};
