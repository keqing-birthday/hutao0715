import TalismanCard from '../components/ui/TalismanCard'

const members = [
  { name: '化名一', role: '主催 / 策划', bio: '统筹生日会整体进度，梦想是让胡桃被全世界看见。' },
  { name: '化名二', role: '美术负责人', bio: '负责视觉风格把控，让梅花与火焰在画面中起舞。' },
  { name: '化名三', role: '文案 / 写手', bio: '执笔角色台词与活动策划，擅长古灵精怪的叙事。' },
  { name: '化名四', role: '技术 / 网站', bio: '搭建本网站，让祝福与作品有一个温暖的家。' },
]

export default function About() {
  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="divider-gradient mb-8" />
          <h2 className="text-title text-3xl md:text-4xl text-paper mb-4">
            关于我们
          </h2>
          <p className="text-paper-dim max-w-2xl mx-auto">
            我们是一群热爱胡桃的创作者，因同一份热爱而相聚，为堂主献上最诚挚的生日礼物。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {members.map((member) => (
            <TalismanCard key={member.name}>
              <div className="flex flex-col items-center text-center">
                {/* 头像占位 */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-plum/20 to-earth/20 flex items-center justify-center mb-4 border-2 border-plum/25">
                  <span className="text-2xl">🎩</span>
                </div>
                <h3 className="text-title text-lg text-paper mb-1">{member.name}</h3>
                <p className="text-plum text-sm mb-3">{member.role}</p>
                <p className="text-paper-dim text-sm leading-relaxed">{member.bio}</p>
              </div>
            </TalismanCard>
          ))}
        </div>

        {/* 彼岸花装饰文字 */}
        <div className="text-center">
          <p className="text-decorative text-2xl md:text-3xl text-plum/30 tracking-widest">
            彼岸花開，生死兩隔
          </p>
        </div>
      </div>
    </section>
  )
}
