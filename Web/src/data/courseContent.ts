export interface Lesson{
    id: number
    title: string
    completed: boolean
}

export interface Module{
    id: number
    title: string
    description: string
    lessons: Lesson[]
}

export interface CourseContent{
    name: string
    slug: string
    icon: string
    description: string
    modules: Module[]
}

export const courseContents: CourseContent[] = [
  {
    name: 'Python',
    slug: 'python',
    icon: '🐍',
    description: 'Aprende Python desde cero y domina los fundamentos.',
    modules: [
      {
        id: 1,
        title: 'Fundamentos de Python',
        description: 'Comienza con las bases del lenguaje.',
        lessons: [
          {
            id: 1,
            title: '¿Qué es Python?',
            completed: false,
          },
          {
            id: 2,
            title: 'Hola Mundo',
            completed: false,
          },
          {
            id: 3,
            title: 'Variables',
            completed: false,
          },
          {
            id: 4,
            title: 'Tipos de datos',
            completed: false,
          },
        ],
      },
      {
        id: 2,
        title: 'Control de flujo',
        description: 'Controla el comportamiento de tus programas.',
        lessons: [
          {
            id: 5,
            title: 'Condicionales',
            completed: false,
          },
          {
            id: 6,
            title: 'Bucle for',
            completed: false,
          },
          {
            id: 7,
            title: 'Bucle while',
            completed: false,
          },
          {
            id: 8,
            title: 'Funciones',
            completed: false,
          },
        ],
      },
      {
        id: 3,
        title: 'Programación Orientada a Objetos',
        description: 'Aprende a trabajar con clases y objetos.',
        lessons: [
          {
            id: 9,
            title: 'Clases y objetos',
            completed: false,
          },
          {
            id: 10,
            title: 'Encapsulación',
            completed: false,
          },
          {
            id: 11,
            title: 'Herencia',
            completed: false,
          },
          {
            id: 12,
            title: 'Polimorfismo',
            completed: false,
          },
        ],
      },
    ],
  },

  {
    name: 'Java',
    slug: 'java',
    icon: '☕',
    description: 'Aprende Java y programación orientada a objetos.',
    modules: [
      {
        id: 1,
        title: 'Fundamentos de Java',
        description: 'Conoce la sintaxis y estructura de Java.',
        lessons: [
          {
            id: 1,
            title: 'Introducción a Java',
            completed: false,
          },
          {
            id: 2,
            title: 'Hola Mundo',
            completed: false,
          },
          {
            id: 3,
            title: 'Variables y tipos',
            completed: false,
          },
          {
            id: 4,
            title: 'Operadores',
            completed: false,
          },
        ],
      },
      {
        id: 2,
        title: 'Control de flujo',
        description: 'Condiciones, ciclos y métodos.',
        lessons: [
          {
            id: 5,
            title: 'If y Else',
            completed: false,
          },
          {
            id: 6,
            title: 'Switch',
            completed: false,
          },
          {
            id: 7,
            title: 'Bucles',
            completed: false,
          },
          {
            id: 8,
            title: 'Métodos',
            completed: false,
          },
        ],
      },
    ],
  },

  {
    name: 'C#',
    slug: 'csharp',
    icon: '🟣',
    description: 'Aprende C# y comienza tu camino con .NET.',
    modules: [
      {
        id: 1,
        title: 'Fundamentos de C#',
        description: 'Aprende la sintaxis básica del lenguaje.',
        lessons: [
          {
            id: 1,
            title: 'Introducción a C#',
            completed: false,
          },
          {
            id: 2,
            title: 'Hola Mundo',
            completed: false,
          },
          {
            id: 3,
            title: 'Variables',
            completed: false,
          },
          {
            id: 4,
            title: 'Tipos de datos',
            completed: false,
          },
        ],
      },
      {
        id: 2,
        title: 'POO con C#',
        description: 'Clases, objetos y principios de POO.',
        lessons: [
          {
            id: 5,
            title: 'Clases y objetos',
            completed: false,
          },
          {
            id: 6,
            title: 'Constructores',
            completed: false,
          },
          {
            id: 7,
            title: 'Herencia',
            completed: false,
          },
          {
            id: 8,
            title: 'Interfaces',
            completed: false,
          },
        ],
      },
    ],
  },

  {
    name: 'JavaScript',
    slug: 'javascript',
    icon: '🟨',
    description: 'Aprende JavaScript para desarrollar aplicaciones web.',
    modules: [
      {
        id: 1,
        title: 'Fundamentos de JavaScript',
        description: 'Aprende las bases del lenguaje de la web.',
        lessons: [
          {
            id: 1,
            title: 'Introducción a JavaScript',
            completed: false,
          },
          {
            id: 2,
            title: 'Variables',
            completed: false,
          },
          {
            id: 3,
            title: 'Tipos de datos',
            completed: false,
          },
          {
            id: 4,
            title: 'Operadores',
            completed: false,
          },
        ],
      },
      {
        id: 2,
        title: 'Control de flujo',
        description: 'Crea lógica dentro de tus aplicaciones.',
        lessons: [
          {
            id: 5,
            title: 'If y Else',
            completed: false,
          },
          {
            id: 6,
            title: 'Switch',
            completed: false,
          },
          {
            id: 7,
            title: 'For y While',
            completed: false,
          },
          {
            id: 8,
            title: 'Funciones',
            completed: false,
          },
        ],
      },
    ],
  },
]