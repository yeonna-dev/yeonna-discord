import { Command } from 'comtroller';
import { createSpotifyApi } from '../actions/createSpotifyApi';
import { Discord } from '../libs/discord';
import { Log } from '../libs/logger';

export const spotifynowplaying: Command =
{
  name: 'spotifynowplaying',
  aliases: ['s.np'],
  run: async ({ discord }: { discord: Discord, }) =>
  {
    discord.startTyping();

    const spotifyApi = await createSpotifyApi(discord);
    if(!spotifyApi)
      return;

    try
    {
      const { body } = await spotifyApi.getMyCurrentPlayingTrack();
      discord.reply(body.item?.external_urls.spotify || '');
    }
    catch(error)
    {
      Log.error(error);
      discord.reply('Whoops an error occurred. You can try logging in again with Spotify.');
    }
  },
};
