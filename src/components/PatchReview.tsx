import { newSkillResearch, patchFactsBySurvivor, sharedPatchFacts } from '../content/patchReview'
import { siteMetadata } from '../content/siteMetadata'
import { sources } from '../content/sources'
import { assetUrl } from '../domain/assets'

const slotNames = { primary: '主技能', secondary: '副技能', utility: '辅助技能', special: '特殊技能', passive: '被动技能' }

export function PatchReview({ slug, verifiedOn }: { slug: string; verifiedOn: string }) {
  const skill = newSkillResearch.find((entry) => entry.survivorSlug === slug)
  const facts = [...(patchFactsBySurvivor[slug] ?? []), ...sharedPatchFacts]
  const official = sources.find((entry) => entry.id === 'official-hc-release')!
  return (
    <section className="guide-usage" aria-labelledby="patch-review-title">
      <h2 id="patch-review-title">十月更新说明</h2>
      <div className="guide-usage__notes">
        <p>原构筑核对：<time dateTime={verifiedOn}>{verifiedOn}</time>；补丁核对：<time dateTime={siteMetadata.patchReviewedOn}>{siteMetadata.patchReviewedOn}</time>。下方旧配置尚未完成新版本全面实测。</p>
        <ul>{facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
        {skill && <p><img className="patch-skill-icon" src={assetUrl(skill.icon)} alt={`${skill.nameZh}技能图标`} loading="lazy" />免费更新新增需要解锁的{slotNames[skill.slot]}<strong>“{skill.nameZh}”</strong>（解锁条件：{skill.unlock}）。<strong>候选方案：</strong>{skill.assessment} 最终推荐仍待实测，原配置暂时保留。</p>}
        <a href={official.url} target="_blank" rel="noreferrer">官方十月更新说明</a>
      </div>
    </section>
  )
}
