import type { SurvivorGuide } from '../../domain/guide'
import { acSurvivors } from './ac'
import { baseSurvivors } from './base'
import { sotvSurvivors } from './sotv'
import { sotsSurvivors } from './sots'
import { specialSurvivors } from './special'

export { acSurvivors, baseSurvivors, sotvSurvivors, sotsSurvivors, specialSurvivors }

/** Canonical publish order: base, SotV, SotS, Alloyed Collective, special transformation. */
export const survivors: SurvivorGuide[] = [
  ...baseSurvivors,
  ...sotvSurvivors,
  ...sotsSurvivors,
  ...acSurvivors,
  ...specialSurvivors,
]
