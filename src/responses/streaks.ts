import { Discord } from 'src/libs/discord';
import { CommandResponse } from 'src/responses/common';

export class StreaksCommandResponse extends CommandResponse
{
  constructor(discord: Discord)
  {
    super(discord);
  }

  streakUpdate = (previousCount: number = 0, currentCount: number = 0, streaksName?: string) =>
  {
    streaksName = streaksName || 'repeat/s';
    const previousCountString = `${previousCount} ${streaksName}`;
    const currentCountString = `${currentCount} ${streaksName}`;
    return this.discord.createDiscordEmbed({
      title: `Updated your streak from ${previousCountString} ➡️ __${currentCountString}__`,
    });
  };

  help = (prefix: string) => this.discord.replyEmbed({
    title: 'Commands',
    fields: [
      {
        name: `\`${prefix}up\``,
        value: 'Increase your streak by 1',
      },
      {
        name: `\`${prefix}down\``,
        value: 'Decrease your streak by 1',
      },
      {
        name: `\`${prefix}set (number)\``,
        value: 'Set your streak to the specified number',
      },
      {
        name: `\`${prefix}reset\``,
        value: 'Reset your streak to 0',
      },
      {
        name: `\`${prefix}stats\``,
        value: 'Show your streak statistics',
      },
      {
        name: `\`${prefix}help\``,
        value: 'Show this message',
      },
    ],
  });

  stats = ({
    count,
    longest,
    updatedAt,
    createdAt,
  }: {
    count: number,
    longest: number,
    updatedAt: string | Date,
    createdAt: string | Date,
  }) =>
  {
    const countString = `${count} day${count === 1 ? '' : 's'}`;
    const longestString = `${longest} day${longest === 1 ? '' : 's'}`;
    const lastUpdateDate = new Date(updatedAt);
    const lastUpdateSeconds = Math.floor(lastUpdateDate.getTime() / 1000);
    const lastCreatedDate = new Date(createdAt);
    const startedSinceSeconds = Math.floor(lastCreatedDate.getTime() / 1000);
    return this.discord.replyEmbed({
      description: (
        'Current streak'
        + `\n **${countString}**`
        + '\n\nLast update'
        + `\n**<t:${lastUpdateSeconds}:F>**`
        + '\n\nLongest streak'
        + `\n**${longestString}**`
        + '\n\nStarted since'
        + `\n**<t:${startedSinceSeconds}:F>**`
      ),
    });
  };

  streakUpdateError = () => this.discord.replyEmbed({
    title: 'An error occurred in updating the streak. Please try again.'
  });

  roleError = () => this.discord.replyEmbed({
    title: 'The streak was updated, but an error occurred in updating the streak role.',
  });

  statsError = () => this.discord.replyEmbed({
    title: 'An error occurred in getting the stats. Please try again.'
  });
}
