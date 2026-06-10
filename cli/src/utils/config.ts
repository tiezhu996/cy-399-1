import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { homedir } from 'node:os';
import { AppConfig, ScheduleTemplate, ScheduleRecord, TimeSlot } from '../types/domain.js';

const configPath = join(homedir(), '.photo-cli', 'config.json');
const defaultConfig: AppConfig = { apiBaseUrl: 'http://localhost:3000' };

export function loadConfig(): AppConfig {
  if (!existsSync(configPath)) return defaultConfig;
  return { ...defaultConfig, ...JSON.parse(readFileSync(configPath, 'utf-8')) };
}

export function saveConfig(config: AppConfig): void {
  mkdirSync(dirname(configPath), { recursive: true });
  writeFileSync(configPath, JSON.stringify(config, null, 2));
}

export function loadTemplates(): ScheduleTemplate[] {
  return loadConfig().scheduleTemplates ?? [];
}

export function saveTemplate(template: ScheduleTemplate): boolean {
  const config = loadConfig();
  const templates = config.scheduleTemplates ?? [];
  if (templates.some((t) => t.name === template.name)) return false;
  config.scheduleTemplates = [...templates, template];
  saveConfig(config);
  return true;
}

export function deleteTemplate(name: string): boolean {
  const config = loadConfig();
  const templates = config.scheduleTemplates ?? [];
  const index = templates.findIndex((t) => t.name === name);
  if (index === -1) return false;
  templates.splice(index, 1);
  config.scheduleTemplates = templates;
  saveConfig(config);
  return true;
}

export function findConflicts(dates: string[], slot: TimeSlot, existing: ScheduleRecord[]): string[] {
  return dates.filter((date) => existing.some((r) => r.date === date && r.slot === slot));
}
