export interface LevelDefinition {
  level: number
  name: string
  minXp: number
  icon: string
}

export const levels: LevelDefinition[] = [
  {
    level: 1,
    name: 'Novato',
    minXp: 0,
    icon: '🌱',
  },
  {
    level: 2,
    name: 'Aprendiz',
    minXp: 200,
    icon: '🐻',
  },
  {
    level: 3,
    name: 'Programador',
    minXp: 500,
    icon: '💻',
  },
  {
    level: 4,
    name: 'Developer',
    minXp: 900,
    icon: '⚡',
  },
  {
    level: 5,
    name: 'Hacker',
    minXp: 1400,
    icon: '👾',
  },
  {
    level: 6,
    name: 'Maestro',
    minXp: 2000,
    icon: '👑',
  },
]


export function getLevelFromXp(
  xp: number
) {
  let currentLevel =
    levels[0]

  for (const level of levels) {
    if (xp >= level.minXp) {
      currentLevel = level
    }
  }

  const currentIndex =
    levels.findIndex(
      (level) =>
        level.level ===
        currentLevel.level
    )

  const nextLevel =
    levels[currentIndex + 1] ?? null


  if (!nextLevel) {
    return {
      currentLevel,
      nextLevel: null,
      progress: 100,
      xpIntoLevel:
        xp - currentLevel.minXp,
      xpNeeded: 0,
    }
  }


  const xpIntoLevel =
    xp - currentLevel.minXp

  const xpNeeded =
    nextLevel.minXp -
    currentLevel.minXp

  const progress =
    Math.min(
      100,
      Math.round(
        (
          xpIntoLevel /
          xpNeeded
        ) * 100
      )
    )


  return {
    currentLevel,
    nextLevel,
    progress,
    xpIntoLevel,
    xpNeeded,
  }
}