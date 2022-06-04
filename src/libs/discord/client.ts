import { Awaitable, Client, Intents, Message } from 'discord.js';
import { Log } from 'src/libs/logger';

/** Abstraction of Discord.js Client class. */
export class DiscordClient extends Client
{
  constructor()
  {
    super({
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
      partials: ['USER', 'MESSAGE', 'REACTION'],
    });

    this.login(process.env.BOT_TOKEN);
    this.on('ready', () => Log.info(`Discord bot connected as ${this.user?.tag}`, true));
  }

  onGuildMemberMessage(listener: (message: Message) => Awaitable<void>)
  {
    this.on('messageCreate', message =>
    {
      if(message.author.bot)
        return;

      if(!message.guild || !message.member)
        return;

      listener(message);
    });
  }
}
