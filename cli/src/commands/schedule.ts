import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import {
  SHOOT_TYPES,
  TIME_SLOTS,
  SHOOT_TYPE_LABELS,
  TIME_SLOT_LABELS,
  SCHEDULE_MESSAGES,
} from '../constants/enums.js';
import { ScheduleTemplate, SchedulePayload, TimeSlot, ShootType } from '../types/domain.js';
import { photoApi } from '../api/photoApi.js';
import { loadTemplates, saveTemplate, deleteTemplate, findConflicts } from '../utils/config.js';
import { printApiError } from '../utils/errors.js';

async function promptScheduleFields(
  defaults?: Partial<ScheduleTemplate>,
): Promise<{ dates: string; slot: TimeSlot; shootType: ShootType; price: number; city: string }> {
  return inquirer.prompt([
    { type: 'input', name: 'dates', message: '可约日期，逗号分隔，例如 2026-06-10,2026-06-11', default: defaults?.dates },
    { type: 'list', name: 'slot', message: '时段', choices: TIME_SLOTS, default: defaults?.slot },
    { type: 'list', name: 'shootType', message: '拍摄类型', choices: SHOOT_TYPES, default: defaults?.shootType },
    { type: 'number', name: 'price', message: '价格', default: defaults?.price },
    { type: 'input', name: 'city', message: '服务城市', default: defaults?.city },
  ]);
}

async function checkAndPublish(payload: SchedulePayload): Promise<void> {
  try {
    const existing = await photoApi.listSchedules();
    const conflicts = findConflicts(payload.dates, payload.slot, existing);
    if (conflicts.length > 0) {
      console.log(chalk.yellow(SCHEDULE_MESSAGES.DUPLICATE_WARNING));
      conflicts.forEach((d) => console.log(chalk.yellow(`  - ${d} ${TIME_SLOT_LABELS[payload.slot]}`)));
      const { proceed } = await inquirer.prompt<{ proceed: boolean }>([
        { type: 'confirm', name: 'proceed', message: '仍要继续发布？', default: false },
      ]);
      if (!proceed) return;
    }
    await photoApi.createSchedules(payload);
    console.log(chalk.green(SCHEDULE_MESSAGES.PUBLISH_SUCCESS));
  } catch (error) {
    printApiError(error);
  }
}

async function handlePublish(): Promise<void> {
  const templates = loadTemplates();
  if (templates.length === 0) {
    await handleManualPublish();
    return;
  }
  const { mode } = await inquirer.prompt<{ mode: string }>([
    {
      type: 'list',
      name: 'mode',
      message: '选择发布方式',
      choices: [
        { name: '从模板选用', value: 'template' },
        { name: '手动填写', value: 'manual' },
      ],
    },
  ]);
  if (mode === 'template') {
    await handleTemplatePublish(templates);
  } else {
    await handleManualPublish();
  }
}

async function handleManualPublish(): Promise<void> {
  try {
    const answer = await promptScheduleFields();
    const dates = String(answer.dates).split(',').map((item) => item.trim());
    const payload: SchedulePayload = { dates, slot: answer.slot, shootType: answer.shootType, price: answer.price, city: answer.city };
    await checkAndPublish(payload);
    const { save } = await inquirer.prompt<{ save: boolean }>([
      { type: 'confirm', name: 'save', message: '是否保存为模板以便下次快捷选用？', default: false },
    ]);
    if (save) await handleSaveTemplate({ slot: answer.slot, shootType: answer.shootType, price: answer.price, city: answer.city });
  } catch (error) {
    printApiError(error);
  }
}

async function handleTemplatePublish(templates: ScheduleTemplate[]): Promise<void> {
  try {
    const { templateName } = await inquirer.prompt<{ templateName: string }>([
      {
        type: 'list',
        name: 'templateName',
        message: '选择模板',
        choices: templates.map((t) => ({
          name: `${t.name}（${SHOOT_TYPE_LABELS[t.shootType]} / ${TIME_SLOT_LABELS[t.slot]} / ¥${t.price} / ${t.city}）`,
          value: t.name,
        })),
      },
    ]);
    const tpl = templates.find((t) => t.name === templateName)!;
    const answer = await promptScheduleFields(tpl);
    const dates = String(answer.dates).split(',').map((item) => item.trim());
    const payload: SchedulePayload = { dates, slot: answer.slot, shootType: answer.shootType, price: answer.price, city: answer.city };
    await checkAndPublish(payload);
  } catch (error) {
    printApiError(error);
  }
}

async function handleSaveTemplate(partial?: Partial<ScheduleTemplate>): Promise<void> {
  try {
    const answer = await inquirer.prompt([
      { type: 'input', name: 'name', message: '模板名称' },
      { type: 'list', name: 'slot', message: '时段', choices: TIME_SLOTS, default: partial?.slot },
      { type: 'list', name: 'shootType', message: '拍摄类型', choices: SHOOT_TYPES, default: partial?.shootType },
      { type: 'number', name: 'price', message: '价格', default: partial?.price },
      { type: 'input', name: 'city', message: '服务城市', default: partial?.city },
    ]);
    const template: ScheduleTemplate = { name: answer.name, slot: answer.slot, shootType: answer.shootType, price: answer.price, city: answer.city };
    if (!saveTemplate(template)) {
      console.log(chalk.yellow(SCHEDULE_MESSAGES.TEMPLATE_NAME_EXISTS));
      return;
    }
    console.log(chalk.green(SCHEDULE_MESSAGES.TEMPLATE_SAVED));
  } catch (error) {
    printApiError(error);
  }
}

async function handleListTemplates(): Promise<void> {
  const templates = loadTemplates();
  if (templates.length === 0) {
    console.log(chalk.gray(SCHEDULE_MESSAGES.TEMPLATE_EMPTY));
    return;
  }
  templates.forEach((t) => {
    console.log(
      `  ${chalk.cyan(t.name)}  ${SHOOT_TYPE_LABELS[t.shootType]} / ${TIME_SLOT_LABELS[t.slot]} / ¥${t.price} / ${t.city}`,
    );
  });
}

async function handleDeleteTemplate(): Promise<void> {
  const templates = loadTemplates();
  if (templates.length === 0) {
    console.log(chalk.gray(SCHEDULE_MESSAGES.TEMPLATE_EMPTY));
    return;
  }
  const { name } = await inquirer.prompt<{ name: string }>([
    {
      type: 'list',
      name: 'name',
      message: '选择要删除的模板',
      choices: templates.map((t) => ({ name: t.name, value: t.name })),
    },
  ]);
  if (deleteTemplate(name)) {
    console.log(chalk.green(SCHEDULE_MESSAGES.TEMPLATE_DELETED));
  }
}

export function registerScheduleCommand(program: Command): void {
  const cmd = program.command('schedule').description('档期管理');

  cmd.command('publish').description('发布约拍档期').action(async () => {
    await handlePublish();
  });

  cmd.command('template-save').description('保存档期模板').action(async () => {
    await handleSaveTemplate();
  });

  cmd.command('template-list').description('查看已保存的档期模板').action(async () => {
    await handleListTemplates();
  });

  cmd.command('template-delete').description('删除档期模板').action(async () => {
    await handleDeleteTemplate();
  });
}
