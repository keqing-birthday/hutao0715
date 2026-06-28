import { members } from '../data/members'
import TalismanCard from '../components/ui/TalismanCard'

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
          {members.map((member) => {
            const cardBody = (
              <TalismanCard className="h-full transition-transform duration-300 hover:-translate-y-1">
                <div className="flex flex-col items-center text-center">
                  {/* 头像 */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-plum/20 to-earth/20 flex items-center justify-center mb-4 border-2 border-plum/25 overflow-hidden">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">🎩</span>
                    )}
                  </div>
                  <h3 className="text-title text-lg text-paper mb-1">{member.name}</h3>
                  <p className="text-plum text-sm">{member.role}</p>
                </div>
              </TalismanCard>
            )

            return member.bilibili ? (
              <a
                key={member.name}
                href={member.bilibili}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-plum rounded-xl"
              >
                {cardBody}
              </a>
            ) : (
              <div key={member.name} className="h-full">
                {cardBody}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
