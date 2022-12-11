import { Discord } from 'src/libs/discord';
import { CommandResponse } from 'src/responses/common';
import { TimeLog } from 'yeonna-core/dist/modules/timeLogs/services/TimeLogService';

export class TimeLogsCommandResponse extends CommandResponse
{
  constructor(discord: Discord)
  {
    super(discord);
  }

  noTimeAndActivity = () => this.discord.replyEmbed({
    title: 'Please add a time and activity.',
  });

  invalidTime = () => this.discord.replyEmbed({
    title: 'Please provide a valid time.',
  });

  timeLogAdded = (time: string, activity: string) => this.discord.replyEmbed({
    title: 'Time log added',
    fields: [
      {
        name: 'Time',
        value: `<t:${Math.floor(new Date(time).getTime() / 1000)}:F>`,
      },
      {
        name: 'Activity',
        value: activity,
      },
    ],
  });

  showTimeLogs = (timeLogs: TimeLog[]) =>
  {
    const itemsPerPage = 5;
    const createPage = ({ pageItems }: { pageItems: TimeLog[]; }) =>
    {
      const pageContent = pageItems
        .map(({ datetime, activity }) =>
        {
          const time = new Date(datetime).getTime();
          return `<t:${Math.floor(time / 1000)}>\n${activity}`;
        })
        .join('\n\n');

      return `Time logs\n\n${pageContent}`;
    };

    const userIdentifier = this.discord.getAuthorId();
    return this.discord.sendPaginated({
      createPage,
      data: timeLogs,
      itemsPerPage,
      pageControlUserIds: [userIdentifier],
    });
  };

  cannotAddTimeLog = () => this.discord.replyEmbed({
    title: 'An error occurred in adding the time log. Please try again.'
  });

  cannotGetTimelogs = () => this.discord.replyEmbed({
    title: 'An error occurred in getting time logs. Please try again.'
  });
}
