// import { parseParamsToArray } from 'comtroller';
// import { createSpotifyApi } from 'src/actions/createSpotifyApi';
// import { Log } from 'src/libs/logger';
// import { Spotify } from 'src/libs/spotify';
import { YeonnaCommand } from 'src/types';

export const spotifyqueue: YeonnaCommand =
{
  name: 'spotifyqueue',
  aliases: ['s.q'],
  run: async ({ discord, params }) =>
  {
    // const [spotifyUrl] = parseParamsToArray(params);
    // if(!spotifyUrl)
    //   return;

    // const uriToQueue = Spotify.getUri(spotifyUrl);
    // if(!uriToQueue || !uriToQueue.includes('track'))
    //   return discord.reply('Invalid Spotify track URL.');

    // discord.startTyping();

    // const spotifyApi = await createSpotifyApi(discord);
    // if(!spotifyApi)
    //   return;

    // try
    // {
    //   await spotifyApi.addToQueue(uriToQueue);
    //   discord.reply('Queue success');
    // }
    // catch(error)
    // {
    //   Log.error(error);
    //   discord.reply('Whoops an error occurred. You can try logging in again with Spotify.');
    // }
  },
};
