import { Command } from 'comtroller';
import { createRoleRequest } from 'yeonna-core';
import { ColorResolvable, MessageEmbed } from 'discord.js';

import { DiscordMessage } from '../utilities/discord';
import colors from '../utilities/color-names.json';
import { Config } from '../utilities/config';
import { MessageOptions } from 'child_process';

export const rolerequest: Command =
{
  name: 'rolerequest',
  aliases: ['rr'],
  run: async ({ message, }: { message: DiscordMessage, params: string, }) =>
    new RoleRequest(message),
};

class RoleRequest
{
  private message: DiscordMessage;
  private guildId?: string;
  private roleRequestsChannel?: string;
  private name?: string;
  private color?: string;
  private requestId?: string;
  private timeout?: NodeJS.Timeout;
  private stopped?: boolean;

  private timeoutTime = 60000;

  constructor(message: DiscordMessage)
  {
    this.message = message;
    this.start();
  }

  async start()
  {
    const guildId = this.message?.guild?.id;
    if(!guildId)
      return this.message.channel.send('This command can only be used in a guild.');

    this.guildId = guildId;

    const { roleRequestsApprovalChannel } = await Config.ofServer(this.guildId);
    if(!roleRequestsApprovalChannel)
    {
      const response = this.createMessageWithMention(
        'The role requests channel has not been set up yet.'
        + ' Please inform the server administrator to set this up.'
      );

      return this.message.channel.send(response);
    }

    this.roleRequestsChannel = roleRequestsApprovalChannel;

    this.startTimer();

    const name = await this.promptName();
    if(name)
      this.name = name;

    this.restartTimer();

    const color = await this.promptColor();
    if(color)
      this.color = color;

    this.stopTimer();

    if(!this.name && !this.color)
      return this.sendNoNameOrColor();

    this.message.channel.startTyping();

    const roleRequestId = await this.saveRoleRequest();
    if(!roleRequestId)
      return this.message.channel.send('Cannot create a role request. Please try again.');

    this.requestId = roleRequestId;

    this.postRequest();
    this.sendRequestResponse();
  }

  async promptName()
  {
    const response = this.createMessageWithMention(
      'What should be the role name?'
      + '\nPlease **reply** it to this message.'
      + "\nReact with ❌ if you don't want a specific name."
    );

    const namePrompt = await this.message.channel.send(response);

    return new Promise<string | void>(resolve =>
    {
      this.waitReply(namePrompt, ({ content }) => resolve(content));
      this.waitCancel(namePrompt, () => resolve());
    });
  }

  async promptColor()
  {
    const response = this.createMessageWithMention(
      'What should be the role color?'
      + '\nPlease **reply** it to this message.'
      + "\nReact with ❌ if you don't want a specific color."
      + '\n(Please provide a valid __color hex__ code, e.g. #4caf50.)'
    );

    const colorPrompt = await this.message.channel.send(response);

    return new Promise<string | void>(resolve =>
    {
      this.waitReply(colorPrompt, message =>
      {
        this.stopTimer();

        let content = message.content.toLowerCase().replace(/\s/g, '') as keyof typeof colors;
        let color = colors[content];
        if(!color)
        {
          if(content.match(/^#(?:[0-9a-fA-F]{3}){1,2}$/))
            color = content;
          else
            return message.reply(
              'This color is not valid. Please try using the role request command again.'
            );
        }

        resolve(color);
      });

      this.waitCancel(colorPrompt, () => resolve());
    });
  }

  async waitReply(message: DiscordMessage, onReply: (reply: DiscordMessage) => void)
  {
    this.message.waitReplyToMessage({
      messageId: message.id,
      time: this.timeoutTime,
      onReply,
    });
  }

  async waitCancel(message: DiscordMessage, onCancel: () => void)
  {
    await message.waitReact({
      reactions: '❌',
      userId: this.message.author.id,
      time: this.timeoutTime,
      onReact: onCancel,
    });
  }

  async saveRoleRequest()
  {
    if(!this.guildId)
      return;

    try
    {
      const roleRequest = await createRoleRequest({
        roleName: this.name,
        roleColor: this.color,
        requesterDiscordId: this.message.author.id,
        discordGuildId: this.guildId,
      });

      return roleRequest.id;
    }
    catch(error)
    {
      console.error(error);
    }
  }

  postRequest()
  {
    if(!this.roleRequestsChannel)
      return this.message.channel.send('No role requests channel has been set.');

    const roleRequestEmbed = new MessageEmbed()
      .setColor((this.color || 'DEFAULT') as ColorResolvable)
      .setTitle('✋ Role Request')
      .setDescription(
        `Name: **${this.name || '(No name specified)'}**`
        + `\nColor: **${this.color || '(No color specified)'}**`
        + `\nRequested By: __${this.message.author.mention}__`
        + `\n\nTo approve, copy this: \n\`;rra ${this.requestId}\``
        + `\n\nTo decline, copy this: \n\`;rrd ${this.requestId}\``
      )
      .setFooter({ text: `ID: ${this.requestId}` })
      .setTimestamp();

    this.message.sendInChannel({
      channelId: this.roleRequestsChannel,
      options: { embeds: [roleRequestEmbed] } as MessageOptions,
    });
  }

  sendRequestResponse()
  {
    const roleEmbed = new MessageEmbed()
      .setTitle(this.name || '(No name specified)')
      .setColor(this.color as ColorResolvable || 'DEFAULT');

    const content = this.createMessageWithMention(
      'Successfully created a request for the role below.'
      + '\nPlease wait for it to be approved.'
    );

    this.message.channel.send({
      content,
      embeds: [roleEmbed],
    });
  }

  sendNoNameOrColor()
  {
    const response = this.createMessageWithMention('Please provide either a name or color.');
    this.message.channel.send(response);
  }

  startTimer()
  {
    this.timeout = setTimeout(() =>
    {
      if(this.stopped)
        return;

      this.stopped = true;

      const response = this.createMessageWithMention(
        'You did not respond. Please try using the role request command again.'
      );

      this.message.channel.send(response);
    }, this.timeoutTime);
  }

  stopTimer()
  {
    if(this.timeout)
      clearTimeout(this.timeout);
  }

  restartTimer()
  {
    this.stopTimer();
    this.startTimer();
  }

  createMessageWithMention(message: string)
  {
    return `${this.message.author.mention}\n${message}`;
  }
}
