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
      <section className="roster" aria-labelledby="roster-title">
        <div className="roster__heading">
          <h2 id="roster-title">角色列表</h2>
          <p role="status" aria-live="polite">
            找到 {filteredSurvivors.length} 名角色
          </p>
        </div>
        {filteredSurvivors.length > 0 ? (
          <div className="roster__grid">
            {filteredSurvivors.map((survivor) => (
              <SurvivorCard key={survivor.slug} survivor={survivor} />
            ))}
          </div>
        ) : (
          <div className="empty-results" aria-labelledby="empty-results-title">
            <h2 id="empty-results-title">没有找到符合条件的角色</h2>
            <p>试试清空搜索，或把 DLC 改为“全部”。</p>
            <button type="button" onClick={resetFilters}>显示全部角色</button>
          </div>
        )}
      </section>
    </main>
  )
}
