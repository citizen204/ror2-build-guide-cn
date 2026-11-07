import { describe, expect, test } from 'vitest'
import { siteMetadata } from './siteMetadata'

describe('public site metadata', () => {
  test('centralizes the verification date and supported DLC scope', () => {
    expect(siteMetadata.verifiedOn).toBe('2026-08-25')
    expect(siteMetadata.dlcScope).toEqual([
      { id: 'base', nameZh: '本体', nameEn: 'Base' },
      { id: 'sotv', nameZh: '虚空幸存者', nameEn: 'Survivors of the Void', abbreviation: 'SOTV' },
      { id: 'sots', nameZh: '风暴探寻者', nameEn: 'Seekers of the Storm', abbreviation: 'SOTS' },
      { id: 'ac', nameZh: '合金意念', nameEn: 'Alloyed Collective', abbreviation: 'AC' },
      { id: 'hc', nameZh: '万象归衡', nameEn: 'Hallowed Concepts', abbreviation: 'HC' },
    ])
  })
})
