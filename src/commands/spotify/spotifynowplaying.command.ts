// import { createSpotifyApi } from 'src/actions/createSpotifyApi';
// import { Log } from 'src/libs/logger';
import { YeonnaCommand } from 'src/types';

export const spotifynowplaying: YeonnaCommand =
{
  name: 'spotifynowplaying',
  aliases: ['s.np'],
  run: async ({ discord }) =>
  {
    // discord.startTyping();

    // const spotifyApi = await createSpotifyApi(discord);
    // if(!spotifyApi)
    //   return;

    // try
    // {
    //   const { body } = await spotifyApi.getMyCurrentPlayingTrack();
    //   discord.reply(body.item?.external_urls.spotify || '');
    // }
    // catch(error)
    // {
    //   Log.error(error);
    //   discord.reply('Whoops an error occurred. You can try logging in again with Spotify.');
    // }
  },
};
