import { Music, Film, Palette, PenTool, Drama, Mic, Sparkles } from 'lucide-react'
import Card from '../components/ui/Card'
import Tag from '../components/ui/Tag'

const roles = [
  {
    icon: Music,
    title: '音乐类',
    desc: '负责生日会原创或改编曲目，包括作曲、编曲、乐器实录与混音。',
    tags: ['编曲', '乐器', '混音'],
  },
  {
    icon: Film,
    title: '后期类',
    desc: '完成视频剪辑、PV 制作、MMD 渲染等后期合成工作。',
    tags: ['剪辑', 'PV', 'MMD'],
  },
  {
    icon: Palette,
    title: '美术类',
    desc: '绘制同人图、手书分镜、动画分镜及视觉美术素材。',
    tags: ['手书', '同人图', '动画分镜'],
  },
  {
    icon: PenTool,
    title: '文案类',
    desc: '撰写同人文、歌词填词、剧情脚本与角色台词等内容。',
    tags: ['同人文', '填词', '剧情'],
  },
  {
    icon: Drama,
    title: '扮演类',
    desc: '出演真人小剧场、剧情演绎等需要出镜或配音表演的节目。',
    tags: ['真人小剧场', '剧情演绎'],
  },
  {
    icon: Mic,
    title: '播音类',
    desc: '为节目配音、担任主持或旁白，把控现场节奏与氛围。',
    tags: ['配音', '主持'],
  },
  {
    icon: Sparkles,
    title: '其他',
    desc: '任何好玩又有创意的形式，鬼畜、整活、彩蛋等统统欢迎。',
    tags: ['鬼畜', '整活'],
  },
]

export default function Recruitment() {
  return (
    <section id="recruitment" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="divider-gradient mb-8" />
          <h2 className="text-title text-3xl md:text-4xl text-paper mb-4">
            📋 招募大厅
          </h2>
          <p className="text-paper-dim max-w-2xl mx-auto">
            生日会的筹备需要各路英才，音乐、后期、美术、文案、扮演、播音……只要你想来，总有一个位置适合你。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {roles.map((role) => {
            const Icon = role.icon
            return (
              <Card key={role.title} className="flex flex-col">
                <div className="w-12 h-12 rounded-full bg-plum/10 flex items-center justify-center mb-4">
                  <Icon className="text-plum" size={24} />
                </div>
                <h3 className="text-title text-xl text-paper mb-2">{role.title}</h3>
                <p className="text-paper-dim text-sm mb-4 flex-1">{role.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {role.tags.map((tag) => (
                    <Tag key={tag} className="text-xs">{tag}</Tag>
                  ))}
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
