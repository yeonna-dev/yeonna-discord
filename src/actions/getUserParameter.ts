import { parseParamsToArray } from 'comtroller';
import { Discord } from 'src/libs/discord';

export async function getUserParameter({
  discord,
  params,
  acceptMentions = true,
  asGuildMember = true,
  defaultToAuthor,
}: {
  discord: Discord,
  params: string,
  acceptMentions?: boolean,
  asGuildMember?: boolean,
  defaultToAuthor?: boolean,
})
{
  let userIdentifier;
  if(acceptMentions)
  {
    let mentionedMemberId = discord.getMentionedMemberId();
    if(mentionedMemberId)
      userIdentifier = mentionedMemberId;
  }

  if(userIdentifier)
    return userIdentifier;

  userIdentifier = parseParamsToArray(params)[0];
  if(userIdentifier)
  {
    if(asGuildMember)
    {
      const memberId = await discord.getGuildMemberId(userIdentifier);
      if(memberId)
        userIdentifier = memberId;
    }
  }

  if(!userIdentifier && defaultToAuthor)
    return discord.getAuthorId();

  return userIdentifier;
}
