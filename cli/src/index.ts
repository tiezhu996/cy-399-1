#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { registerAuthCommands } from './commands/auth.js';
import { registerScheduleCommand } from './commands/schedule.js';
import { registerBookingCommand } from './commands/booking.js';
import { registerOrderCommand } from './commands/order.js';
import { registerStatsCommand } from './commands/stats.js';
import { registerProfileCommand } from './commands/profile.js';
import { chooseMainAction } from './prompts/menu.js';
import { MENU_ACTION_COMMANDS } from './constants/enums.js';

const program = new Command();
program.name('photo-cli').description('摄影约拍平台 CLI 发布工具').version('1.0.0');
registerAuthCommands(program);
registerScheduleCommand(program);
registerBookingCommand(program);
registerOrderCommand(program);
registerStatsCommand(program);
registerProfileCommand(program);

program.action(async () => {
  const action = await chooseMainAction();
  const commandArgs = MENU_ACTION_COMMANDS[action];
  if (!commandArgs) {
    console.error(chalk.red(`未知操作：${action}`));
    return;
  }
  await program.parseAsync(['node', 'photo-cli', ...commandArgs], { from: 'user' });
});

await program.parseAsync(process.argv);
