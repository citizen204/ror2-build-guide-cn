import type { DlcId, SurvivorGuide } from './guide'

export type DlcFilter = DlcId | 'all'

export function normalize(value: string): string {
  return value.normalize('NFKC').toLocaleLowerCase('zh-CN').trim()
}

export function filterSurvivors<
  T extends Pick<SurvivorGuide, 'nameZh' | 'nameEn' | 'slug' | 'dlc'>,
>(survivors: T[], query: string, dlc: DlcFilter): T[] {
  const normalizedQuery = normalize(query)

  return survivors.filter((survivor) => {
    const matchesDlc = dlc === 'all' || survivor.dlc === dlc
    const matchesQuery = normalizedQuery === '' || [
      survivor.nameZh,
      survivor.nameEn,
      survivor.slug,
    ].some((value) => normalize(value).includes(normalizedQuery))

    return matchesDlc && matchesQuery
  })
}
