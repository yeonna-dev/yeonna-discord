import
{
  Awaitable,
  Client,
  Intents,
} from 'discord.js';

import { DiscordMessage } from './message';

import { Log } from '../logger';

export { DiscordMessage };

/** Abstraction of Discord.js Client class. */
export class Discord
{
  private client: Client;

  constructor()
  {
    /**
     * Create and login a Discord client.
     */
    this.client = new Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
      ],
    });

    this.client.login(process.env.BOT_TOKEN);
    this.client.on(
      'ready',
      () => Log.info(`Discord bot connected as ${this.client.user?.tag}`, true)
    );
  }

  onMessage(listener: (message: DiscordMessage) => Awaitable<void>)
  {
    this.client.on('messageCreate', message => listener(new DiscordMessage(message)));
  }
}
