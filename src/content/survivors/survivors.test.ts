import { describe, expect, test } from 'vitest'
import { items } from '../items'
import { sources } from '../sources'
import { EXPECTED_SURVIVOR_SLUGS, validateGuideData } from '../../domain/validateGuideData'
import { survivors } from './index'

const REVIEWED_CONTENT_SIGNATURE = `[{"slug":"commando","skills":[{"slot":"primary","nameEn":"Double Tap","unlock":"default"},{"slot":"secondary","nameEn":"Phase Blast","unlock":"unlock-required"},{"slot":"utility","nameEn":"Tactical Slide","unlock":"unlock-required"},{"slot":"special","nameEn":"Suppressive Fire","unlock":"default"}],"items":{"common":[{"itemId":"lens-makers-glasses","recommendation":"core"},{"itemId":"mocha","recommendation":"core"},{"itemId":"tri-tip-dagger","recommendation":"recommended"}],"uncommon":[{"itemId":"atg-missile-mk-1","recommendation":"core"},{"itemId":"ukulele","recommendation":"core"},{"itemId":"hopoo-feather","recommendation":"recommended"}],"legendary":[{"itemId":"57-leaf-clover","recommendation":"core"},{"itemId":"brilliant-behemoth","recommendation":"recommended"}],"boss":[{"itemId":"shatterspleen","recommendation":"core"},{"itemId":"charged-perforator","recommendation":"recommended"}],"equipment":[{"itemId":"royal-capacitor","recommendation":"recommended"},{"itemId":"recycler","recommendation":"conditional"}],"voidItems":[{"itemId":"polylute","recommendation":"recommended"},{"itemId":"safer-spaces","recommendation":"recommended"},{"itemId":"needletick","recommendation":"conditional"},{"itemId":"lost-seers-lenses","recommendation":"avoid"}],"lunarItems":[{"itemId":"gesture-of-the-drowned","recommendation":"recommended"},{"itemId":"transcendence","recommendation":"conditional"},{"itemId":"purity","recommendation":"avoid"}]},"sourceIds":["wiki-commando","wiki-proc-coefficient","wiki-items"]},{"slug":"huntress","skills":[{"slot":"primary","nameEn":"Strafe","unlock":"default"},{"slot":"secondary","nameEn":"Laser Glaive","unlock":"default"},{"slot":"utility","nameEn":"Blink","unlock":"default"},{"slot":"special","nameEn":"Ballista","unlock":"unlock-required"}],"items":{"common":[{"itemId":"energy-drink","recommendation":"core"},{"itemId":"lens-makers-glasses","recommendation":"core"},{"itemId":"backup-magazine","recommendation":"recommended"}],"uncommon":[{"itemId":"kjaro-band","recommendation":"core"},{"itemId":"runald-band","recommendation":"core"},{"itemId":"rose-buckler","recommendation":"recommended"}],"legendary":[{"itemId":"hardlight-afterburner","recommendation":"core"},{"itemId":"laser-scope","recommendation":"recommended"}],"boss":[{"itemId":"little-disciple","recommendation":"core"},{"itemId":"shatterspleen","recommendation":"recommended"}],"equipment":[{"itemId":"royal-capacitor","recommendation":"recommended"},{"itemId":"gorags-opus","recommendation":"conditional"}],"voidItems":[{"itemId":"safer-spaces","recommendation":"recommended"},{"itemId":"polylute","recommendation":"conditional"},{"itemId":"plasma-shrimp","recommendation":"conditional"},{"itemId":"lost-seers-lenses","recommendation":"avoid"}],"lunarItems":[{"itemId":"gesture-of-the-drowned","recommendation":"recommended"},{"itemId":"light-flux-pauldron","recommendation":"conditional"},{"itemId":"brittle-crown","recommendation":"avoid"}]},"sourceIds":["wiki-huntress","wiki-proc-coefficient","wiki-items"]},{"slug":"bandit","skills":[{"slot":"passive","nameEn":"Backstab","unlock":"default"},{"slot":"primary","nameEn":"Burst","unlock":"default"},{"slot":"secondary","nameEn":"Serrated Shiv","unlock":"unlock-required"},{"slot":"utility","nameEn":"Smoke Bomb","unlock":"default"},{"slot":"special","nameEn":"Desperado","unlock":"unlock-required"}],"items":{"common":[{"itemId":"crowbar","recommendation":"core"},{"itemId":"backup-magazine","recommendation":"recommended"},{"itemId":"mocha","recommendation":"recommended"}],"uncommon":[{"itemId":"kjaro-band","recommendation":"core"},{"itemId":"runald-band","recommendation":"core"},{"itemId":"old-guillotine","recommendation":"recommended"}],"legendary":[{"itemId":"laser-scope","recommendation":"core"},{"itemId":"brilliant-behemoth","recommendation":"recommended"}],"boss":[{"itemId":"shatterspleen","recommendation":"core"},{"itemId":"molten-perforator","recommendation":"recommended"}],"equipment":[{"itemId":"ocular-hud","recommendation":"recommended"},{"itemId":"preon-accumulator","recommendation":"conditional"}],"voidItems":[{"itemId":"voidsent-flame","recommendation":"recommended"},{"itemId":"needletick","recommendation":"conditional"},{"itemId":"lysate-cell","recommendation":"conditional"},{"itemId":"lost-seers-lenses","recommendation":"avoid"}],"lunarItems":[{"itemId":"purity","recommendation":"recommended"},{"itemId":"shaped-glass","recommendation":"conditional"},{"itemId":"visions-of-heresy","recommendation":"avoid"}]},"sourceIds":["wiki-bandit","wiki-proc-coefficient","wiki-items"]},{"slug":"mul-t","skills":[{"slot":"primary","nameEn":"Rebar Puncher","unlock":"default"},{"slot":"secondary","nameEn":"Blast Canister","unlock":"default"},{"slot":"utility","nameEn":"Transport Mode","unlock":"default"},{"slot":"special","nameEn":"Retool","unlock":"default"}],"items":{"common":[{"itemId":"crowbar","recommendation":"core"},{"itemId":"pauls-goat-hoof","recommendation":"core"},{"itemId":"oddly-shaped-opal","recommendation":"recommended"}],"uncommon":[{"itemId":"kjaro-band","recommendation":"core"},{"itemId":"runald-band","recommendation":"core"},{"itemId":"fuel-cell","recommendation":"recommended"}],"legendary":[{"itemId":"hardlight-afterburner","recommendation":"core"},{"itemId":"pocket-icbm","recommendation":"conditional"}],"boss":[{"itemId":"shatterspleen","recommendation":"recommended"},{"itemId":"genesis-loop","recommendation":"conditional"}],"equipment":[{"itemId":"preon-accumulator","recommendation":"recommended"},{"itemId":"royal-capacitor","recommendation":"recommended"}],"voidItems":[{"itemId":"polylute","recommendation":"recommended"},{"itemId":"needletick","recommendation":"conditional"},{"itemId":"lysate-cell","recommendation":"conditional"},{"itemId":"benthic-bloom","recommendation":"avoid"}],"lunarItems":[{"itemId":"transcendence","recommendation":"recommended"},{"itemId":"shaped-glass","recommendation":"avoid"}]},"sourceIds":["wiki-mul-t","wiki-proc-coefficient","wiki-items"]},{"slug":"engineer","skills":[{"slot":"primary","nameEn":"Bouncing Grenades","unlock":"default"},{"slot":"secondary","nameEn":"Spider Mines","unlock":"unlock-required"},{"slot":"utility","nameEn":"Bubble Shield","unlock":"default"},{"slot":"special","nameEn":"TR12 Gauss Auto-Turret","unlock":"default"}],"items":{"common":[{"itemId":"bustling-fungus","recommendation":"core"},{"itemId":"soldiers-syringe","recommendation":"core"},{"itemId":"tougher-times","recommendation":"recommended"}],"uncommon":[{"itemId":"atg-missile-mk-1","recommendation":"core"},{"itemId":"ukulele","recommendation":"core"},{"itemId":"box-of-dynamite","recommendation":"recommended"}],"legendary":[{"itemId":"spare-drone-parts","recommendation":"core"},{"itemId":"rejuvenation-rack","recommendation":"recommended"}],"boss":[{"itemId":"empathy-cores","recommendation":"core"},{"itemId":"defense-nucleus","recommendation":"recommended"}],"equipment":[{"itemId":"the-back-up","recommendation":"recommended"},{"itemId":"executive-card","recommendation":"conditional"}],"voidItems":[{"itemId":"lysate-cell","recommendation":"recommended"},{"itemId":"weeping-fungus","recommendation":"conditional"},{"itemId":"plasma-shrimp","recommendation":"conditional"},{"itemId":"benthic-bloom","recommendation":"avoid"}],"lunarItems":[{"itemId":"transcendence","recommendation":"recommended"},{"itemId":"gesture-of-the-drowned","recommendation":"conditional"},{"itemId":"shaped-glass","recommendation":"avoid"}]},"sourceIds":["wiki-engineer","wiki-engineer-turrets","wiki-engineer-thermal-harpoons","wiki-proc-coefficient","wiki-items"]},{"slug":"artificer","skills":[{"slot":"passive","nameEn":"ENV Suit","unlock":"default"},{"slot":"primary","nameEn":"Flame Bolt","unlock":"default"},{"slot":"secondary","nameEn":"Cast Nano-Spear","unlock":"unlock-required"},{"slot":"utility","nameEn":"Snapfreeze","unlock":"default"},{"slot":"special","nameEn":"Ion Surge","unlock":"unlock-required"}],"items":{"common":[{"itemId":"crowbar","recommendation":"core"},{"itemId":"backup-magazine","recommendation":"core"},{"itemId":"gasoline","recommendation":"recommended"}],"uncommon":[{"itemId":"kjaro-band","recommendation":"core"},{"itemId":"runald-band","recommendation":"core"},{"itemId":"ignition-tank","recommendation":"core"}],"legendary":[{"itemId":"alien-head","recommendation":"core"},{"itemId":"hardlight-afterburner","recommendation":"recommended"}],"boss":[{"itemId":"molten-perforator","recommendation":"core"},{"itemId":"genesis-loop","recommendation":"conditional"}],"equipment":[{"itemId":"preon-accumulator","recommendation":"recommended"},{"itemId":"royal-capacitor","recommendation":"recommended"}],"voidItems":[{"itemId":"voidsent-flame","recommendation":"recommended"},{"itemId":"safer-spaces","recommendation":"recommended"},{"itemId":"lysate-cell","recommendation":"conditional"},{"itemId":"needletick","recommendation":"avoid"}],"lunarItems":[{"itemId":"light-flux-pauldron","recommendation":"recommended"},{"itemId":"shaped-glass","recommendation":"conditional"},{"itemId":"gesture-of-the-drowned","recommendation":"avoid"}]},"sourceIds":["wiki-artificer","wiki-proc-coefficient","wiki-items","official-ac-release-notes"]},{"slug":"mercenary","skills":[{"slot":"passive","nameEn":"Cybernetic Enhancements","unlock":"default"},{"slot":"primary","nameEn":"Laser Sword","unlock":"default"},{"slot":"secondary","nameEn":"Whirlwind","unlock":"default"},{"slot":"utility","nameEn":"Blinding Assault","unlock":"default"},{"slot":"special","nameEn":"Eviscerate","unlock":"default"}],"items":{"common":[{"itemId":"focus-crystal","recommendation":"core"},{"itemId":"soldiers-syringe","recommendation":"core"},{"itemId":"topaz-brooch","recommendation":"recommended"}],"uncommon":[{"itemId":"predatory-instincts","recommendation":"core"},{"itemId":"harvesters-scythe","recommendation":"recommended"},{"itemId":"rose-buckler","recommendation":"recommended"}],"legendary":[{"itemId":"hardlight-afterburner","recommendation":"core"},{"itemId":"alien-head","recommendation":"recommended"}],"boss":[{"itemId":"little-disciple","recommendation":"core"},{"itemId":"shatterspleen","recommendation":"recommended"}],"equipment":[{"itemId":"gorags-opus","recommendation":"recommended"},{"itemId":"super-massive-leech","recommendation":"conditional"}],"voidItems":[{"itemId":"safer-spaces","recommendation":"recommended"},{"itemId":"polylute","recommendation":"recommended"},{"itemId":"lysate-cell","recommendation":"conditional"},{"itemId":"lost-seers-lenses","recommendation":"avoid"}],"lunarItems":[{"itemId":"purity","recommendation":"recommended"},{"itemId":"light-flux-pauldron","recommendation":"conditional"},{"itemId":"strides-of-heresy","recommendation":"avoid"}]},"sourceIds":["wiki-mercenary","wiki-proc-coefficient","wiki-items","official-ac-release-notes"]},{"slug":"rex","skills":[{"slot":"passive","nameEn":"Natural Toxins","unlock":"default"},{"slot":"primary","nameEn":"DIRECTIVE: Inject","unlock":"default"},{"slot":"secondary","nameEn":"DIRECTIVE: Drill","unlock":"unlock-required"},{"slot":"utility","nameEn":"DIRECTIVE: Disperse","unlock":"default"},{"slot":"special","nameEn":"Tangling Growth","unlock":"default"}],"items":{"common":[{"itemId":"backup-magazine","recommendation":"core"},{"itemId":"cautious-slug","recommendation":"recommended"},{"itemId":"oddly-shaped-opal","recommendation":"recommended"}],"uncommon":[{"itemId":"death-mark","recommendation":"core"},{"itemId":"atg-missile-mk-1","recommendation":"recommended"},{"itemId":"infusion","recommendation":"conditional"}],"legendary":[{"itemId":"rejuvenation-rack","recommendation":"recommended"},{"itemId":"alien-head","recommendation":"core"}],"boss":[{"itemId":"mired-urn","recommendation":"recommended"},{"itemId":"titanic-knurl","recommendation":"recommended"}],"equipment":[{"itemId":"super-massive-leech","recommendation":"conditional"},{"itemId":"royal-capacitor","recommendation":"recommended"}],"voidItems":[{"itemId":"weeping-fungus","recommendation":"recommended"},{"itemId":"polylute","recommendation":"recommended"},{"itemId":"needletick","recommendation":"conditional"},{"itemId":"plasma-shrimp","recommendation":"avoid"}],"lunarItems":[{"itemId":"purity","recommendation":"conditional"},{"itemId":"corpsebloom","recommendation":"conditional"},{"itemId":"transcendence","recommendation":"avoid"}]},"sourceIds":["wiki-rex","wiki-proc-coefficient","wiki-items","wiki-mired-urn"]},{"slug":"loader","skills":[{"slot":"passive","nameEn":"Scrap Barrier","unlock":"default"},{"slot":"primary","nameEn":"Knuckleboom","unlock":"default"},{"slot":"secondary","nameEn":"Spiked Fist","unlock":"unlock-required"},{"slot":"utility","nameEn":"Charged Gauntlet","unlock":"default"},{"slot":"special","nameEn":"Thunderslam","unlock":"unlock-required"}],"items":{"common":[{"itemId":"crowbar","recommendation":"core"},{"itemId":"pauls-goat-hoof","recommendation":"core"},{"itemId":"focus-crystal","recommendation":"core"}],"uncommon":[{"itemId":"kjaro-band","recommendation":"core"},{"itemId":"runald-band","recommendation":"core"},{"itemId":"wax-quail","recommendation":"recommended"}],"legendary":[{"itemId":"hardlight-afterburner","recommendation":"core"},{"itemId":"h3ad-5t-v2","recommendation":"recommended"}],"boss":[{"itemId":"shatterspleen","recommendation":"recommended"},{"itemId":"charged-perforator","recommendation":"core"}],"equipment":[{"itemId":"preon-accumulator","recommendation":"recommended"},{"itemId":"ocular-hud","recommendation":"conditional"}],"voidItems":[{"itemId":"voidsent-flame","recommendation":"recommended"},{"itemId":"safer-spaces","recommendation":"recommended"},{"itemId":"lysate-cell","recommendation":"conditional"},{"itemId":"needletick","recommendation":"avoid"}],"lunarItems":[{"itemId":"purity","recommendation":"recommended"},{"itemId":"shaped-glass","recommendation":"conditional"},{"itemId":"strides-of-heresy","recommendation":"avoid"}]},"sourceIds":["wiki-loader","wiki-proc-coefficient","wiki-items"]},{"slug":"acrid","skills":[{"slot":"passive","nameEn":"Poison","unlock":"default"},{"slot":"primary","nameEn":"Vicious Wounds","unlock":"default"},{"slot":"secondary","nameEn":"Neurotoxin","unlock":"default"},{"slot":"utility","nameEn":"Caustic Leap","unlock":"default"},{"slot":"special","nameEn":"Epidemic","unlock":"default"}],"items":{"common":[{"itemId":"gasoline","recommendation":"core"},{"itemId":"tri-tip-dagger","recommendation":"recommended"},{"itemId":"backup-magazine","recommendation":"recommended"}],"uncommon":[{"itemId":"ukulele","recommendation":"core"},{"itemId":"atg-missile-mk-1","recommendation":"recommended"},{"itemId":"death-mark","recommendation":"recommended"}],"legendary":[{"itemId":"brilliant-behemoth","recommendation":"core"},{"itemId":"ceremonial-dagger","recommendation":"recommended"}],"boss":[{"itemId":"mired-urn","recommendation":"recommended"},{"itemId":"little-disciple","recommendation":"recommended"}],"equipment":[{"itemId":"royal-capacitor","recommendation":"core"},{"itemId":"forgive-me-please","recommendation":"conditional"}],"voidItems":[{"itemId":"voidsent-flame","recommendation":"recommended"},{"itemId":"polylute","recommendation":"recommended"},{"itemId":"needletick","recommendation":"conditional"},{"itemId":"lost-seers-lenses","recommendation":"avoid"}],"lunarItems":[{"itemId":"purity","recommendation":"recommended"},{"itemId":"visions-of-heresy","recommendation":"conditional"},{"itemId":"shaped-glass","recommendation":"avoid"}]},"sourceIds":["wiki-acrid","wiki-acrid-poison","wiki-proc-coefficient","wiki-items","wiki-mired-urn"]},{"slug":"captain","skills":[{"slot":"passive","nameEn":"Defensive Microbots","unlock":"default"},{"slot":"primary","nameEn":"Vulcan Shotgun","unlock":"default"},{"slot":"secondary","nameEn":"Power Tazer","unlock":"default"},{"slot":"utility","nameEn":"Orbital Probe","unlock":"default"},{"slot":"special","nameEn":"Beacon: Hacking","unlock":"unlock-required"}],"items":{"common":[{"itemId":"mocha","recommendation":"core"},{"itemId":"pauls-goat-hoof","recommendation":"core"},{"itemId":"tri-tip-dagger","recommendation":"recommended"}],"uncommon":[{"itemId":"atg-missile-mk-1","recommendation":"core"},{"itemId":"shipping-request-form","recommendation":"recommended"},{"itemId":"hopoo-feather","recommendation":"core"}],"legendary":[{"itemId":"57-leaf-clover","recommendation":"core"},{"itemId":"spare-drone-parts","recommendation":"conditional"}],"boss":[{"itemId":"empathy-cores","recommendation":"recommended"},{"itemId":"charged-perforator","recommendation":"recommended"}],"equipment":[{"itemId":"executive-card","recommendation":"core"},{"itemId":"royal-capacitor","recommendation":"recommended"}],"voidItems":[{"itemId":"polylute","recommendation":"recommended"},{"itemId":"lysate-cell","recommendation":"recommended"},{"itemId":"encrusted-key","recommendation":"recommended"},{"itemId":"benthic-bloom","recommendation":"avoid"}],"lunarItems":[{"itemId":"strides-of-heresy","recommendation":"recommended"},{"itemId":"focused-convergence","recommendation":"conditional"},{"itemId":"brittle-crown","recommendation":"avoid"}]},"sourceIds":["wiki-captain","wiki-proc-coefficient","wiki-items","wiki-drones"]},{"slug":"railgunner","skills":[{"slot":"passive","nameEn":"Magnetic Accelerator","unlock":"default"},{"slot":"primary","nameEn":"XQR Smart Round System","unlock":"default"},{"slot":"secondary","nameEn":"M99 Sniper","unlock":"default"},{"slot":"utility","nameEn":"Concussion Device","unlock":"default"},{"slot":"special","nameEn":"Cryocharge","unlock":"unlock-required"}],"items":{"common":[{"itemId":"crowbar","recommendation":"core"},{"itemId":"lens-makers-glasses","recommendation":"core"},{"itemId":"armor-piercing-rounds","recommendation":"recommended"}],"uncommon":[{"itemId":"kjaro-band","recommendation":"core"},{"itemId":"runald-band","recommendation":"core"},{"itemId":"hopoo-feather","recommendation":"recommended"}],"legendary":[{"itemId":"laser-scope","recommendation":"core"},{"itemId":"bens-raincoat","recommendation":"recommended"}],"boss":[{"itemId":"shatterspleen","recommendation":"core"},{"itemId":"molten-perforator","recommendation":"recommended"}],"equipment":[{"itemId":"ocular-hud","recommendation":"recommended"},{"itemId":"preon-accumulator","recommendation":"conditional"}],"voidItems":[{"itemId":"voidsent-flame","recommendation":"recommended"},{"itemId":"safer-spaces","recommendation":"recommended"},{"itemId":"polylute","recommendation":"conditional"},{"itemId":"lost-seers-lenses","recommendation":"avoid"}],"lunarItems":[{"itemId":"purity","recommendation":"recommended"},{"itemId":"transcendence","recommendation":"conditional"},{"itemId":"visions-of-heresy","recommendation":"avoid"}]},"sourceIds":["wiki-railgunner","wiki-proc-coefficient","official-ac-patch-1-4-1","wiki-bens-raincoat"]},{"slug":"void-fiend","skills":[{"slot":"passive","nameEn":"Void Corruption","unlock":"default"},{"slot":"primary","nameEn":"Drown","unlock":"default"},{"slot":"secondary","nameEn":"Flood","unlock":"default"},{"slot":"utility","nameEn":"Trespass","unlock":"default"},{"slot":"special","nameEn":"Suppress","unlock":"default"}],"items":{"common":[{"itemId":"lens-makers-glasses","recommendation":"core"},{"itemId":"mocha","recommendation":"core"},{"itemId":"backup-magazine","recommendation":"recommended"}],"uncommon":[{"itemId":"predatory-instincts","recommendation":"core"},{"itemId":"atg-missile-mk-1","recommendation":"recommended"},{"itemId":"harvesters-scythe","recommendation":"conditional"}],"legendary":[{"itemId":"57-leaf-clover","recommendation":"core"},{"itemId":"alien-head","recommendation":"recommended"}],"boss":[{"itemId":"shatterspleen","recommendation":"core"},{"itemId":"charged-perforator","recommendation":"recommended"}],"equipment":[{"itemId":"ocular-hud","recommendation":"core"},{"itemId":"royal-capacitor","recommendation":"recommended"}],"voidItems":[{"itemId":"safer-spaces","recommendation":"recommended"},{"itemId":"polylute","recommendation":"recommended"},{"itemId":"plasma-shrimp","recommendation":"conditional"},{"itemId":"weeping-fungus","recommendation":"avoid"}],"lunarItems":[{"itemId":"transcendence","recommendation":"recommended"},{"itemId":"gesture-of-the-drowned","recommendation":"conditional"},{"itemId":"corpsebloom","recommendation":"avoid"}]},"sourceIds":["wiki-void-fiend","wiki-void-fiend-corruption","wiki-proc-coefficient","wiki-void-items"]},{"slug":"seeker","skills":[{"slot":"passive","nameEn":"Inner Strength","unlock":"default"},{"slot":"primary","nameEn":"Spirit Punch","unlock":"default"},{"slot":"secondary","nameEn":"Soul Spiral","unlock":"unlock-required"},{"slot":"utility","nameEn":"Reprieve","unlock":"unlock-required"},{"slot":"special","nameEn":"Meditate","unlock":"default"}],"items":{"common":[{"itemId":"mocha","recommendation":"core"},{"itemId":"focus-crystal","recommendation":"core"},{"itemId":"backup-magazine","recommendation":"recommended"}],"uncommon":[{"itemId":"rose-buckler","recommendation":"recommended"},{"itemId":"atg-missile-mk-1","recommendation":"recommended"},{"itemId":"infusion","recommendation":"recommended"}],"legendary":[{"itemId":"rejuvenation-rack","recommendation":"core"},{"itemId":"aegis","recommendation":"recommended"}],"boss":[{"itemId":"titanic-knurl","recommendation":"recommended"},{"itemId":"mired-urn","recommendation":"conditional"}],"equipment":[{"itemId":"gorags-opus","recommendation":"core"},{"itemId":"royal-capacitor","recommendation":"recommended"}],"voidItems":[{"itemId":"lysate-cell","recommendation":"recommended"},{"itemId":"safer-spaces","recommendation":"recommended"},{"itemId":"polylute","recommendation":"conditional"},{"itemId":"benthic-bloom","recommendation":"avoid"}],"lunarItems":[{"itemId":"gesture-of-the-drowned","recommendation":"conditional"},{"itemId":"corpsebloom","recommendation":"conditional"},{"itemId":"transcendence","recommendation":"avoid"}]},"sourceIds":["wiki-seeker","wiki-proc-coefficient","wiki-items","wiki-mired-urn"]},{"slug":"chef","skills":[{"slot":"passive","nameEn":"CHEF's Kiss","unlock":"default"},{"slot":"primary","nameEn":"Dice","unlock":"default"},{"slot":"secondary","nameEn":"Sear","unlock":"default"},{"slot":"utility","nameEn":"Roll","unlock":"default"},{"slot":"special","nameEn":"Glaze","unlock":"default"}],"items":{"common":[{"itemId":"backup-magazine","recommendation":"core"},{"itemId":"mocha","recommendation":"core"},{"itemId":"gasoline","recommendation":"recommended"}],"uncommon":[{"itemId":"ignition-tank","recommendation":"core"},{"itemId":"atg-missile-mk-1","recommendation":"recommended"},{"itemId":"death-mark","recommendation":"recommended"}],"legendary":[{"itemId":"brilliant-behemoth","recommendation":"core"},{"itemId":"rejuvenation-rack","recommendation":"recommended"}],"boss":[{"itemId":"molten-perforator","recommendation":"core"},{"itemId":"mired-urn","recommendation":"conditional"}],"equipment":[{"itemId":"royal-capacitor","recommendation":"recommended"},{"itemId":"gorags-opus","recommendation":"conditional"}],"voidItems":[{"itemId":"polylute","recommendation":"recommended"},{"itemId":"safer-spaces","recommendation":"recommended"},{"itemId":"needletick","recommendation":"conditional"},{"itemId":"plasma-shrimp","recommendation":"avoid"}],"lunarItems":[{"itemId":"light-flux-pauldron","recommendation":"conditional"},{"itemId":"corpsebloom","recommendation":"conditional"},{"itemId":"visions-of-heresy","recommendation":"avoid"}]},"sourceIds":["wiki-chef","wiki-chef-skills","wiki-proc-coefficient","wiki-items","wiki-mired-urn"]},{"slug":"false-son","skills":[{"slot":"passive","nameEn":"Lunar Tampering","unlock":"default"},{"slot":"primary","nameEn":"Club of the Forsaken","unlock":"default"},{"slot":"secondary","nameEn":"Lunar Spikes","unlock":"default"},{"slot":"utility","nameEn":"Meridian's Will","unlock":"unlock-required"},{"slot":"special","nameEn":"Laser Burst","unlock":"unlock-required"}],"items":{"common":[{"itemId":"mocha","recommendation":"core"},{"itemId":"focus-crystal","recommendation":"core"},{"itemId":"cautious-slug","recommendation":"recommended"}],"uncommon":[{"itemId":"infusion","recommendation":"core"},{"itemId":"shuriken","recommendation":"recommended"},{"itemId":"rose-buckler","recommendation":"recommended"}],"legendary":[{"itemId":"alien-head","recommendation":"core"},{"itemId":"rejuvenation-rack","recommendation":"recommended"}],"boss":[{"itemId":"titanic-knurl","recommendation":"core"},{"itemId":"mired-urn","recommendation":"recommended"}],"equipment":[{"itemId":"gorags-opus","recommendation":"recommended"},{"itemId":"royal-capacitor","recommendation":"recommended"}],"voidItems":[{"itemId":"lysate-cell","recommendation":"recommended"},{"itemId":"safer-spaces","recommendation":"recommended"},{"itemId":"voidsent-flame","recommendation":"conditional"},{"itemId":"plasma-shrimp","recommendation":"avoid"}],"lunarItems":[{"itemId":"light-flux-pauldron","recommendation":"conditional"},{"itemId":"shaped-glass","recommendation":"conditional"},{"itemId":"transcendence","recommendation":"avoid"}]},"sourceIds":["wiki-false-son","wiki-false-son-growth","wiki-transcendence","wiki-proc-coefficient","wiki-mired-urn"]},{"slug":"operator","skills":[{"slot":"passive","nameEn":"Drone Tech","unlock":"default"},{"slot":"passive","nameEn":"Gunner Drone Mk 2","unlock":"default"},{"slot":"passive","nameEn":"Healing Drone Mk 2","unlock":"default"},{"slot":"primary","nameEn":"H3-11 OCR Custom","unlock":"default"},{"slot":"secondary","nameEn":"ADMIN-OVERRIDE","unlock":"default"},{"slot":"utility","nameEn":"Ascent Protocol","unlock":"default"},{"slot":"special","nameEn":"Ejection Core","unlock":"default"}],"items":{"common":[{"itemId":"mocha","recommendation":"core"},{"itemId":"lens-makers-glasses","recommendation":"core"},{"itemId":"delicate-watch","recommendation":"recommended"}],"uncommon":[{"itemId":"box-of-dynamite","recommendation":"core"},{"itemId":"shipping-request-form","recommendation":"recommended"},{"itemId":"fuel-cell","recommendation":"recommended"}],"legendary":[{"itemId":"spare-drone-parts","recommendation":"core"},{"itemId":"pocket-icbm","recommendation":"recommended"}],"boss":[{"itemId":"empathy-cores","recommendation":"core"},{"itemId":"defense-nucleus","recommendation":"recommended"}],"equipment":[{"itemId":"the-back-up","recommendation":"core"},{"itemId":"executive-card","recommendation":"conditional"}],"voidItems":[{"itemId":"polylute","recommendation":"recommended"},{"itemId":"plasma-shrimp","recommendation":"recommended"},{"itemId":"lysate-cell","recommendation":"conditional"},{"itemId":"benthic-bloom","recommendation":"avoid"}],"lunarItems":[{"itemId":"gesture-of-the-drowned","recommendation":"conditional"},{"itemId":"transcendence","recommendation":"conditional"},{"itemId":"brittle-crown","recommendation":"avoid"}]},"sourceIds":["wiki-operator","wiki-operator-admin-override","official-operator-diary","official-ac-release-notes","official-ac-patch-1-4-1","wiki-drone-combiner"]},{"slug":"drifter","skills":[{"slot":"passive","nameEn":"Trash to Treasure","unlock":"default"},{"slot":"primary","nameEn":"Blunt Force","unlock":"default"},{"slot":"secondary","nameEn":"Junk Cube","unlock":"unlock-required"},{"slot":"utility","nameEn":"Tornado Slam","unlock":"unlock-required"},{"slot":"special","nameEn":"Tinker","unlock":"unlock-required"}],"items":{"common":[{"itemId":"mocha","recommendation":"core"},{"itemId":"focus-crystal","recommendation":"core"},{"itemId":"backup-magazine","recommendation":"core"},{"itemId":"item-scrap-white","recommendation":"conditional"}],"uncommon":[{"itemId":"atg-missile-mk-1","recommendation":"recommended"},{"itemId":"collectors-compulsion","recommendation":"recommended"},{"itemId":"item-scrap-green","recommendation":"conditional"}],"legendary":[{"itemId":"substandard-duplicator","recommendation":"core"},{"itemId":"brilliant-behemoth","recommendation":"recommended"}],"boss":[{"itemId":"titanic-knurl","recommendation":"recommended"},{"itemId":"mired-urn","recommendation":"recommended"}],"equipment":[{"itemId":"recycler","recommendation":"core"},{"itemId":"gorags-opus","recommendation":"conditional"}],"voidItems":[{"itemId":"safer-spaces","recommendation":"recommended"},{"itemId":"polylute","recommendation":"recommended"},{"itemId":"lysate-cell","recommendation":"conditional"},{"itemId":"benthic-bloom","recommendation":"avoid"}],"lunarItems":[{"itemId":"gesture-of-the-drowned","recommendation":"conditional"},{"itemId":"light-flux-pauldron","recommendation":"conditional"},{"itemId":"shaped-glass","recommendation":"conditional"},{"itemId":"brittle-crown","recommendation":"avoid"}]},"sourceIds":["wiki-drifter","wiki-drifter-tinker","official-drifter-diary","official-ac-patch-1-4-1","wiki-mired-urn"]},{"slug":"heretic","skills":[{"slot":"primary","nameEn":"Hungering Gaze","unlock":"transformation"},{"slot":"secondary","nameEn":"Slicing Maelstrom","unlock":"transformation"},{"slot":"utility","nameEn":"Shadowfade","unlock":"transformation"},{"slot":"special","nameEn":"Ruin","unlock":"transformation"}],"items":{"common":[{"itemId":"cautious-slug","recommendation":"core"},{"itemId":"backup-magazine","recommendation":"core"},{"itemId":"mocha","recommendation":"recommended"}],"uncommon":[{"itemId":"atg-missile-mk-1","recommendation":"core"},{"itemId":"fuel-cell","recommendation":"recommended"},{"itemId":"harvesters-scythe","recommendation":"recommended"}],"legendary":[{"itemId":"57-leaf-clover","recommendation":"core"},{"itemId":"rejuvenation-rack","recommendation":"recommended"}],"boss":[{"itemId":"titanic-knurl","recommendation":"recommended"},{"itemId":"charged-perforator","recommendation":"recommended"}],"equipment":[{"itemId":"royal-capacitor","recommendation":"recommended"},{"itemId":"super-massive-leech","recommendation":"conditional"}],"voidItems":[{"itemId":"safer-spaces","recommendation":"recommended"},{"itemId":"polylute","recommendation":"recommended"},{"itemId":"plasma-shrimp","recommendation":"conditional"},{"itemId":"pluripotent-larva","recommendation":"conditional"},{"itemId":"weeping-fungus","recommendation":"avoid"}],"lunarItems":[{"itemId":"transcendence","recommendation":"recommended"},{"itemId":"shaped-glass","recommendation":"conditional"},{"itemId":"corpsebloom","recommendation":"avoid"}]},"sourceIds":["wiki-heretic","wiki-cannot-steal-items","wiki-mithrix-item-steal","wiki-proc-coefficient","wiki-items"]}]`

