import { Message } from 'discord.js';
import { Discord } from 'src/libs/discord';
import { CommandResponse } from 'src/responses/common';

export class GameCommandResponse extends CommandResponse
{
  constructor(discord: Discord)
  {
    super(discord);
  }

  wheelSpinNotValidOption = () => this.discord.replyEmbed({
    title: 'Please choose a valid wheel spin option.',
  });

  wheelSpinSpinning = (pickedOption: string) => this.discord.replyEmbed({
    title: `You chose **${pickedOption}**`,
    description: 'Spinning... <a:wheel:857186381583220756>',
  });

  wheelSpinResult = (
    spinningMessage: Message,
    winningOption: string,
    isWon: boolean,
    reward: number,
  ) =>
  {
    const embed = this.discord.createDiscordEmbed({
      description: `The wheel stopped at **${winningOption}**.`
        + `\n\nYou ${isWon ? `win __**${reward}**__ points!` : 'lose.'}`
    });

    spinningMessage.edit({
      embeds: [embed]
    });
  };
}
