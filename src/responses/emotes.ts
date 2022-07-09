import { GuildEmoji } from 'discord.js';
import { Discord } from 'src/libs/discord';
import { CommandResponse } from 'src/responses/common';

export class EmoteCommandResponse extends CommandResponse
{
  constructor(discord: Discord)
  {
    super(discord);
  }

  noMedia = () => this.discord.replyEmbed({
    title: 'Please add a valid image or gif link or attachment or try again.',
  });

  noName = () => this.discord.replyEmbed({
    title: 'Please type the name for the emote.',
  });

  noEmoteOrName = () => this.discord.replyEmbed({
    title: 'Please type the emote or the name of the emote.',
  });

  existing = (existingEmote: GuildEmoji) => this.discord.replyEmbed({
    title: `There is already a \`:${existingEmote.name}:\`\nIt's ${existingEmote}`,
  });

  nonExisting = () => this.discord.replyEmbed({
    title: 'There is no emote with that name.',
  });

  saved = (emoteSaved: GuildEmoji | undefined) => this.discord.send(`${emoteSaved}`);

  deleted = (deletedEmote: GuildEmoji) => this.discord.replyEmbed({
    title: `\`${deletedEmote}\` has been deleted.`,
  });

  cannotRename = () => this.discord.replyEmbed({
    title: 'Cannot rename emote.',
  });

  cannotResize = () => this.discord.replyEmbed({
    title: 'Cannot resize image. Please try again.',
  });

  fileTooLarge = (message: string) => this.discord.replyEmbed({
    title: message || 'The image or gif if too large.',
  });

  invalidName = () => this.discord.replyEmbed({
    title: 'Invalid emote name.'
  });

  error = () => this.discord.replyEmbed({
    title: 'An error occurred in adding the emote. Please try again.',
  });
};
