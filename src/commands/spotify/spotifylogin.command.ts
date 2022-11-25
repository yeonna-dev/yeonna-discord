// import { SpotifyTokensHandler } from 'spotify-tokens-handler';
import { YeonnaCommand } from 'src/types';

export const spotifylogin: YeonnaCommand =
{
  name: 'spotifylogin',
  aliases: ['s.login'],
  run: ({ discord }) =>
  {
    // discord.startTyping();

    // const userId = discord.getAuthorId();
    // const loginUrl = SpotifyTokensHandler.getAuthorizeUrl(userId);
    // const embed = discord.createDiscordEmbed({
    //   description: `Please click [this link](${loginUrl}) to login.`
    // });

    // discord.replyEmbed(embed);
  },
};
