import { useState } from 'react'
import { SearchFilters } from '../components/SearchFilters'
import { SiteHeader } from '../components/SiteHeader'
import { SurvivorCard } from '../components/SurvivorCard'
import { survivors } from '../content/survivors'
import { filterSurvivors, type DlcFilter } from '../domain/search'

export function HomePage() {
  const [query, setQuery] = useState('')
  const [dlc, setDlc] = useState<DlcFilter>('all')
  const filteredSurvivors = filterSurvivors(survivors, query, dlc)

  const resetFilters = () => {
    setQuery('')
    setDlc('all')
  }

  return (
    <main className="page-shell">
      <SiteHeader />
      <SearchFilters
        query={query}
        dlc={dlc}
        onQueryChange={setQuery}
        onDlcChange={setDlc}
        onReset={resetFilters}
      />
      <section className="guide-usage" aria-labelledby="guide-usage-title">
        <h2 id="guide-usage-title">如何使用构筑建议</h2>
        <div className="guide-usage__notes">
          <p><strong>统率神器：</strong>按角色页的前期、中期、后期顺序选装，先建立生存与循环，再补倍率和终局容错。</p>
          <p><strong>普通流程：</strong>不用照抄清单；根据掉落阅读“作用”“联动”和“替代选择”，挑能解决当前短板的物品。</p>
        </div>
      </section>
      <section className="roster" aria-labelledby="roster-title">
        <div className="roster__heading">
          <h2 id="roster-title">角色列表</h2>
          <p role="status" aria-live="polite">
            找到 {filteredSurvivors.length} 名角色
          </p>
        </div>
        {filteredSurvivors.length > 0 ? (
          <ul className="roster__grid" aria-label="角色筛选结果">
            {filteredSurvivors.map((survivor) => (
              <SurvivorCard key={survivor.slug} survivor={survivor} />
            ))}
          </ul>
        ) : (
          <div className="empty-results" aria-labelledby="empty-results-title">
            <h2 id="empty-results-title">没有找到符合条件的角色</h2>
            <p>试试清空搜索，或把扩展内容改为“全部”。</p>
            <button type="button" onClick={resetFilters}>显示全部角色</button>
          </div>
        )}
      </section>
    </main>
  )
}
