import { Fragment } from 'react'
import { siteMetadata } from '../content/siteMetadata'
import { sources } from '../content/sources'

const footerSourceConfig = [
  { id: 'steam-base', label: '官方本体页面' },
  { id: 'steam-alloyed-collective', label: 'Alloyed Collective 官方页面' },
  { id: 'wiki-survivors', label: '角色资料与图标来源' },
  { id: 'wiki-items', label: '物品资料与图标来源' },
  { id: 'github-asset-manifest', label: '完整图标来源清单' },
  { id: 'wiki-copyrights', label: 'Wiki 权利与许可说明' },
] as const

const footerSources = footerSourceConfig.map(({ id, label }) => {
  const source = sources.find((candidate) => candidate.id === id)
  if (!source) throw new Error(`页脚资料来源不存在：${id}`)

  return { ...source, displayLabel: label }
})

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <section className="site-footer__summary">
          <h2>资料与说明</h2>
          <p>
            这是公开的非官方粉丝攻略，与《雨中冒险 2》的开发商、发行商及平台方没有隶属、赞助或认可关系。
          </p>
          <dl className="site-footer__facts">
            <div>
              <dt>最后核对</dt>
              <dd>
                <time dateTime={siteMetadata.verifiedOn}>{siteMetadata.verifiedOn}</time>
              </dd>
            </div>
            <div>
              <dt>适用内容</dt>
              <dd>
                {siteMetadata.dlcScope.map((dlc, index) => (
                  <Fragment key={dlc.id}>
                    {index > 0 ? '、' : null}
                    {dlc.nameZh}（<span lang="en">{dlc.nameEn}</span>
                    {'abbreviation' in dlc ? `，${dlc.abbreviation}` : null}）
                  </Fragment>
                ))}
              </dd>
            </div>
          </dl>
          <p className="site-footer__attribution">
            角色、技能和物品图标取自 Risk of Rain 2 Wiki 的对应文件页。游戏名称与图像的权利及许可归各权利方，本站不对这些素材作再授权。
          </p>
        </section>

        <section className="site-footer__sources">
          <h3>主要资料来源</h3>
          <p>构筑结论参考官方商店、更新公告与 Wiki 机制资料；版本变化后应重新核对。</p>
          <ul>
            {footerSources.map((source) => (
              <li key={source.id}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  <span>{source.displayLabel}</span>
                  <span className="site-footer__external-note">新标签页 ↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </footer>
  )
}
