export interface AchievementDefinition {
  code: string
  title: string
  description: string
  icon: string
}

export const achievements: AchievementDefinition[] = [
  {
    code: 'FIRST_LESSON',
    title: 'Primer paso',
    description:
      'Completa tu primera lección.',
    icon: '🏅',
  },

  {
    code: 'PYTHON_5',
    title: 'Aprendiz de Python',
    description:
      'Completa 5 lecciones de Python.',
    icon: '🐍',
  },

  {
    code: 'STREAK_3',
    title: 'En llamas',
    description:
      'Mantén una racha de 3 días.',
    icon: '🔥',
  },

  {
    code: 'XP_500',
    title: '500 XP',
    description:
      'Consigue 500 puntos de experiencia.',
    icon: '⭐',
  },

  {
    code: 'PYTHON_MASTER',
    title: 'Maestro Python',
    description:
      'Completa todas las lecciones de Python.',
    icon: '🎓',
  },
]