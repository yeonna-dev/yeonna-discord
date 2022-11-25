import { AnyChannel } from 'discord.js';
import { Discord } from 'src/libs/discord';
import { CommandResponse } from 'src/responses/common';

export class RoleRequestsCommandResponse extends CommandResponse
{
  constructor(discord: Discord)
  {
    super(discord);
  }

  roleNamePrompt = () => this.discord.replyEmbed({
    title: 'What should be the role name?',
    description: '\nPlease __**reply**__ it to this message.'
      + "\nReact with ❌ if you don't want a specific name."
  });

  roleColorPrompt = () => this.discord.replyEmbed({
    title: 'What should be the role color?',
    description: '\nPlease __**reply**__ it to this message.'
      + "\nReact with ❌ if you don't want a specific color."
      + '\n(Please provide a valid __color hex__ code, e.g. #4caf50.)'
  });

  requestNotesPrompt = () => this.discord.replyEmbed({
    title: 'Any notes you would like to add to the request?',
    description: '\nPlease __**reply**__ it to this message.'
      + "\nReact with ❌ if you don't have any notes to add.",
  });

  requestPost = (requestChannelId: string, role: {
    name?: string;
    color?: string,
    notes?: string,
    requestId: string,
    requesterMention: string,
    botPrefix: string,
  }) =>
  {
    const { name, color, notes, requestId, requesterMention, botPrefix } = role;
    const approveCommand = `${botPrefix}rra ${requestId}`;
    const requestEmbed = this.discord.createDiscordEmbed({
      color: (color || 'DEFAULT'),
      title: '✋ Role Request',
      description: `Requested By: __${requesterMention}__`
        + `\nName: **${name || '(No name specified)'}**`
        + `\nColor: **${color || '(No color specified)'}**`
        + (notes ? `\nNotes:\n\`\`\`\n${notes}\n\`\`\`` : '')
        + `\nTo approve, copy this: \n\`\`\`${approveCommand}\`\`\``
        + '\n`above` or `below` followed by a **role ID** can be added to the approve command'
        + ' in order to set the position of the requested role relative to the role'
        + ' with the given role ID.'
        + `\nFor example: \`${approveCommand} above 587630489607733249\``
        + `\n\nTo decline, copy this: \n\`\`\`${botPrefix}rrd ${requestId}\`\`\``,
      footer: { text: `ID: ${requestId}` },
      timestamp: new Date()
    });

    this.discord.sendInChannel(requestChannelId, { embeds: [requestEmbed] });
  };

  requestCreated = (role: {
    name?: string,
    color?: string,
  }) =>
  {
    const { name, color } = role;
    const responseEmbed = this.discord.createDiscordEmbed({
      title: 'Successfully created a request for the role below.',
      description: 'Please wait for it to be approved.',
    });

    const roleEmbed = this.discord.createDiscordEmbed({
      title: name || '(No name specified)',
      color: color || 'DEFAULT',
    });

    this.discord.reply({ embeds: [responseEmbed, roleEmbed] });
  };

  requestResponse = (requestId: string, isApproved: boolean) => this.discord.replyEmbed({
    description: `Role request with ID \`${requestId}\` has been`
      + ` **${isApproved ? 'approved' : 'declined'}**.`
  });

  requestResponseUserDm = (requesterDiscordId: string, roleName: string, isApproved: boolean) =>
  {
    let description = `Your request for ${roleName ? `the \`${roleName}\`` : 'a'}`
      + ` role has been **${isApproved ? 'approved' : 'declined'}**.`;
    if(isApproved)
      description += '\nYou now have the role.';

    this.discord.sendToUser(requesterDiscordId, { embeds: [{ description }] });
  };

  invalidRoleColor = () => this.discord.replyEmbed({
    title: 'This color is not valid. Please try doing the command again.'
  });

  noNameOrColor = () => this.discord.replyEmbed({
    title: 'Please do the command again and provide either a name or color.'
  });

  notesTooLong = (maxNotesLength: number) => this.discord.replyEmbed({
    title: `Notes are too long.`,
    description: `Maximum of ${maxNotesLength} characters is allowed.`
  });

  noReply = () => this.discord.replyEmbed({
    title: 'You did not respond. Please try using the role request command again.'
  });

  cannotCreateRequest = () => this.discord.replyEmbed({
    title: 'Cannot create a role request. Please try again.',
  });

  cannotCreateRole = () => this.discord.replyEmbed({
    title: 'Cannot create the requested role. I might not have permissions.',
  });

  cannotRelativeMoveRole = () => this.discord.replyEmbed({
    title: 'Cannot move the created role relative to the given relative role.',
    description: 'I might not have permissions to move roles above that relative role.',
  });

  cannotAssignRole = () => this.discord.replyEmbed({
    title: 'Cannot create and assign the role. I might not have the permissions to do so.'
  });

  noRoleRequestsChannel = () => this.discord.replyEmbed({
    title: 'The role requests channel has not been set up yet.'
      + ' Please inform the server administrator to set this up.'
  });

  requestResponseFail = (isApproved: boolean) => this.discord.replyEmbed({
    title: `Cannot ${isApproved ? 'approve' : 'decline'} the role request.`
      + ' It might not be a pending role request.'
  });

  noIdProvided = () => this.discord.replyEmbed({
    title: 'No role request ID provided.'
  });

  channelChanged = (channelMention: AnyChannel) => this.discord.replyEmbed({
    description: `Set the role requests approval channel to ${channelMention}`
  });

  channelCannotSet = () => this.discord.replyEmbed({
    title: 'Could not set the channel for role requests.',
  });
}
