import { assetUrl } from '../domain/assets'
import type { AlternativeSkill, TransformationSkill } from '../domain/guide'

const slotLabels: Record<AlternativeSkill['slot'], string> = {
  passive: '被动',
  primary: '主技能',
  secondary: '副技能',
  utility: '位移技能',
  special: '特殊技能',
  litany: '诵祷',
}

export function AlternativeSkills({ skills }: { skills: AlternativeSkill[] }) {
  return (
    <ul className="skill-loadout" aria-label="备选技能配置">
      {skills.map((skill) => (
        <li className="skill-row" key={skill.nameEn}>
          <img className="skill-row__icon" src={assetUrl(skill.icon)} alt={`${skill.nameZh}技能图标`} loading="lazy" />
          <div className="skill-row__content">
            <div className="skill-row__meta">
              <span className="skill-row__slot">{slotLabels[skill.slot]}</span>
              <span className={`skill-row__unlock skill-row__unlock--${skill.unlockCondition ? 'unlock-required' : 'default'}`}>
                {skill.unlockCondition ? '需要解锁' : '无需解锁'}
              </span>
            </div>
            <p className="skill-row__name"><strong>{skill.nameZh}</strong></p>
            {skill.unlockCondition ? <p className="skill-row__reason">解锁挑战：{skill.unlockCondition}</p> : null}
            <p className="skill-row__reason">{skill.assessment}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function TransformationSkills({ skills }: { skills: TransformationSkill[] }) {
  return (
    <section className="item-group" aria-labelledby="transformation-skills-title">
      <h3 id="transformation-skills-title">灵魂收割者技能</h3>
      <ul className="skill-loadout" aria-label="化身技能">
        {skills.map((skill) => (
          <li className="skill-row" key={skill.nameEn}>
            <img className="skill-row__icon" src={assetUrl(skill.icon)} alt={`${skill.nameZh}技能图标`} loading="lazy" />
            <div className="skill-row__content">
              <div className="skill-row__meta">
                <span className="skill-row__slot">{slotLabels[skill.slot]}</span>
              </div>
              <p className="skill-row__name"><strong>{skill.nameZh}</strong></p>
              <p className="skill-row__reason">{skill.facts}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
