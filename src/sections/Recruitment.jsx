import { Paintbrush, Video, PenTool, Wrench } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Tag from '../components/ui/Tag'

const roles = [
  {
    icon: Paintbrush,
    title: '画师',
    desc: '为生日会绘制插画、宣传图、周边设计等视觉作品。',
    tags: ['插画', '立绘', 'Q版'],
  },
  {
    icon: Video,
    title: 'MMD / 视频',
    desc: '制作角色 MMD、手书、庆生视频等动态作品。',
    tags: ['MMD', '手书', '剪辑'],
  },
  {
    icon: PenTool,
    title: '写手',
    desc: '撰写同人文、文案、策划案、角色台词等内容。',
    tags: ['同人文', '文案', '策划'],
  },
  {
    icon: Wrench,
    title: '后勤',
    desc: '负责协调、宣发、资料整理、活动组织等幕后工作。',
    tags: ['宣发', '统筹', '翻译'],
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
            生日会的筹备需要各路英才，无论你是画师、视频作者还是文案策划，都欢迎加入。
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

        <div className="text-center">
          <Button variant="secondary">查看全部招募</Button>
        </div>
      </div>
    </section>
  )
}
