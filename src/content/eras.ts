import { ERA_KEYS, type Era } from './schema'

// ERA_KEYS is already in chronological order.
export const ERAS: Era[] = [...ERA_KEYS]

export function eraIndex(era: Era): number {
  return ERAS.indexOf(era)
}
