import { siteMetadata } from '../content/siteMetadata'

export function UntestedNotice({ verifiedOn }: { verifiedOn: string }) {
  return (
    <section className="guide-usage" aria-labelledby="untested-notice-title">
      <h2 id="untested-notice-title">构筑未实测</h2>
      <div className="guide-usage__notes">
        <p>本攻略<strong>尚未经过游戏实测</strong>，推荐的技能、物品和件数是根据公开资料推导的起步方案，不代表实测最优。</p>
        <p>资料核对：<time dateTime={verifiedOn}>{verifiedOn}</time>。名称与技能描述取自游戏文件（电脑版构建 {siteMetadata.gameBuild}），机制数值来自社区资料，可能与游戏实际表现不同。</p>
      </div>
    </section>
  )
}
