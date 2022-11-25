// import { SpotifyTokensHandler } from 'spotify-tokens-handler';
// import { AuthTokensType, AuthTokensWithIdentifier } from 'spotify-tokens-handler/dist/types';
// import SpotifyWebApi from 'spotify-web-api-node';
// import { Firestore } from './firestore';

// export class Spotify
// {
//   static initialize()
//   {
//     SpotifyTokensHandler.startServer();
//     SpotifyTokensHandler.onObtainTokens(Spotify.saveTokens);
//   }

//   static saveTokens({ identifier, accessToken, refreshToken }: AuthTokensWithIdentifier)
//   {
//     return Firestore.setDocument(identifier as string, { accessToken, refreshToken });
//   }

//   static async createApi(userId: string)
//   {
//     const identifier = SpotifyTokensHandler.encodeIdentifier(userId);
//     const encryptedTokens = await Firestore.getDocument<AuthTokensType>(identifier);
//     if(!encryptedTokens)
//       return;

//     const { accessToken } = SpotifyTokensHandler.decodeTokens(encryptedTokens);
//     const api = new SpotifyWebApi();
//     api.setAccessToken(accessToken as string);
//     return api;
//   }

//   static getUri(url: string)
//   {
//     if(!url)
//       return;

//     const urlSegments = new URL(url).pathname.split('/');
//     const id = urlSegments.pop();
//     if(!id)
//       return;

//     const type = urlSegments.pop();
//     if(!type)
//       return;

//     return `spotify:${type}:${id}`;
//   }

//   // TODO: Handle token refresh
// }
