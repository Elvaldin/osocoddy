export interface LessonChallenge {
  instructions: string
  starterCode: string
}

export interface LessonContent {
  courseSlug: string
  lessonId: number
  title: string
  description: string
  theory: string[]
  code?: string
  challenge?: LessonChallenge
  xp: number
}

export const lessonContents: LessonContent[] = [
  {
    courseSlug: 'python',
    lessonId: 1,
    title: '¿Qué es Python?',
    description:
      'Conoce qué es Python, para qué se utiliza y por qué es uno de los lenguajes más populares.',
    theory: [
      'Python es un lenguaje de programación de alto nivel creado por Guido van Rossum.',
      'Se caracteriza por tener una sintaxis sencilla y fácil de leer.',
      'Python se utiliza en desarrollo web, automatización, inteligencia artificial, ciencia de datos y muchas otras áreas.',
      'Una de sus principales ventajas es que permite crear programas con menos código que muchos otros lenguajes.',
    ],
    code: `print("Hola, osoCoddy! 🐻")`,
    challenge: {
      instructions:
        'Modifica el ejemplo para que muestre tu nombre.',

      starterCode:
        `print("Hola, osoCoddy! 🐻")`,
      },
    xp: 50,
  },

  {
    courseSlug: 'python',
    lessonId: 2,
    title: 'Hola Mundo',
    description:
      'Escribe y comprende tu primer programa en Python.',
    theory: [
      'Tradicionalmente, el primer programa que escribimos al aprender un lenguaje muestra el mensaje "Hola Mundo".',
      'En Python utilizamos la función print() para mostrar información en pantalla.',
    ],
    code: `print("Hola Mundo")`,
    challenge: {
      instructions:
        'Muestra en pantalla: Estoy aprendiendo Python en osoCoddy.',

      starterCode:
        `print("")`,
    },
    xp: 50,
  },

  {
    courseSlug: 'python',
    lessonId: 3,
    title: 'Variables',
    description:
      'Aprende a almacenar información dentro de tus programas.',
    theory: [
      'Una variable permite guardar un valor para utilizarlo posteriormente.',
      'Python determina automáticamente el tipo de dato de una variable.',
    ],
    code: `nombre = "Oswaldo"
           edad = 24
           print(nombre)
           print(edad)`,
    challenge: {
      instructions:
        'Crea dos variables llamadas lenguaje y nivel y muestra sus valores.',

      starterCode:
        `# Escribe tu código aquí
    `,
    },
    xp: 50,
  },

  {
    courseSlug: 'python',
    lessonId: 4,
    title: 'Tipos de datos',
    description:
      'Conoce los principales tipos de datos de Python.',
    theory: [
      'Los tipos de datos indican qué clase de información almacena una variable.',
      'Entre los tipos más utilizados están str, int, float y bool.',
    ],
    code: `nombre = "Coddy"
      edad = 1
      precio = 99.99
      activo = True`,
    challenge: {
      instructions:
        'Crea variables llamadas nombre, edad, precio y activo.',

      starterCode:
        `# Escribe tu código aquí

    `,
    },
    xp: 50,
  },

  {
    courseSlug: 'python',
    lessonId: 5,
    title: 'Condicionales',
    description:
      'Aprende a tomar decisiones en Python usando if y else.',

    theory: [
      'Los condicionales permiten ejecutar código dependiendo de si una condición es verdadera o falsa.',
      'En Python utilizamos if para evaluar una condición y else para ejecutar una alternativa.',
      'La indentación es obligatoria para indicar qué instrucciones pertenecen a cada bloque.',
    ],

    code: `edad = 20

  if edad >= 18:
      print("Mayor de edad")
  else:
      print("Menor de edad")`,

    challenge: {
      instructions:
        'Crea una variable edad con valor 20. Usa if y else para mostrar "Mayor de edad" si tiene 18 años o más; de lo contrario muestra "Menor de edad".',

      starterCode: `edad = 20

  # Escribe tu condicional aquí

  `,
    },

    xp: 50,
  },

  {
    courseSlug: 'python',
    lessonId: 6,
    title: 'Bucle for',
    description:
      'Aprende a repetir instrucciones utilizando el bucle for.',

    theory: [
      'El bucle for permite recorrer una secuencia o repetir una acción varias veces.',
      'range() genera una secuencia de números que podemos recorrer con for.',
      'Por ejemplo, range(1, 6) genera los números del 1 al 5.',
    ],

    code: `for numero in range(1, 6):
      print(numero)`,

    challenge: {
      instructions:
        'Usa un bucle for para mostrar los números del 1 al 5.',

      starterCode: `# Usa un for para mostrar del 1 al 5

  `,
    },

    xp: 50,
  },

  {
    courseSlug: 'python',
    lessonId: 7,
    title: 'Bucle while',
    description:
      'Aprende a repetir código mientras una condición sea verdadera.',

    theory: [
      'El bucle while ejecuta instrucciones mientras una condición sea verdadera.',
      'Debemos modificar la variable utilizada en la condición para evitar un bucle infinito.',
      'while es útil cuando no sabemos exactamente cuántas repeticiones necesitaremos.',
    ],

    code: `numero = 1

  while numero <= 5:
      print(numero)
      numero += 1`,

    challenge: {
      instructions:
        'Usa un bucle while para mostrar los números del 1 al 5.',

      starterCode: `numero = 1

  # Usa un while para mostrar del 1 al 5

  `,
    },

    xp: 50,
  },

  {
    courseSlug: 'python',
    lessonId: 8,
    title: 'Funciones',
    description:
      'Aprende a organizar y reutilizar código creando funciones.',

    theory: [
      'Una función es un bloque de código reutilizable que realiza una tarea específica.',
      'En Python las funciones se crean utilizando la palabra def.',
      'Los parámetros permiten enviar información a una función y return permite devolver un resultado.',
    ],

    code: `def saludar(nombre):
      return "Hola, " + nombre

  print(saludar("Coddy"))`,

    challenge: {
      instructions:
        'Crea una función llamada saludar que reciba nombre y devuelva "Hola, " seguido del nombre. Después prueba la función con print().',

      starterCode: `def saludar(nombre):
      # Completa la función aquí
      pass

  `,
    },

    xp: 50,
  },

  {
    courseSlug: 'python',
    lessonId: 9,
    title: 'Clases',
    description:
      'Aprende qué es una clase y cómo crear tus propios tipos de datos.',

    theory: [
      'Una clase es una plantilla que nos permite definir cómo serán nuestros objetos.',
      'En Python utilizamos la palabra class para crear una clase.',
      'Por convención, los nombres de las clases comienzan con mayúscula.',
    ],

    code: `class Persona:
      pass

  print(Persona)`,

    challenge: {
      instructions:
        'Crea una clase llamada Persona.',

      starterCode: `# Crea aquí la clase Persona

  `,
    },

    xp: 50,
  },

  {
    courseSlug: 'python',
    lessonId: 10,
    title: 'Objetos',
    description:
      'Aprende a crear objetos a partir de una clase.',

    theory: [
      'Un objeto es una instancia de una clase.',
      'Podemos crear varios objetos utilizando la misma clase.',
      'Cada objeto puede almacenar sus propios datos.',
    ],

    code: `class Persona:
      pass

  persona1 = Persona()

  persona1.nombre = "Coddy"

  print(persona1.nombre)`,

    challenge: {
      instructions:
        'Crea una clase Persona, crea un objeto llamado persona1 y asigna "Coddy" a su atributo nombre.',

      starterCode: `class Persona:
      pass

  # Crea persona1 aquí

  `,
    },

    xp: 50,
  },

  {
    courseSlug: 'python',
    lessonId: 11,
    title: 'Constructor',
    description:
      'Aprende a inicializar objetos utilizando el método __init__.',

    theory: [
      '__init__ es el constructor de una clase en Python.',
      'El constructor se ejecuta automáticamente cuando creamos un objeto.',
      'self representa al objeto que estamos creando.',
    ],

    code: `class Persona:
      def __init__(self, nombre, edad):
          self.nombre = nombre
          self.edad = edad

  persona = Persona("Coddy", 3)

  print(persona.nombre)
  print(persona.edad)`,

    challenge: {
      instructions:
        'Crea una clase Persona cuyo constructor reciba nombre y edad y guarde ambos valores en el objeto.',

      starterCode: `class Persona:
      def __init__(self, nombre, edad):
          # Guarda los datos aquí
          pass

  `,
    },

    xp: 50,
  },

  {
    courseSlug: 'python',
    lessonId: 12,
    title: 'Métodos',
    description:
      'Aprende a crear comportamientos dentro de una clase usando métodos.',

    theory: [
      'Los métodos son funciones que pertenecen a una clase.',
      'Los métodos reciben self para poder acceder a los datos del objeto.',
      'Podemos combinar atributos y métodos para crear objetos con comportamiento.',
    ],

    code: `class Persona:
      def __init__(self, nombre):
          self.nombre = nombre

      def saludar(self):
          return "Hola, " + self.nombre

  persona = Persona("Coddy")

  print(persona.saludar())`,

    challenge: {
      instructions:
        'Crea una clase Persona con nombre y un método saludar() que devuelva "Hola, " seguido del nombre.',

      starterCode: `class Persona:
      def __init__(self, nombre):
          # Guarda el nombre
          pass

      def saludar(self):
          # Devuelve el saludo
          pass

  `,
    },

    xp: 50,
  },

]