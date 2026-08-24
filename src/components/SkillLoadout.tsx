import { assetUrl } from '../domain/assets'
import type { SkillChoice, SkillSlot, SkillUnlock } from '../domain/guide'

interface SkillLoadoutProps {
  skills: SkillChoice[]
}

const slotLabels: Record<SkillSlot, string> = {
  passive: '被动',
  primary: '主技能',
  secondary: '副技能',
  utility: '位移技能',
  special: '特殊技能',
}

const unlockLabels: Record<SkillUnlock, string> = {
  default: '默认拥有',
  'unlock-required': '需要解锁',
  transformation: '特殊变身组件',
}

export function SkillLoadout({ skills }: SkillLoadoutProps) {
  return (
    <ul className="skill-loadout" aria-label="推荐技能配置">
      {skills.map((skill, index) => (
        <li className="skill-row" key={`${skill.slot}-${skill.nameEn}-${index}`}>
          <img
            className="skill-row__icon"
            src={assetUrl(skill.icon)}
            alt={`${skill.nameZh}（${skill.nameEn}）技能图标`}
            loading="lazy"
          />
          <div className="skill-row__content">
            <div className="skill-row__meta">
              <span className="skill-row__slot">{slotLabels[skill.slot]}</span>
              <span className={`skill-row__unlock skill-row__unlock--${skill.unlock}`}>
                {unlockLabels[skill.unlock]}
              </span>
            </div>
            <p className="skill-row__name">
              <strong>{skill.nameZh}</strong>
              <span lang="en">{skill.nameEn}</span>
            </p>
            <p className="skill-row__reason">{skill.reason}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
