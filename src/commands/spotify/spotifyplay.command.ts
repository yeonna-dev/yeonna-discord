import { Command, parseParamsToArray } from 'comtroller';
import { createSpotifyApi } from 'src/actions/createSpotifyApi';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { Spotify } from 'src/libs/spotify';

export const spotifyplay: Command =
{
  name: 'spotifyplay',
  aliases: ['s.p'],
  run: async ({ discord, params }: { discord: Discord, params: string, }) =>
  {
    discord.startTyping();

    const spotifyApi = await createSpotifyApi(discord);
    if(!spotifyApi)
      return;

    try
    {
      if(!params)
      {
        const { body } = await spotifyApi.getMyCurrentPlaybackState();
        const isPlaying = body.is_playing;
        let embedTitle;
        if(isPlaying)
        {
          await spotifyApi.pause();
          embedTitle = '⏸️  Paused Spotify';
        }
        else
        {
          await spotifyApi.play();
          embedTitle = '▶️  Resumed Playing Spotify';
        }

        const replyEmbed = discord.createDiscordEmbed({ title: embedTitle });
        return discord.replyEmbed(replyEmbed);
      }

      const [spotifyUrl] = parseParamsToArray(params);
      const uriToQueue = Spotify.getUri(spotifyUrl);
      if(!spotifyUrl || !uriToQueue)
        return discord.reply('Invalid Spotify URL.');

      await spotifyApi.addToQueue(uriToQueue);
      await spotifyApi.skipToNext();
      discord.reply('Now Playing that track.');
    }
    catch(error)
    {
      Log.error(error);
      discord.reply('Whoops an error occurred. You can try logging in again with Spotify.');
    }
  },
};
