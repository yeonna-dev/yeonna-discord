import { Discord } from 'src/libs/discord';
import { CommandResponse } from 'src/responses/common';

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

  cannotAddTimeLog = () => this.discord.replyEmbed({
    title: 'An error occurred in adding the time log. Please try again.'
  });
}
