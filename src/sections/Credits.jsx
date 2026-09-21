import Tag from '../components/ui/Tag'
import MemberCard from '../components/MemberCard'
import { groupedMembers } from '../data/members'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function Credits() {
  const containerRef = useScrollAnimation()

  return (
    <section id="credits" ref={containerRef} className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 animate-on-scroll">
          <div className="mb-4 flex justify-center">
            <Tag className="text-base px-4 py-1.5">✦ 制作人员</Tag>
          </div>
          <h2 className="text-title text-3xl md:text-4xl text-paper mb-4">引蝶共作</h2>
          <p className="text-paper-dim max-w-2xl mx-auto">
            感谢每一位为这场生日庆典投注热爱与心意的创作者。
          </p>
        </div>

        <div className="space-y-14">
          {groupedMembers.map((group, groupIndex) => (
            <div key={group.id} className={`animate-on-scroll scroll-stagger-${Math.min(groupIndex + 1, 8)}`}>
              <div className="mb-6 flex flex-col gap-2 border-l-2 border-plum/70 pl-4 sm:flex-row sm:items-end sm:justify-between">
                <h3 className="text-title text-2xl text-paper">{group.title}</h3>
                {group.description && (
                  <p className="text-sm text-paper-dim">{group.description}</p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {group.members.map(({ member, role }) => (
                  <MemberCard key={`${group.id}-${member.id}-${role}`} member={member} role={role} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
