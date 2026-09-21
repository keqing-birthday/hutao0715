// 成员信息在此集中维护。
// credits 可为同一成员记录多个职责，贡献成员区会据此自动分组。
export const members = [
  {
    id: 'pa-duoduo',
    name: '怕朵朵朵朵朵',
    role: '主策划',
    bilibili: 'https://space.bilibili.com/203293709',
    avatar: '/images/avatars/1fcef3b283c9c1a358c701d203d2f428.webp',
    credits: [{ groupId: 'planning', role: '主策划' }],
  },
  {
    id: 'chuan-chuan',
    name: '等川川喝凉白开的yy',
    role: '副策划',
    bilibili: 'https://space.bilibili.com/334365710',
    avatar: '/images/avatars/90188f812bd51fca5657519c679f0336.webp',
    credits: [{ groupId: 'planning', role: '副策划' }],
  },
  {
    id: 'yu-xiaoling',
    name: '羽小泠Yu_xlinas',
    role: '副策划',
    bilibili: 'https://space.bilibili.com/476684431',
    avatar: '/images/avatars/a900949fad22bd8ea1aa3b604f713b3f_720.webp',
    credits: [{ groupId: 'planning', role: '副策划' }],
  },
  {
    id: 'yindiebei',
    name: '引蝶杯',
    role: '官号',
    bilibili: 'https://space.bilibili.com/1841365629',
    avatar: '/images/avatars/e82b36ae263cbb7d586fd0bd1e0b94c2.webp',
    credits: [{ groupId: 'planning', role: '官方账号' }],
  },
  // 制作人员（素材来源：网站素材/制作人员；素材未提供职责，故不填 role）
  {
    id: 'staff-junmou',
    name: '充满决心的俊某',
    bilibili: 'https://space.bilibili.com/2051363310',
    avatar: '/images/avatars/8cb295163bc99a9b74515c8bbd466217.webp',
    credits: [{ groupId: 'production' }],
  },
  {
    id: 'staff-aaa',
    name: 'AAA往生堂会员专线客服',
    bilibili: 'https://space.bilibili.com/1895051701',
    avatar: '/images/avatars/a053ed59ce19730cb207dcda4c80090d.webp',
    credits: [{ groupId: 'production' }],
  },
  {
    id: 'staff-hongyu-lum',
    name: '红屿_Lum',
    bilibili: 'https://b23.tv/s6cd8LY',
    avatar: '/images/avatars/0443c8528c8a1800bf11f84d33f5f019.webp',
    credits: [{ groupId: 'production' }],
  },
  {
    id: 'staff-kangkkai',
    name: '慷慨泪沾缨',
    bilibili: 'https://space.bilibili.com/1739089360',
    avatar: '/images/avatars/02004f009e913027fa460a7f1c51605f.webp',
    credits: [{ groupId: 'production' }],
  },
  {
    id: 'staff-lvxingsan',
    name: '旅行伞',
    bilibili: 'https://space.bilibili.com/3493117059664275',
    avatar: '/images/avatars/cb85ae0222eec29722624d3dfeffaabd.webp',
    credits: [{ groupId: 'production' }],
  },
  {
    id: 'staff-tianyun',
    name: '恬云',
    bilibili: 'https://space.bilibili.com/1628000469',
    avatar: '/images/avatars/9df670fa1f99640833be19397ed543ef.webp',
    credits: [{ groupId: 'production' }],
  },
  {
    id: 'staff-futangzhu',
    name: '往生堂de副堂主',
    bilibili: 'https://space.bilibili.com/1161372493',
    avatar: '/images/avatars/5c4d7e958bd8ab5f3f336956822331c7.webp',
    credits: [{ groupId: 'production' }],
  },
  {
    id: 'staff-taozhichu',
    name: '桃の初',
    bilibili: 'https://b23.tv/4dsdmaW',
    avatar: '/images/avatars/fd51b020794849f357791eafbac27f3f.webp',
    credits: [{ groupId: 'production' }],
  },
  {
    id: 'staff-hutaoaiwan',
    name: '胡桃爱玩原神',
    bilibili: 'https://b23.tv/jTj2UUy',
    avatar: '/images/avatars/7b888c29809caa7bdabf676122496c1c.webp',
    credits: [{ groupId: 'production' }],
  },
  // 后勤人员
  {
    id: 'staff-yuhengxingzhi',
    name: '玉衡星织',
    bilibili: 'https://space.bilibili.com/3493106890574497',
    avatar: '/images/avatars/06c67bfb3ef6c631530e475e29010a20.webp',
    credits: [{ groupId: 'logistics' }],
  },
]

export const staffGroups = [
  {
    id: 'planning',
    title: '策划统筹',
  },
  {
    id: 'production',
    title: '制作人员',
  },
  {
    id: 'logistics',
    title: '后勤人员',
  },
]

export const groupedMembers = staffGroups.map((group) => ({
  ...group,
  members: members.flatMap((member) =>
    member.credits
      .filter((credit) => credit.groupId === group.id)
      .map((credit) => ({ member, role: credit.role }))
  ),
}))
