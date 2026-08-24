import type { DlcFilter } from '../domain/search'

interface SearchFiltersProps {
  query: string
  dlc: DlcFilter
  onQueryChange: (query: string) => void
  onDlcChange: (dlc: DlcFilter) => void
  onReset: () => void
}

const dlcOptions: { value: DlcFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'base', label: '本体' },
  { value: 'sotv', label: 'SOTV' },
  { value: 'sots', label: 'SOTS' },
  { value: 'ac', label: 'AC' },
  { value: 'special', label: '特殊' },
]

export function SearchFilters({
  query,
  dlc,
  onQueryChange,
  onDlcChange,
  onReset,
}: SearchFiltersProps) {
  const isActive = query !== '' || dlc !== 'all'
  const resetLabel = query !== '' && dlc === 'all'
    ? '清空搜索'
    : query !== ''
      ? '重置搜索和筛选'
      : '重置筛选'

  return (
    <section className="search-filters" aria-label="角色搜索与筛选">
      <label className="search-filters__search">
        <span>搜索角色</span>
        <input
          type="search"
          placeholder="输入中文名、英文名或角色 ID"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>
      <fieldset className="search-filters__group">
        <legend>按 DLC 筛选</legend>
        <div className="search-filters__options">
          {dlcOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={dlc === option.value}
              onClick={() => onDlcChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>
      {isActive ? (
        <button className="search-filters__reset" type="button" onClick={onReset}>
          {resetLabel}
        </button>
      ) : null}
    </section>
  )
}
