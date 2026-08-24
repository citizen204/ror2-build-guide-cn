import { siteMetadata } from './siteMetadata'

const contentVerifiedOn = siteMetadata.verifiedOn

export interface SourceRecord {
  id: string
  label: string
  url: string
  verifiedOn: string
}

/** Direct evidence used by the research notes and publishable survivor guides. */
export const sources: SourceRecord[] = [
  {
    id: 'steam-base',
    label: 'Steam — Risk of Rain 2 base game',
    url: 'https://store.steampowered.com/app/632360/Risk_of_Rain_2/',
    verifiedOn: contentVerifiedOn,
  },
  {
    id: 'steam-alloyed-collective',
    label: 'Steam — Risk of Rain 2: Alloyed Collective',
    url: 'https://store.steampowered.com/app/2781620/Risk_of_Rain_2_Alloyed_Collective/',
    verifiedOn: contentVerifiedOn,
  },
  {
    id: 'steam-hallowed-concepts',
    label: 'Steam — Risk of Rain 2: Hallowed Concepts (unreleased)',
    url: 'https://store.steampowered.com/app/3055670/Risk_of_Rain_2_Hallowed_Concepts/',
    verifiedOn: contentVerifiedOn,
  },
  {
    id: 'official-ac-release-notes',
    label: 'Official Steam announcement — Alloyed Collective is Available Now',
    url: 'https://steamcommunity.com/ogg/632360/announcements/detail/534364965583192573',
    verifiedOn: contentVerifiedOn,
  },
  {
    id: 'official-ac-patch-1-4-1',
    label: 'Official Steam announcement — Alloyed Collective Patch 1.4.1',
    url: 'https://steamcommunity.com/ogg/632360/announcements/detail/497214077375874960',
    verifiedOn: contentVerifiedOn,
  },
  {
    id: 'official-operator-diary',
    label: 'Official Steam announcement — Dev Diary #3: Operator',
    url: 'https://steamcommunity.com/ogg/632360/announcements/detail/524227425953907077',
    verifiedOn: contentVerifiedOn,
  },
  {
    id: 'official-drifter-diary',
    label: 'Official Steam announcement — Dev Diary #4: Drifter and release details',
    url: 'https://steamcommunity.com/ogg/632360/announcements/detail/510718530665056699',
    verifiedOn: contentVerifiedOn,
  },
  {
    id: 'wiki-survivors',
    label: 'Risk of Rain 2 Wiki — Survivors',
    url: 'https://riskofrain2.wiki.gg/wiki/Survivors',
    verifiedOn: contentVerifiedOn,
  },
  {
    id: 'wiki-items',
    label: 'Risk of Rain 2 Wiki — Items',
    url: 'https://riskofrain2.wiki.gg/wiki/Items',
    verifiedOn: contentVerifiedOn,
  },
  {
    id: 'github-asset-manifest',
    label: 'GitHub asset source manifest',
    url: 'https://github.com/citizen204/ror2-build-guide-cn/blob/main/src/content/assets.json',
    verifiedOn: contentVerifiedOn,
  },
  {
    id: 'wiki-copyrights',
    label: 'Risk of Rain 2 Wiki copyrights and licensing',
    url: 'https://riskofrain2.wiki.gg/wiki/Risk_of_Rain_2_Wiki:Copyrights',
    verifiedOn: contentVerifiedOn,
  },
  {
    id: 'wiki-equipment',
    label: 'Risk of Rain 2 Wiki — Equipment',
    url: 'https://riskofrain2.wiki.gg/wiki/Equipment',
    verifiedOn: contentVerifiedOn,
  },
  {
    id: 'wiki-proc-coefficient',
    label: 'Risk of Rain 2 Wiki — Proc Coefficient',
    url: 'https://riskofrain2.wiki.gg/wiki/Proc_Coefficient',
    verifiedOn: contentVerifiedOn,
  },
  {
    id: 'wiki-void-items',
    label: 'Risk of Rain 2 Wiki — Item corruption and Void items',
    url: 'https://riskofrain2.wiki.gg/wiki/Items#Void_Items',
    verifiedOn: contentVerifiedOn,
  },
  {
    id: 'wiki-drones',
    label: 'Risk of Rain 2 Wiki — Drones',
    url: 'https://riskofrain2.wiki.gg/wiki/Drones',
    verifiedOn: contentVerifiedOn,
  },
  {
    id: 'wiki-mithrix-item-steal',
    label: 'Risk of Rain 2 Wiki — Mithrix phase-four item stealing',
    url: 'https://riskofrain2.wiki.gg/wiki/Mithrix#Phase_4',
    verifiedOn: contentVerifiedOn,
  },
  {
    id: 'wiki-cannot-steal-items',
    label: 'Risk of Rain 2 Wiki — CannotSteal items',
    url: 'https://riskofrain2.wiki.gg/wiki/Category:CannotSteal_Items',
    verifiedOn: contentVerifiedOn,
  },
  {
    id: 'wiki-drone-combiner',
    label: 'Risk of Rain 2 Wiki — Drone Combiner Station',
    url: 'https://riskofrain2.wiki.gg/wiki/Drone_Combiner_Station',
    verifiedOn: contentVerifiedOn,
  },
  ...[
    ['commando', 'Commando'],
    ['huntress', 'Huntress'],
    ['bandit', 'Bandit'],
    ['mul-t', 'MUL-T'],
    ['engineer', 'Engineer'],
    ['artificer', 'Artificer'],
    ['mercenary', 'Mercenary'],
    ['rex', 'REX'],
    ['loader', 'Loader'],
    ['acrid', 'Acrid'],
    ['captain', 'Captain'],
    ['railgunner', 'Railgunner'],
    ['void-fiend', 'Void_Fiend'],
    ['seeker', 'Seeker'],
    ['chef', 'CHEF'],
    ['false-son', 'False_Son'],
    ['operator', 'Operator'],
    ['drifter', 'Drifter'],
    ['heretic', 'Heretic'],
  ].map(([id, page]) => ({
    id: `wiki-${id}`,
    label: `Risk of Rain 2 Wiki — ${page.replaceAll('_', ' ')}`,
    url: `https://riskofrain2.wiki.gg/wiki/${page}`,
    verifiedOn: contentVerifiedOn,
  })),
  {
    id: 'wiki-chef-skills',
    label: 'Risk of Rain 2 Wiki — CHEF skill data (Ice Box, not “Freezer”)',
    url: 'https://riskofrain2.wiki.gg/wiki/CHEF#Skills',
    verifiedOn: contentVerifiedOn,
  },
  {
    id: 'wiki-operator-admin-override',
    label: 'Risk of Rain 2 Wiki — ADMIN-OVERRIDE drone commands',
    url: 'https://riskofrain2.wiki.gg/wiki/ADMIN-OVERRIDE',
    verifiedOn: contentVerifiedOn,
  },
  {
    id: 'wiki-drifter-tinker',
    label: 'Risk of Rain 2 Wiki — Drifter Tinker mechanics',
    url: 'https://riskofrain2.wiki.gg/wiki/Drifter#Tinker',
    verifiedOn: contentVerifiedOn,
  },
  {
    id: 'wiki-void-fiend-corruption',
    label: 'Risk of Rain 2 Wiki — Void Fiend corruption mechanics',
    url: 'https://riskofrain2.wiki.gg/wiki/Void_Fiend#Void_Corruption',
    verifiedOn: contentVerifiedOn,
  },
  {
    id: 'wiki-acrid-poison',
    label: 'Risk of Rain 2 Wiki — Poison versus Blight',
    url: 'https://riskofrain2.wiki.gg/wiki/Acrid#Poison',
    verifiedOn: contentVerifiedOn,
  },
  {
    id: 'wiki-engineer-turrets',
    label: 'Risk of Rain 2 Wiki — Engineer turret item inheritance',
    url: 'https://riskofrain2.wiki.gg/wiki/Engineer#TR12_Gauss_Auto-Turret',
    verifiedOn: contentVerifiedOn,
  },
  {
    id: 'wiki-engineer-thermal-harpoons',
    label: 'Risk of Rain 2 Wiki — Engineer Thermal Harpoons',
    url: 'https://riskofrain2.wiki.gg/wiki/Engineer#Thermal_Harpoons',
    verifiedOn: contentVerifiedOn,
  },
  {
    id: 'wiki-false-son-growth',
    label: 'Risk of Rain 2 Wiki — False Son Growth',
    url: 'https://riskofrain2.wiki.gg/wiki/False_Son#Growth',
    verifiedOn: contentVerifiedOn,
  },
  {
    id: 'wiki-transcendence',
    label: 'Risk of Rain 2 Wiki — Transcendence',
    url: 'https://riskofrain2.wiki.gg/wiki/Transcendence',
    verifiedOn: contentVerifiedOn,
  },
  {
    id: 'wiki-mired-urn',
    label: 'Risk of Rain 2 Wiki — Mired Urn current targeting',
    url: 'https://riskofrain2.wiki.gg/wiki/Mired_Urn',
    verifiedOn: contentVerifiedOn,
  },
  {
    id: 'wiki-bens-raincoat',
    label: "Risk of Rain 2 Wiki — Ben's Raincoat",
    url: 'https://riskofrain2.wiki.gg/wiki/Ben%27s_Raincoat',
    verifiedOn: contentVerifiedOn,
  },
]
