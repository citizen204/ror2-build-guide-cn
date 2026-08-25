import { useId } from 'react'
import { items } from '../content/items'
import { assetUrl } from '../domain/assets'
import type {
  ItemDefinition,
  ItemPick,
  ItemTier,
  Recommendation,
} from '../domain/guide'

interface ItemGroupProps {
  title: string
  picks: ItemPick[]
  emptyMessage?: string
}

const itemById = new Map(items.map((item) => [item.id, item]))

const rarityLabels: Record<ItemTier, string> = {
  common: '普通',
  uncommon: '罕见',
  legendary: '传奇',
  boss: '首领',
  equipment: '主动装备',
  lunar: '月球',
  'lunar-equipment': '月球主动装备',
  void: '虚空',
}

const recommendationLabels: Record<Recommendation, string> = {
  core: '核心',
  recommended: '推荐',
  conditional: '条件',
  avoid: '避免',
}

function resolveItem(itemId: string): ItemDefinition | undefined {
  const item = itemById.get(itemId)
  if (!item && import.meta.env.DEV) {
    throw new Error(`未知物品：${itemId}`)
  }
  return item
}

function ItemName({ item }: { item: ItemDefinition }) {
  return (
    <span className="item-row__name">
      <strong>{item.nameZh}</strong>
    </span>
  )
}

export function ItemGroup({ title, picks, emptyMessage }: ItemGroupProps) {
  const headingId = `item-group-${useId().replace(/:/g, '')}`

  return (
    <section className="item-group" aria-labelledby={headingId}>
      <h3 id={headingId}>{title}</h3>
      {picks.length === 0 ? (
        <p className="item-group__empty">{emptyMessage ?? '本组暂无推荐。'}</p>
      ) : (
        <ul className="item-list">
          {picks.map((pick) => {
            const item = resolveItem(pick.itemId)
            if (!item) {
              return (
                <li className="item-row item-row--missing" key={pick.itemId}>
                  <p>未知物品：{pick.itemId}</p>
                </li>
              )
            }

            const originalItem = item.corrupts ? resolveItem(item.corrupts) : undefined

            return (
              <li className={`item-row item-row--${item.tier}`} key={pick.itemId}>
                <img
                  className="item-row__icon"
                  src={assetUrl(item.icon)}
                  alt={`${item.nameZh}物品图标`}
                  loading="lazy"
                />
                <div className="item-row__content">
                  <div className="item-row__identity">
                    <ItemName item={item} />
                    <span className={`item-tag item-tag--rarity-${item.tier}`}>
                      {rarityLabels[item.tier]}
                    </span>
                    <span className={`item-tag item-tag--recommendation-${pick.recommendation}`}>
                      {recommendationLabels[pick.recommendation]}
                    </span>
                  </div>
                  <dl className="item-row__details">
                    <div>
                      <dt>建议数量</dt>
                      <dd>{pick.stacks}</dd>
                    </div>
                    <div>
                      <dt>作用</dt>
                      <dd>{pick.role}</dd>
                    </div>
                    <div>
                      <dt>联动</dt>
                      <dd>{pick.synergy}</dd>
                    </div>
                    {originalItem ? (
                      <div>
                        <dt>腐化原物品</dt>
                        <dd className="item-row__original">
                          <span>{originalItem.nameZh}</span>
                        </dd>
                      </div>
                    ) : null}
                    {pick.alternative ? (
                      <div>
                        <dt>替代选择</dt>
                        <dd>{pick.alternative}</dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
