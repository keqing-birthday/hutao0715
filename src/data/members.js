// 成员信息在此集中维护。featured 控制是否显示在“关于我们”的核心成员区。
// credits 可为同一成员记录多个职责，完整制作人员区会据此自动分组。
export const members = [
  {
    id: 'pa-duoduo',
    name: '怕朵朵朵朵朵',
    role: '主策划',
    featured: true,
    bilibili: 'https://space.bilibili.com/203293709',
    avatar: '/images/avatars/1fcef3b283c9c1a358c701d203d2f428.webp',
    credits: [{ groupId: 'planning', role: '主策划' }],
  },
  {
    id: 'chuan-chuan',
    name: '等川川喝凉白开的yy',
    role: '副策划',
    featured: true,
    bilibili: 'https://space.bilibili.com/334365710',
    avatar: '/images/avatars/90188f812bd51fca5657519c679f0336.webp',
    credits: [{ groupId: 'planning', role: '副策划' }],
  },
  {
    id: 'yu-xiaoling',
    name: '羽小泠Yu_xlinas',
    role: '副策划',
    featured: true,
    bilibili: 'https://space.bilibili.com/476684431',
    avatar: '/images/avatars/a900949fad22bd8ea1aa3b604f713b3f_720.webp',
    credits: [{ groupId: 'planning', role: '副策划' }],
  },
  {
    id: 'yindiebei',
    name: '引蝶杯',
    role: '官号',
    featured: true,
    bilibili: 'https://space.bilibili.com/1841365629',
    avatar: '/images/avatars/e82b36ae263cbb7d586fd0bd1e0b94c2.webp',
    credits: [{ groupId: 'official', role: '官方账号' }],
  },
]

export const staffGroups = [
  {
    id: 'planning',
    title: '策划统筹',
    description: '统筹活动方向与筹备进度。',
  },
  {
    id: 'official',
    title: '官方账号',
    description: '负责活动信息发布与对外联络。',
  },
]

export const featuredMembers = members.filter((member) => member.featured)

export const groupedMembers = staffGroups
  .map((group) => ({
    ...group,
    members: members.flatMap((member) =>
      member.credits
        .filter((credit) => credit.groupId === group.id)
        .map((credit) => ({ member, role: credit.role }))
    ),
  }))
  .filter((group) => group.members.length > 0)
