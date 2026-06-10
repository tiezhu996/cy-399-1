#!/usr/bin/env node
import { Command } from 'commander';
import { registerAuthCommands } from './commands/auth.js';
import { registerScheduleCommand } from './commands/schedule.js';
import { registerBookingCommand } from './commands/booking.js';
import { registerOrderCommand } from './commands/order.js';
import { registerStatsCommand } from './commands/stats.js';
import { registerProfileCommand } from './commands/profile.js';
import { chooseMainAction, chooseTemplateAction } from './prompts/menu.js';

const program = new Command();
program.name('photo-cli').description('摄影约拍平台 CLI 发布工具').version('1.0.0');
registerAuthCommands(program);
registerScheduleCommand(program);
registerBookingCommand(program);
registerOrderCommand(program);
registerStatsCommand(program);
registerProfileCommand(program);

program.action(async () => {
  let action = await chooseMainAction();
  if (action === 'schedule-template') {
    action = await chooseTemplateAction();
  }
  await program.parseAsync(['node', 'photo-cli', ...action.split('-')], { from: 'user' });
});

await program.parseAsync(process.argv);
