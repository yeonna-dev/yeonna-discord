import { Command } from 'comtroller';
import { SpotifyTokensHandler } from 'spotify-tokens-handler';

import { Discord } from '../libs/discord';

export const spotifylogin: Command =
{
  name: 'spotifylogin',
  aliases: ['s.login'],
  run: ({ discord }: { discord: Discord, }) =>
  {
    discord.startTyping();

    const userId = discord.getAuthorId();
    const loginUrl = SpotifyTokensHandler.getAuthorizeUrl(userId);
    const embed = discord.createDiscordEmbed({
      description: `Please click [this link](${loginUrl}) to login.`
    });

    discord.replyEmbed(embed);
  },
};
