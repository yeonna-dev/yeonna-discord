import { spotifylogin } from '../commands/spotifylogin';
import { Discord } from '../libs/discord';
import { Spotify } from '../libs/spotify';

export async function createSpotifyApi(discord: Discord)
{
  const userId = discord.getAuthorId();
  const spotifyApi = await Spotify.createApi(userId);
  if(!spotifyApi)
  {
    discord.reply(`Please login using the \`${spotifylogin.name}\` command.`);
    return;
  }

  return spotifyApi;
}