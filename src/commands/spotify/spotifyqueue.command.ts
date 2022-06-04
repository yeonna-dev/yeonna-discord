import { Command, parseParamsToArray } from 'comtroller';
import { createSpotifyApi } from 'src/actions/createSpotifyApi';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { Spotify } from 'src/libs/spotify';

export const spotifyqueue: Command =
{
  name: 'spotifyqueue',
  aliases: ['s.q'],
  run: async ({ discord, params }: { discord: Discord, params: string, }) =>
  {
    const [spotifyUrl] = parseParamsToArray(params);
    if(!spotifyUrl)
      return;

    const uriToQueue = Spotify.getUri(spotifyUrl);
    if(!uriToQueue || !uriToQueue.includes('track'))
      return discord.reply('Invalid Spotify track URL.');

    discord.startTyping();

    const spotifyApi = await createSpotifyApi(discord);
    if(!spotifyApi)
      return;

    try
    {
      await spotifyApi.addToQueue(uriToQueue);
      discord.reply('Queue success');
    }
    catch(error)
    {
      Log.error(error);
      discord.reply('Whoops an error occurred. You can try logging in again with Spotify.');
    }
  },
};
