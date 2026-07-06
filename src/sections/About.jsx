import { useEffect } from 'react'
import { members } from '../data/members'
import MemberCard from '../components/MemberCard'

export default function About() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )

    const elements = document.querySelectorAll('#about .animate-on-scroll')
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-on-scroll">
          <div className="divider-gradient mb-8" />
          <h2 className="text-title text-3xl md:text-4xl text-paper mb-4">
            关于我们
          </h2>
          <p className="text-paper-dim max-w-2xl mx-auto">
            我们是一群热爱胡桃的创作者，因同一份热爱而相聚，为堂主献上最诚挚的生日礼物。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {members.map((member, i) => (
            <div key={member.name} className={`animate-on-scroll scroll-stagger-${Math.min(i + 1, 8)}`}>
              <MemberCard member={member} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
