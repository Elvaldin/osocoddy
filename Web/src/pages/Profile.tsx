import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getLevelFromXp,
} from '../data/levels'

import {
  getMyProgress,
  type AchievementProgress,
  type CompletedLesson,
} from '../services/api'

import { achievements } from '../data/achievements'

import './Profile.css'


interface User {
  id: number
  username: string
  email: string
  xp: number
}


function Profile() {
  const [user] = useState<User | null>(() => {
    const storedUser =
      localStorage.getItem('osocoddy_user')

    if (!storedUser) {
      return null
    }

    try {
      return JSON.parse(storedUser)
    } catch {
      return null
    }
  })

  const [
  completedLessons,
  setCompletedLessons,
] = useState<CompletedLesson[]>([])

  const [totalXp, setTotalXp] =
    useState(0)

  const [currentStreak, setCurrentStreak] =
    useState(0)

  const [longestStreak, setLongestStreak] =
    useState(0)

  const [
    unlockedAchievements,
    setUnlockedAchievements,
  ] = useState<AchievementProgress[]>([])

  const [loading, setLoading] =
    useState(true)


  useEffect(() => {
    const loadProfile = async () => {
      try {
        const result =
          await getMyProgress()

        setTotalXp(
          result.totalXp
        )

        setCurrentStreak(
          result.currentStreak
        )

        setLongestStreak(
          result.longestStreak
        )

        setUnlockedAchievements(
          result.achievements ?? []
        )

        setCompletedLessons(
          result.completedLessons ?? []
        )

      } catch (error) {
        console.error(
          'Error cargando perfil:',
          error
        )
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])


  const unlockedCodes =
    new Set(
      unlockedAchievements.map(
        (achievement) =>
          achievement.code
      )
    )


  const unlockedCount =
    achievements.filter(
      (achievement) =>
        unlockedCodes.has(
          achievement.code
        )
    ).length


  const achievementProgress =
    achievements.length === 0
      ? 0
      : Math.round(
          (
            unlockedCount /
            achievements.length
          ) * 100
        )


  const formatUnlockedDate = (
    code: string
  ) => {
    const unlocked =
      unlockedAchievements.find(
        (achievement) =>
          achievement.code === code
      )

    if (!unlocked) {
      return null
    }

    return new Intl.DateTimeFormat(
      'es-MX',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    ).format(
      new Date(unlocked.unlockedAt)
    )
  }

  const levelInfo =
    getLevelFromXp(totalXp)

  const getMexicoDateKey = (
  date: Date
) => {
  const parts =
    new Intl.DateTimeFormat(
      'en-US',
      {
        timeZone: 'America/Mexico_City',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }
    ).formatToParts(date)

  const year =
    parts.find(
      (part) => part.type === 'year'
    )?.value ?? ''

  const month =
    parts.find(
      (part) => part.type === 'month'
    )?.value ?? ''

  const day =
    parts.find(
      (part) => part.type === 'day'
    )?.value ?? ''

  return `${year}-${month}-${day}`
}


const todayKey =
  getMexicoDateKey(new Date())


const [
  todayYear,
  todayMonth,
  todayDay,
] = todayKey
  .split('-')
  .map(Number)


const todayAsUtc =
  new Date(
    Date.UTC(
      todayYear,
      todayMonth - 1,
      todayDay,
      12
    )
  )


const dayOfWeek =
  todayAsUtc.getUTCDay()


const mondayOffset =
  dayOfWeek === 0
    ? -6
    : 1 - dayOfWeek


const monday =
  new Date(todayAsUtc)

monday.setUTCDate(
  monday.getUTCDate() +
  mondayOffset
)


const dayLabels = [
  'L',
  'M',
  'M',
  'J',
  'V',
  'S',
  'D',
]


const weeklyActivity =
  Array.from(
    { length: 7 },
    (_, index) => {

      const date =
        new Date(monday)

      date.setUTCDate(
        monday.getUTCDate() +
        index
      )

      const key =
        date
          .toISOString()
          .slice(0, 10)


      const lessons =
        completedLessons.filter(
          (lesson) =>
            getMexicoDateKey(
              new Date(
                lesson.completedAt
              )
            ) === key
        ).length


      return {
        key,
        label: dayLabels[index],
        lessons,
      }
    }
  )


const activeDays =
  weeklyActivity.filter(
    (day) =>
      day.lessons > 0
  ).length


const weeklyLessons =
  weeklyActivity.reduce(
    (total, day) =>
      total + day.lessons,
    0
  )

const DAILY_GOAL = 3


const todayLessons =
  completedLessons.filter(
    (lesson) =>
      getMexicoDateKey(
        new Date(
          lesson.completedAt
        )
      ) === todayKey
  ).length


const dailyGoalProgress =
  Math.min(
    100,
    Math.round(
      (
        todayLessons /
        DAILY_GOAL
      ) * 100
    )
  )


const remainingDailyLessons =
  Math.max(
    0,
    DAILY_GOAL - todayLessons
  )


const dailyGoalCompleted =
  todayLessons >= DAILY_GOAL

  return (
    <div className="profile-page">

      <header className="profile-topbar">

        <Link
          to="/dashboard"
          className="profile-logo"
        >
          🐻

          <strong>
            oso<span>Coddy</span>
          </strong>
        </Link>


        <Link
          to="/dashboard"
          className="profile-back"
        >
          ← Volver al Dashboard
        </Link>

      </header>


      <main className="profile-main">

        <section className="profile-hero">

          <div className="profile-avatar">
            {user?.username
              ?.charAt(0)
              .toUpperCase() || 'C'}
          </div>


          <div className="profile-user-info">

            <span className="profile-label">
              👤 MI PERFIL
            </span>

            <h1>
              {user?.username ||
                'Programador'}
            </h1>

            <p>
              {user?.email || ''}
            </p>

          </div>

        </section>


        <section className="profile-stats">

          <article>
            <div className="profile-stat-icon">
              ⭐
            </div>

            <div>
              <span>
                Experiencia
              </span>

              <strong>
                {loading
                  ? '...'
                  : `${totalXp} XP`}
              </strong>
            </div>
          </article>


          <article>
            <div className="profile-stat-icon">
              🔥
            </div>

            <div>
              <span>
                Racha actual
              </span>

              <strong>
                {loading
                  ? '...'
                  : `${currentStreak} ${
                      currentStreak === 1
                        ? 'día'
                        : 'días'
                    }`}
              </strong>
            </div>
          </article>


          <article>
            <div className="profile-stat-icon">
              🏆
            </div>

            <div>
              <span>
                Mejor racha
              </span>

              <strong>
                {loading
                  ? '...'
                  : `${longestStreak} ${
                      longestStreak === 1
                        ? 'día'
                        : 'días'
                    }`}
              </strong>
            </div>
          </article>

        </section>

        <section className="profile-level">

          <div className="profile-level-icon">
            {levelInfo.currentLevel.icon}
          </div>

          <div className="profile-level-content">

            <span className="profile-level-label">
              NIVEL {levelInfo.currentLevel.level}
            </span>

            <h2>
              {levelInfo.currentLevel.name}
            </h2>

            {levelInfo.nextLevel ? (
              <>
                <div className="profile-level-progress-info">
                  <span>
                    {levelInfo.xpIntoLevel} / {levelInfo.xpNeeded} XP
                  </span>

                  <strong>
                    {levelInfo.progress}%
                  </strong>
                </div>

                <div className="profile-level-progress-bar">
                  <div
                    style={{
                      width: `${levelInfo.progress}%`,
                    }}
                  />
                </div>

                <p>
                  Siguiente nivel:{' '}
                  <strong>
                    {levelInfo.nextLevel.icon}{' '}
                    {levelInfo.nextLevel.name}
                  </strong>
                </p>
              </>
            ) : (
              <p>
                👑 Has alcanzado el nivel máximo.
              </p>
            )}

          </div>

        </section>

        <section className="profile-activity">

          <div className="profile-activity-header">

            <div>
              <span>
                📅 ACTIVIDAD
              </span>

              <h2>
                Esta semana
              </h2>
            </div>


            <div className="activity-days-count">
              <strong>
                {activeDays}/7
              </strong>

              <span>
                días activos
              </span>
            </div>

          </div>


          <div className="activity-week">

            {weeklyActivity.map(
              (day) => (

                <div
                  className={
                    day.key === todayKey
                      ? 'activity-day activity-day-today'
                      : 'activity-day'
                  }
                  key={day.key}
                >

                  <span className="activity-day-name">
                    {day.label}
                  </span>


                  <div
                    className={
                      day.lessons > 0
                        ? 'activity-dot activity-dot-active'
                        : 'activity-dot'
                    }
                  >
                    {day.lessons > 0
                      ? day.lessons
                      : ''}
                  </div>


                  <small>
                    {day.lessons === 1
                      ? '1 lección'
                      : `${day.lessons} lecciones`}
                  </small>

                </div>

              )
            )}

          </div>


          <div className="activity-summary">

            <div>
              <strong>
                {weeklyLessons}
              </strong>

              <span>
                lecciones esta semana
              </span>
            </div>


            <div>
              <strong>
                {activeDays}
              </strong>

              <span>
                días de estudio
              </span>
            </div>


            <div>
              <strong>
                🔥 {currentStreak}
              </strong>

              <span>
                racha actual
              </span>
            </div>

          </div>

        </section>

        <section className="profile-daily-goal">

          <div className="daily-goal-icon">
            {dailyGoalCompleted
              ? '✅'
              : '🎯'}
          </div>


          <div className="daily-goal-content">

            <div className="daily-goal-header">

              <div>
                <span>
                  META DIARIA
                </span>

                <h2>
                  {dailyGoalCompleted
                    ? '¡Meta completada!'
                    : 'Sigue avanzando'}
                </h2>
              </div>


              <strong>
                {todayLessons}/{DAILY_GOAL}
              </strong>

            </div>


            <div className="daily-goal-progress-info">

              <span>
                Lecciones completadas hoy
              </span>

              <strong>
                {dailyGoalProgress}%
              </strong>

            </div>


            <div className="daily-goal-progress-bar">

              <div
                style={{
                  width:
                    `${dailyGoalProgress}%`,
                }}
              />

            </div>


            <p>
              {dailyGoalCompleted ? (
                <>
                  🔥 Completaste tu meta de hoy.
                  ¡Excelente trabajo!
                </>
              ) : remainingDailyLessons === 1 ? (
                <>
                  Te falta solamente{' '}
                  <strong>
                    1 lección
                  </strong>{' '}
                  para completar tu meta.
                </>
              ) : (
                <>
                  Te faltan{' '}
                  <strong>
                    {remainingDailyLessons} lecciones
                  </strong>{' '}
                  para completar tu meta.
                </>
              )}
            </p>

          </div>

        </section>

        <section className="profile-achievements">

          <div className="achievements-header">

            <div>
              <span>
                🏅 TUS LOGROS
              </span>

              <h2>
                Mis logros
              </h2>

              <p>
                Sigue aprendiendo para
                desbloquear nuevas insignias.
              </p>
            </div>


            <div className="achievement-counter">

              <strong>
                {loading
                  ? '...'
                  : `${unlockedCount}/${achievements.length}`}
              </strong>

              <span>
                desbloqueados
              </span>

            </div>

          </div>


          <div className="achievements-progress-info">

            <span>
              Progreso de logros
            </span>

            <strong>
              {loading
                ? '...'
                : `${achievementProgress}%`}
            </strong>

          </div>


          <div className="achievements-progress-bar">

            <div
              style={{
                width:
                  `${achievementProgress}%`,
              }}
            />

          </div>


          <div className="achievements-grid">

            {achievements.map(
              (achievement) => {

                const unlocked =
                  unlockedCodes.has(
                    achievement.code
                  )

                const unlockedDate =
                  formatUnlockedDate(
                    achievement.code
                  )

                return (
                  <article
                    key={achievement.code}
                    className={
                      unlocked
                        ? 'achievement-card achievement-card-unlocked'
                        : 'achievement-card achievement-card-locked'
                    }
                  >

                    <div className="profile-achievement-icon">
                      {unlocked
                        ? achievement.icon
                        : '🔒'}
                    </div>


                    <div className="profile-achievement-content">

                      <span
                        className={
                          unlocked
                            ? 'achievement-status achievement-status-unlocked'
                            : 'achievement-status achievement-status-locked'
                        }
                      >
                        {unlocked
                          ? '✓ DESBLOQUEADO'
                          : 'BLOQUEADO'}
                      </span>


                      <h3>
                        {achievement.title}
                      </h3>


                      <p>
                        {achievement.description}
                      </p>


                      {unlocked &&
                        unlockedDate && (
                          <small>
                            Conseguido el{' '}
                            {unlockedDate}
                          </small>
                        )}

                    </div>

                  </article>
                )
              }
            )}

          </div>

        </section>

      </main>

    </div>
  )
}

export default Profile