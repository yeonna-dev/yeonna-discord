import { spotifylogin } from 'src/commands/spotify/spotifylogin.command';
import { Discord } from 'src/libs/discord';
import { Spotify } from 'src/libs/spotify';

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