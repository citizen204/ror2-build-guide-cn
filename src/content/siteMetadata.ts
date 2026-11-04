export const siteMetadata = {
  verifiedOn: '2026-08-25',
  // This is a patch review, not a new verification date for every old guide.
  patchReviewedOn: '2026-11-04',
  patchBaseline: '2026-10-14',
  pendingDlc: {
    id: 'hc', nameZh: '万象归衡', nameEn: 'Hallowed Concepts',
    releasedOn: '2026-10-08', status: 'draft',
    notice: '万象归衡已发售：两名新角色攻略正在核对游戏内译名、数值与图标，尚未计入下方完整攻略。已补充旧角色的十月更新提示。',
  },
  dlcScope: [
    { id: 'base', nameZh: '本体', nameEn: 'Base' },
    { id: 'sotv', nameZh: '虚空幸存者', nameEn: 'Survivors of the Void', abbreviation: 'SOTV' },
    { id: 'sots', nameZh: '风暴探寻者', nameEn: 'Seekers of the Storm', abbreviation: 'SOTS' },
    { id: 'ac', nameZh: '合金意念', nameEn: 'Alloyed Collective', abbreviation: 'AC' },
  ],
} as const
