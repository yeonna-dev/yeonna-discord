import { Discord } from 'src/libs/discord';
import { CommandResponse } from 'src/responses/common';
import { GuildConfig } from 'src/types';

export class GamesCommandResponse extends CommandResponse
{
  private pointsName: string;

  constructor(discord: Discord, config: GuildConfig)
  {
    super(discord);
    this.pointsName = config.pointsName;
  }

  wheelSpinNotValidOption = () => this.discord.replyEmbed({
    title: 'Please choose a valid wheel spin option.',
  });

  wheelSpinSpinning = (pickedOption: string) => this.discord.replyEmbed({
    title: `You chose **${pickedOption}**`,
    description: 'Spinning... <a:wheel:857186381583220756>',
  });

  wheelSpinResult = (
    spinningMessage: Discord,
    winningOption: string,
    isWon: boolean,
    reward: number,
  ) =>
  {
    const embed = this.discord.createDiscordEmbed({
      description: `The wheel stopped at **${winningOption}**.`
        + `\n\nYou ${isWon ? `win __**${reward}**__ ${this.pointsName}` : 'lose.'}`
    });

    spinningMessage.edit({
      embeds: [embed]
    });
  };
}
