export const siteMetadata = {
  verifiedOn: '2026-08-25',
  // This is a patch review, not a new verification date for every old guide.
  patchReviewedOn: '2026-11-04',
  patchBaseline: '2026-10-14',
  // Names and text from the game's zh-CN files; not a playtest.
  gameTextVerifiedOn: '2026-11-07',
  gameBuild: '25921972',
  latestDlc: {
    id: 'hc', nameZh: '万象归衡', inGameNameZh: '神圣观念', nameEn: 'Hallowed Concepts',
    releasedOn: '2026-10-08', status: 'untested',
    notice: '万象归衡（游戏内名称：神圣观念）两名新角色攻略已上线：译名、文本和图标已核对，构筑尚未实测，详情页会明确标注。已补充旧角色的十月更新提示。',
  },
  dlcScope: [
    { id: 'base', nameZh: '本体', nameEn: 'Base' },
    { id: 'sotv', nameZh: '虚空幸存者', nameEn: 'Survivors of the Void', abbreviation: 'SOTV' },
    { id: 'sots', nameZh: '风暴探寻者', nameEn: 'Seekers of the Storm', abbreviation: 'SOTS' },
    { id: 'ac', nameZh: '合金意念', nameEn: 'Alloyed Collective', abbreviation: 'AC' },
    { id: 'hc', nameZh: '万象归衡', nameEn: 'Hallowed Concepts', abbreviation: 'HC' },
  ],
} as const
