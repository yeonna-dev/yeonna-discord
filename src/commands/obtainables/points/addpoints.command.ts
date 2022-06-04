import { Command } from 'comtroller';
import { updatePoints } from 'src/actions/updatePoints';
import { isDeveloperOnly } from 'src/guards/isDeveloper';

export const addpoints: Command =
{
  name: 'addpoints',
  guards: [isDeveloperOnly],
  run: ({ discord, params }) => updatePoints({ discord, params, add: true }),
};