function reviewedContentSignature() {
  const itemPicks = (picks: typeof survivors[number]['voidItems']) => picks.map(
    ({ itemId, recommendation }) => ({ itemId, recommendation }),
  )

  return survivors.map((guide) => ({
    slug: guide.slug,
    skills: guide.skills.map(({ slot, nameEn, unlock }) => ({ slot, nameEn, unlock })),
    items: {
      common: itemPicks(guide.solo.common),
      uncommon: itemPicks(guide.solo.uncommon),
      legendary: itemPicks(guide.solo.legendary),
      boss: itemPicks(guide.solo.boss),
      equipment: itemPicks(guide.solo.equipment),
      voidItems: itemPicks(guide.voidItems),
      lunarItems: itemPicks(guide.lunarItems),
    },
    sourceIds: guide.sourceIds,
  }))
}

describe('publishable survivor guides', () => {
  test('exports all 19 survivors in canonical order', () => {
    expect(survivors.map((guide) => guide.slug)).toEqual(EXPECTED_SURVIVOR_SLUGS)
  })

  test('passes the complete guide-domain validation', () => {
    expect(validateGuideData(survivors, items)).toEqual([])
  })

  test('contains readable editorial detail for every guide and item recommendation', () => {
    for (const guide of survivors) {
      expect(guide.summary.length, `${guide.slug} summary`).toBeGreaterThan(30)
      expect(guide.buildLogic.join('').length, `${guide.slug} build logic`).toBeGreaterThan(120)
      expect(guide.combatNotes.length, `${guide.slug} combat notes`).toBeGreaterThanOrEqual(4)

      const picks = [
        ...guide.solo.common,
        ...guide.solo.uncommon,
        ...guide.solo.legendary,
        ...guide.solo.boss,
        ...guide.solo.equipment,
        ...guide.voidItems,
        ...guide.lunarItems,
        ...guide.lunarEquipment,
      ]

      for (const pick of picks) {
        expect(pick.role.length, `${guide.slug}/${pick.itemId} role`).toBeGreaterThan(10)
        expect(pick.synergy.length, `${guide.slug}/${pick.itemId} synergy`).toBeGreaterThan(10)
      }
    }
  })

  test('uses the reviewed DLC-sized roster groups', () => {
    const counts = survivors.reduce<Record<string, number>>((result, guide) => {
      result[guide.dlc] = (result[guide.dlc] ?? 0) + 1
      return result
    }, {})

    expect(counts).toEqual({ base: 11, sotv: 2, sots: 3, ac: 2, special: 1 })
  })

  test('references only registered research sources', () => {
    const sourceIds = new Set(sources.map((source) => source.id))

    for (const guide of survivors) {
      for (const sourceId of guide.sourceIds) {
        expect(sourceIds.has(sourceId), `${guide.slug}/${sourceId}`).toBe(true)
      }
    }
  })

  test('uses valid item IDs in every Command phase', () => {
    const itemIds = new Set(items.map((item) => item.id))

    for (const guide of survivors) {
      expect(guide.commandRoute.map((route) => route.phase)).toEqual(['前期', '中期', '后期'])
      for (const route of guide.commandRoute) {
        for (const itemId of route.picks) {
          expect(itemIds.has(itemId), `${guide.slug}/${route.phase}/${itemId}`).toBe(true)
        }
      }
    }
  })

  test('preserves reviewed conditional Lunar recommendation labels', () => {
    const expected = {
      engineer: { 'gesture-of-the-drowned': 'conditional', transcendence: 'recommended' },
      rex: { purity: 'conditional' },
      seeker: { 'gesture-of-the-drowned': 'conditional' },
      chef: { 'light-flux-pauldron': 'conditional' },
      'false-son': { 'light-flux-pauldron': 'conditional' },
      operator: { 'gesture-of-the-drowned': 'conditional' },
      drifter: { 'gesture-of-the-drowned': 'conditional', 'light-flux-pauldron': 'conditional' },
    } as const

    for (const [slug, recommendations] of Object.entries(expected)) {
      const guide = survivors.find((candidate) => candidate.slug === slug)
      expect(guide, slug).toBeDefined()
      for (const [itemId, recommendation] of Object.entries(recommendations)) {
        expect(
          guide?.lunarItems.find((item) => item.itemId === itemId)?.recommendation,
          `${slug}/${itemId}`,
        ).toBe(recommendation)
      }
    }
  })

  test('models passive Lunar items separately from active Lunar equipment', () => {
    const itemById = new Map(items.map((item) => [item.id, item]))
    const lunarEquipmentSignature = survivors.map((guide) => ({
      slug: guide.slug,
      picks: guide.lunarEquipment.map(({ itemId, recommendation }) => ({ itemId, recommendation })),
    }))

    expect(lunarEquipmentSignature).toEqual([
      { slug: 'commando', picks: [] },
      { slug: 'huntress', picks: [] },
      { slug: 'bandit', picks: [] },
      { slug: 'mul-t', picks: [{ itemId: 'spinel-tonic', recommendation: 'conditional' }] },
      { slug: 'engineer', picks: [] },
      { slug: 'artificer', picks: [] },
      { slug: 'mercenary', picks: [] },
      { slug: 'rex', picks: [] },
      { slug: 'loader', picks: [] },
      { slug: 'acrid', picks: [] },
      { slug: 'captain', picks: [] },
      { slug: 'railgunner', picks: [] },
      { slug: 'void-fiend', picks: [] },
      { slug: 'seeker', picks: [] },
      { slug: 'chef', picks: [] },
      { slug: 'false-son', picks: [] },
      { slug: 'operator', picks: [] },
      { slug: 'drifter', picks: [] },
      { slug: 'heretic', picks: [] },
    ])

    for (const guide of survivors) {
      expect(
        guide.lunarItems.every(({ itemId }) => itemById.get(itemId)?.tier === 'lunar'),
        `${guide.slug} passive Lunar items`,
      ).toBe(true)
      expect(
        guide.lunarEquipment.every(({ itemId }) => itemById.get(itemId)?.tier === 'lunar-equipment'),
        `${guide.slug} active Lunar equipment`,
      ).toBe(true)
    }
  })

  test('models Captain beacons and Operator starting drones as exact local skill choices', () => {
    const captain = survivors.find((guide) => guide.slug === 'captain')
    const captainSpecial = captain?.skills.find((candidate) => candidate.slot === 'special')
    expect(captainSpecial).toMatchObject({
      nameZh: '骇入信标',
      nameEn: 'Beacon: Hacking',
      unlock: 'unlock-required',
      icon: 'assets/skills/captain/beacon-hacking.png',
      reason: '轨道补给信标的两格都选择骇入信标；每关免费关键金币对象，落地后不可回收。',
    })

    const operator = survivors.find((guide) => guide.slug === 'operator')
    const passiveChoices = operator?.skills.filter((candidate) => candidate.slot === 'passive')
    expect(passiveChoices?.map(({ nameZh, nameEn, unlock, icon }) => ({ nameZh, nameEn, unlock, icon }))).toEqual([
      { nameZh: '无人机技术', nameEn: 'Drone Tech', unlock: 'default', icon: 'assets/skills/operator/drone-tech.png' },
      { nameZh: '二型炮手无人机', nameEn: 'Gunner Drone Mk 2', unlock: 'default', icon: 'assets/skills/operator/gunner-drone-mk-2.png' },
      { nameZh: '二型治疗无人机', nameEn: 'Healing Drone Mk 2', unlock: 'default', icon: 'assets/skills/operator/healing-drone-mk-2.png' },
    ])
  })

  test('uses exact Chinese-only DLC skill names and canonical Heresy item names', () => {
    const railgunner = survivors.find((guide) => guide.slug === 'railgunner')
    expect(railgunner?.skills.map(({ nameZh, nameEn }) => ({ nameZh, nameEn }))).toEqual([
      { nameZh: '磁力加速器', nameEn: 'Magnetic Accelerator' },
      { nameZh: '智能弹系统', nameEn: 'XQR Smart Round System' },
      { nameZh: '狙击枪', nameEn: 'M99 Sniper' },
      { nameZh: '震荡装置', nameEn: 'Concussion Device' },
      { nameZh: '冷冻充能', nameEn: 'Cryocharge' },
    ])

    const operator = survivors.find((guide) => guide.slug === 'operator')
    expect(operator?.skills.find(({ nameEn }) => nameEn === 'H3-11 OCR Custom')?.nameZh)
      .toBe('定制充能步枪')

    const heresyItemIds = [
      'visions-of-heresy',
      'hooks-of-heresy',
      'strides-of-heresy',
      'essence-of-heresy',
    ]
    expect(heresyItemIds.map((itemId) => items.find((item) => item.id === itemId)?.nameZh)).toEqual([
      '异端幻象',
      '异端之钩',
      '异端跨越',
      '异端精华',
    ])

    const heretic = survivors.find((guide) => guide.slug === 'heretic')
    expect(heretic?.skills.map(({ nameZh }) => nameZh)).toEqual([
      '饥渴凝视（异端幻象）',
      '切割漩涡（异端之钩）',
      '暗影消退（异端跨越）',
      '毁灭（异端精华）',
    ])

    expect(railgunner?.skills.find(({ nameEn }) => nameEn === 'M99 Sniper')?.reason)
      .toContain('精确射手步枪')
    expect(railgunner?.combatNotes[0].body).toContain('使用震荡装置位移')

    expect(operator?.skills.find(({ nameEn }) => nameEn === 'Ejection Core')?.reason)
      .toContain('增幅核心')
    expect(JSON.stringify(operator)).toContain('集群命令')
    expect(operator?.combatNotes[2].body).toContain('二型炮手无人机与导弹无人机命令追击')

    const falseSon = survivors.find((guide) => guide.slug === 'false-son')
    expect(falseSon?.skills.find(({ nameEn }) => nameEn === 'Lunar Spikes')?.reason)
      .toContain('月球尖桩')

    const seeker = survivors.find((guide) => guide.slug === 'seeker')
    expect(seeker?.solo.common[0].role).toContain('灵拳')
    expect(seeker?.solo.common[1].role).toContain('灵拳与灵魂螺旋')
    expect(seeker?.solo.common[2].synergy).toContain('更多灵魂螺旋')
    expect(seeker?.solo.uncommon[1].role).toContain('灵拳和灵魂螺旋')
    expect(seeker?.commandRoute[0].explanation).toContain('灵拳连段手感、近战乘区和灵魂螺旋库存')
    expect(seeker?.combatNotes[0].body).toContain('灵魂螺旋开启屏障，灵拳连段穿群')
    expect(seeker?.combatNotes[1].body).toContain('维持灵拳和灵魂螺旋')

    const drifter = survivors.find((guide) => guide.slug === 'drifter')
    expect(drifter?.coopAdjustments[1]).toContain('打捞')
    expect(drifter?.coopAdjustments[2]).toContain('收回')
    expect(drifter?.combatNotes[2].body).toContain('清理')

    expect(heretic?.buildLogic[3]).toBe(
      '切割漩涡（异端之钩）先控场，饥渴凝视（异端幻象）给多目标叠加毁灭层数，装备和爆炸补层后再由毁灭（异端精华）集中引爆，最后用暗影消退（异端跨越）无形撤离。',
    )
  })

  test('uses 打捞 for every visible Salvage reference while keeping Recycler terminology distinct', () => {
    const drifter = survivors.find((guide) => guide.slug === 'drifter')
    const lysateCell = drifter?.voidItems.find(({ itemId }) => itemId === 'lysate-cell')
    const recycler = drifter?.solo.equipment.find(({ itemId }) => itemId === 'recycler')

    expect([
      drifter?.coopAdjustments[1],
      lysateCell?.role,
    ]).toEqual([
      '打捞产生的四个临时物可以分给队友；临时物有时限，团队应立刻进入传送器爆发窗。',
      '腐化燃料电池，增加巧匠或打捞特殊充能',
    ])
    expect(lysateCell?.synergy).toBe('更多改造机会很强；回收机是核心选择工具时仍保留燃料电池。')
    expect(recycler?.synergy).toBe('先回收低价值掉落，再决定是否用八点垃圾资源制作临时版本和废料。')
  })

  test('uses canonical Chinese names whenever base guides reference alternate skills', () => {
    const guideText = (slug: string) => JSON.stringify(
      survivors.find((guide) => guide.slug === slug),
    )

    expect(guideText('huntress')).toContain('乱射')
    expect(guideText('huntress')).not.toContain('疾射')
    expect(guideText('bandit')).toContain('爆破射击')
    expect(guideText('bandit')).not.toMatch(/爆破(?!射击)/u)
    expect(guideText('engineer')).toContain('热力鱼叉')
    expect(guideText('engineer')).not.toContain('热能鱼叉')
  })

  test('states the REX Drill hit count and per-hit proc coefficient unambiguously', () => {
    const rex = survivors.find((guide) => guide.slug === 'rex')
    const rexText = JSON.stringify(rex)
    const exactMechanic = '可命中十六次，每次命中的触发系数均为零点五'

    expect(rexText.split(exactMechanic)).toHaveLength(3)
    expect(rexText).not.toContain('十六次零点五触发系数')
  })

  test('cites the direct Mired Urn source wherever Seeker and CHEF publish its current targeting', () => {
    for (const slug of ['seeker', 'chef']) {
      expect(survivors.find((guide) => guide.slug === slug)?.sourceIds).toContain('wiki-mired-urn')
    }
  })

  test('matches the complete reviewed skill, item, recommendation, and source signature', () => {
    const actual = reviewedContentSignature()
    expect(JSON.stringify(actual)).toBe(REVIEWED_CONTENT_SIGNATURE)
  })
})
