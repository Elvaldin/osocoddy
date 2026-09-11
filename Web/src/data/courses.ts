export interface Course {
  id: number
  name: string
  slug: string
  icon: string
  description: string
  level: string
  lessons: number
  category: string
}

export const courses: Course[] = [
  {
    id: 1,
    name: 'Python',
    slug: 'python',
    icon: '🐍',
    description:
      'Aprende programación desde cero con Python.',
    level: 'Principiante',
    lessons: 20,
    category: 'Programación',
  },
  {
    id: 2,
    name: 'Java',
    slug: 'java',
    icon: '☕',
    description:
      'Domina Java y la programación orientada a objetos.',
    level: 'Principiante',
    lessons: 24,
    category: 'Programación',
  },
  {
    id: 3,
    name: 'C#',
    slug: 'csharp',
    icon: '🟣',
    description:
      'Aprende C# y desarrolla aplicaciones modernas con .NET.',
    level: 'Principiante',
    lessons: 22,
    category: 'Programación',
  },
  {
    id: 4,
    name: 'JavaScript',
    slug: 'javascript',
    icon: '🟨',
    description:
      'Aprende el lenguaje principal de la web.',
    level: 'Principiante',
    lessons: 25,
    category: 'Web',
  },
]