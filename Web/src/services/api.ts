const API_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:5025'

export interface RegisterData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface User {
  id: number
  username: string
  email: string
  xp: number
  createdAt: string
}

export async function registerUser(
  data: RegisterData
): Promise<User> {
  const response = await fetch(
    `${API_URL}/api/auth/register`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(data),
    }
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(
      result.message || 'No fue posible crear la cuenta.'
    )
  }

  return result
}

export interface LoginData {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: number
    username: string
    email: string
    xp: number
  }
}

export async function loginUser(
  data: LoginData
): Promise<LoginResponse> {
  const response = await fetch(
    `${API_URL}/api/auth/login`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(data),
    }
  )

  const result = await response
    .json()
    .catch(() => null)

  if (!response.ok) {
    throw new Error(
      result?.message ||
      'Correo o contraseña incorrectos.'
    )
  }

  return result
}

export interface UnlockedAchievement {
  code: string
  title: string
  description: string
  icon: string
}

export interface CompleteLessonResponse {
  message: string
  alreadyCompleted: boolean

  xpEarned?: number
  totalXp?: number
  xp?: number

  currentStreak?: number
  longestStreak?: number
  lastActivityDate?: string | null

  newAchievements?: UnlockedAchievement[]
}

export async function completeLesson(
  courseSlug: string,
  lessonId: number,
  challengeProof: string | null = null
): Promise<CompleteLessonResponse> {
  const token = localStorage.getItem('osocoddy_token')

  if (!token) {
    throw new Error('Necesitas iniciar sesión.')
  }

  const response = await fetch(
    `${API_URL}/api/progress/complete`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        courseSlug,
        lessonId,
        challengeProof,
      }),
    }
  )

  const result = await response
    .json()
    .catch(() => null)

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        'Tu sesión expiró. Inicia sesión nuevamente.'
      )
    }

    throw new Error(
      result?.message ||
      'No fue posible completar la lección.'
    )
  }

  return result
}

export interface CompletedLesson {
  courseSlug: string
  lessonId: number
  xpEarned: number
  completedAt: string
}

export interface AchievementProgress {
  code: string
  unlockedAt: string
}

export interface ProgressResponse {
  totalXp: number

  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null

  achievements: AchievementProgress[]

  completedLessons: CompletedLesson[]
}

export async function getMyProgress(): Promise<ProgressResponse> {
  const token = localStorage.getItem('osocoddy_token')

  if (!token) {
    throw new Error('Necesitas iniciar sesión.')
  }

  const response = await fetch(
    `${API_URL}/api/progress/me`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const result = await response
    .json()
    .catch(() => null)

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        'Tu sesión expiró. Inicia sesión nuevamente.'
      )
    }

    throw new Error(
      result?.message ||
      'No fue posible obtener tu progreso.'
    )
  }

  return result
}

export interface RunCodeResponse {
  success: boolean
  output: string
  error: string | null
}

export async function runPythonCode(
  code: string
): Promise<RunCodeResponse> {
  const token = localStorage.getItem('osocoddy_token')

  if (!token) {
    throw new Error('Necesitas iniciar sesión.')
  }

  const response = await fetch(
    `${API_URL}/api/code/run/python`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        code,
      }),
    }
  )

  const result = await response
    .json()
    .catch(() => null)

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        'Tu sesión expiró. Inicia sesión nuevamente.'
      )
    }

    throw new Error(
      result?.message ||
      'No fue posible ejecutar el código.'
    )
  }

  return result
}

export interface CheckChallengeResponse {
  correct: boolean
  message: string
  output: string
  error: string | null
  proof: string | null
}

export async function checkChallenge(
  courseSlug: string,
  lessonId: number,
  code: string
): Promise<CheckChallengeResponse> {
  const token = localStorage.getItem('osocoddy_token')

  if (!token) {
    throw new Error('Necesitas iniciar sesión.')
  }

  const response = await fetch(
    `${API_URL}/api/challenges/check`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        courseSlug,
        lessonId,
        code,
      }),
    }
  )

  const result = await response
    .json()
    .catch(() => null)

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        'Tu sesión expiró. Inicia sesión nuevamente.'
      )
    }

    throw new Error(
      result?.message ||
      'No fue posible comprobar el reto.'
    )
  }

  return result
}
