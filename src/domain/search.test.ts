import { describe, expect, test } from 'vitest'
import type { DlcId } from './guide'
import { filterSurvivors } from './search'

type SearchableSurvivor = {
  slug: string
  nameZh: string
  nameEn: string
  dlc: DlcId
  marker: number
}

const survivors: SearchableSurvivor[] = [
  { slug: 'commando', nameZh: '突击队员', nameEn: 'Commando', dlc: 'base', marker: 1 },
  { slug: 'acrid', nameZh: '毒师', nameEn: 'Acrid', dlc: 'base', marker: 2 },
  { slug: 'void-fiend', nameZh: '虚空恶鬼', nameEn: 'Void Fiend', dlc: 'sotv', marker: 3 },
  { slug: 'railgunner', nameZh: '轨道炮手', nameEn: 'Railgunner', dlc: 'sotv', marker: 4 },
  { slug: 'heretic', nameZh: '异端', nameEn: 'Heretic', dlc: 'special', marker: 5 },
]

describe('filterSurvivors', () => {
  test('matches Chinese survivor names', () => {
    expect(filterSurvivors(survivors, '毒师', 'all').map(({ slug }) => slug)).toEqual(['acrid'])
  })

  test('matches English survivor names without case sensitivity', () => {
    expect(filterSurvivors(survivors, 'VOID', 'all').map(({ slug }) => slug)).toEqual(['void-fiend'])
  })

  test('matches survivor slugs', () => {
    expect(filterSurvivors(survivors, 'gunner', 'all').map(({ slug }) => slug)).toEqual(['railgunner'])
  })

  test('treats empty and whitespace-only queries as no search constraint', () => {
    expect(filterSurvivors(survivors, '', 'all')).toEqual(survivors)
    expect(filterSurvivors(survivors, '   ', 'all')).toEqual(survivors)
  })

  test('filters by DLC while preserving the original order and properties', () => {
    expect(filterSurvivors(survivors, '', 'sotv')).toEqual([
      survivors[2],
      survivors[3],
    ])
  })

  test('requires query and DLC filters to both match', () => {
    expect(filterSurvivors(survivors, 'acrid', 'sotv')).toEqual([])
  })

  test('normalizes full-width Unicode and trims surrounding whitespace', () => {
    expect(filterSurvivors(survivors, '  ＶＯＩＤ　ＦＩＥＮＤ  ', 'all').map(({ slug }) => slug)).toEqual(['void-fiend'])
  })

  test('does not mutate the input array', () => {
    const original = [...survivors]

    filterSurvivors(survivors, 'void', 'sotv')

    expect(survivors).toEqual(original)
    expect(survivors).not.toBe(original)
  })

  test('can filter the special Heretic guide', () => {
    expect(filterSurvivors(survivors, '异端', 'special').map(({ slug }) => slug)).toEqual(['heretic'])
  })
})
