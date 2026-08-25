import { Link } from 'react-router-dom'
import { assetUrl } from '../domain/assets'
import type { DlcId, SurvivorGuide } from '../domain/guide'

interface SurvivorCardProps {
  survivor: SurvivorGuide
}

const dlcLabels: Record<DlcId, string> = {
  base: '本体',
  sotv: '虚空幸存者',
  sots: '风暴探寻者',
  ac: '合金意念',
  special: '特殊变身',
}

export function SurvivorCard({ survivor }: SurvivorCardProps) {
  const difficultyMarks = `${'●'.repeat(survivor.difficulty)}${'○'.repeat(5 - survivor.difficulty)}`

  return (
    <li className="survivor-card">
      <article className="survivor-card__record">
        <Link className="survivor-card__link" to={`/survivors/${survivor.slug}`}>
          <div className="survivor-card__portrait">
            <img
              src={assetUrl(survivor.portrait)}
              alt={`${survivor.nameZh}角色头像`}
              loading="lazy"
            />
          </div>
          <div className="survivor-card__body">
            <div className="survivor-card__heading">
              <h2>{survivor.nameZh}</h2>
              <span className="survivor-card__dlc">{dlcLabels[survivor.dlc]}</span>
            </div>
            <p className="survivor-card__role">{survivor.role}</p>
            <div className="survivor-card__difficulty">
              <span>操作难度：{survivor.difficulty} / 5</span>
              <span aria-hidden="true" className="survivor-card__marks">
                {difficultyMarks}
              </span>
            </div>
          </div>
        </Link>
      </article>
    </li>
  )
}
