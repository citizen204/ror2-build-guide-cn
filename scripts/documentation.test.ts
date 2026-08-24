import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, test } from 'vitest'

const repositoryDirectory = resolve(process.cwd())

describe('maintainer documentation', () => {
  test('documents the canonical guide, item-pick, and validation contracts', async () => {
    const readme = await readFile(resolve(repositoryDirectory, 'README.md'), 'utf8')

    for (const field of [
      'slug', 'skills', 'buildLogic', 'solo', 'coopAdjustments', 'commandRoute',
      'voidItems', 'lunarItems', 'lunarEquipment', 'combatNotes', 'sourceIds',
      'verifiedOn', 'itemId', 'recommendation', 'stacks', 'role', 'synergy',
      'alternative',
    ]) {
      expect(readme, `README schema field ${field}`).toContain(`\`${field}\``)
    }

    expect(readme).toMatch(/`lunarItems`.*被动月球物品/)
    expect(readme).toMatch(/`lunarEquipment`.*月球主动装备/)
    expect(readme).toMatch(/`validateGuideData`.*19.*技能槽位.*统率路线.*tier/)
    expect(readme).toContain('规范顺序由签名测试固定')
  })

  test('uses the official Alloyed Collective Chinese name in roster research', async () => {
    const research = await readFile(
      resolve(repositoryDirectory, 'research/version-and-roster.md'),
      'utf8',
    )

    expect(research).toContain('合金意念')
    expect(research).not.toContain('合金共同体')
  })
})
