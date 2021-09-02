import { Command } from 'comtroller';

import { updatePoints } from '../actions/updatePoints';

export const addpoints: Command =
{
  name: 'addpoints',
  run: ({ message, params }) => updatePoints({ message, params, add: true }),
};
