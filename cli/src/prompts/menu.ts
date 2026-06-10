import inquirer from 'inquirer';

export async function chooseMainAction() {
  const answer = await inquirer.prompt<{ action: string }>([
    { type: 'list', name: 'action', message: '请选择操作', choices: [
      { name: '登录', value: 'login' },
      { name: '注册', value: 'register' },
      { name: '发布约拍档期', value: 'schedule-publish' },
      { name: '档期模板管理', value: 'schedule-template' },
      { name: '查看预约请求', value: 'booking' },
      { name: '订单管理', value: 'order' },
      { name: '收入统计', value: 'stats' },
      { name: '个人资料管理', value: 'profile' },
    ] },
  ]);
  return answer.action;
}

export async function chooseTemplateAction() {
  const answer = await inquirer.prompt<{ action: string }>([
    { type: 'list', name: 'action', message: '档期模板管理', choices: [
      { name: '保存新模板', value: 'schedule-save-template' },
      { name: '查看模板列表', value: 'schedule-list-templates' },
      { name: '删除模板', value: 'schedule-delete-template' },
    ] },
  ]);
  return answer.action;
}
