import { Message } from 'discord.js';
import { Command } from 'comtroller';
import axios from 'axios';
import cheerio from 'cheerio';

import { updateUserPoints } from 'yeonna-core';

import { cooldowns } from '../cooldowns/cooldowns-instance';
import { waitResponse } from '../helpers/waitResponse';
import { getTimeLeft } from '../helpers/getTimeLeft';
import { Log } from '../utilities/logger';

const command = 'factguess';

/* Add 30 second cooldown. */
cooldowns.add(command, 30000);

const members =
[
  { name: 'Nayeon', hangul: '나연' },
  { name: 'Jeongyeon', hangul: '정연' },
  { name: 'Momo', hangul: '모모' },
  { name: 'Sana', hangul: '사나' },
  { name: 'Jihyo', hangul: '지효' },
  { name: 'Mina', hangul: '미나' },
  { name: 'Dahyun', hangul: '다현' },
  { name: 'Chaeyoung', hangul: '채영' },
  { name: 'Tzuyu', hangul: '쯔위'  }
];

const filteredText =
[
  'twice members profile', 'nationality', 'stage name', 'birth name', 'blood type',
  'zodiac', 'weight', 'twitter', 'instagram', 'representative color',
  'show more', 'older brother', 'hanlim', 'ambidextrous',
];

const misspelledNamesRegex = /Jungyeon|Chaeyeong|Ji-hyo/g;

// TODO: Instead of guessing the member, make this more generic to guessing something basd on the given fact
// TODO: Update responses
// TODO: Update reward
export const factguess: Command =
{
  name: 'factguess',
  aliases: [ 'fg' ],
  run: async ({ message }: { message: Message }) =>
  {
    message.channel.send('kprofiles changed so now this command is broken...');

    // TODO: Remove temporary guild filter.
    // if(! [ '504135117296500746', '533510632985853953' ].includes(message.guild?.id || ''))
    //   return;

    // const user = message.author.id;
    // const cooldown = await cooldowns.check(command, user);
    // if(cooldown)
    //   return message.channel.send(`Please wait ${getTimeLeft(cooldown)}.`);

    // /* Pick a random member. */
    // const
    // {
    //   name: memberName,
    //   hangul: memberHangulName,
    // } = members[Math.floor(Math.random() * members.length)];

    // message.channel.startTyping();

    // /* Scrape the information from the website. */
    // const { data: profiles } = await axios.get('https://kprofiles.com/twice-members-profile');
    // let $ = cheerio.load(profiles);
    // let info: any = $(`.entry-content > p:contains("${memberHangulName}")`).text();
    // let facts = $(`.entry-content > p:contains("${memberName} Facts") a:contains("Show more")`)
    //   .prop('href');

    // const { data: memberFacts } = await axios.get(facts);
    // if(! memberFacts)
    //   return message.channel.send('Cannot get member facts.');

    // $ = cheerio.load(memberFacts);
    // facts = $(`.entry-content > p:contains("${memberName} facts")`).text();
    // info += `\n${facts}`;
    // info = info.split('\n')
    //   .filter((_info: string) =>
    //   {
    //     _info = _info.toLowerCase();
    //     const name = memberName.toLowerCase();
    //     return (
    //       _info !== '' && _info !== name &&
    //       !_info.match(`${name} facts`) &&
    //       filteredText.every(item => !_info.match(item))
    //     );
    //   });

    // console.log(info);

    // info = info[Math.floor(Math.random() * members.length)]
    //   .replace(/^– /g, '')
    //   .replace(new RegExp(memberName, 'g'), 'this member')
    //   .replace(misspelledNamesRegex, 'this member');

    // info = info.charAt(0).toUpperCase() + info.substr(1).trim();

    // message.channel.send(info);
    // message.channel.stopTyping(true);

    // const response = await waitResponse(message, 5000);
    // if(! response)
    //   return message.channel.send(`Time's up! It's **${memberName}**.`);

    // if(response.content.toLowerCase() !== memberName.toLowerCase())
    //   return message.channel.send('Wrong.');

    // try
    // {
    //   const reward = 250;
    //   await updateUserPoints({
    //     discordID: user,
    //     amount: reward,
    //     discordGuildID: message.guild?.id,
    //     add: true,
    //   });
    //   message.channel.send(`Correct! You get **${reward}** points.`);
    // }
    // catch(error)
    // {
    //   Log.error(error);
    //   message.channel.send('Cannot add points.');
    // }
  },
};
