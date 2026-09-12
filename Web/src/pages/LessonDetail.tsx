import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { courseContents } from '../data/courseContent'
import { lessonContents } from '../data/lessonContent'
import {
  getLevelFromXp,
  type LevelDefinition,
} from '../data/levels'
import {
  completeLesson,
  getMyProgress,
  checkChallenge,
  type UnlockedAchievement,
} from '../services/api'
import { runPythonInBrowser } from '../services/pythonRunner'
import './LessonDetail.css'

interface LevelUpInfo {
  previousLevel: LevelDefinition
  currentLevel: LevelDefinition
}

function LessonDetail() {

  const [unlockedAchievements, setUnlockedAchievements] =
    useState<UnlockedAchievement[]>([])

  const [levelUpInfo, setLevelUpInfo] =
  useState<LevelUpInfo | null>(null)

  const [checkingChallenge, setCheckingChallenge] =
    useState(false)

  const [runningCode, setRunningCode] = useState(false)

  const [codeOutput, setCodeOutput] = useState('')

  const [codeError, setCodeError] = useState('')

  const [codeExecutedSuccessfully, setCodeExecutedSuccessfully] =
    useState(false)

  const [challengeCode, setChallengeCode] = useState('')

  const [challengePassed, setChallengePassed] = useState(false)

  const [challengeProof, setChallengeProof] =
    useState<string | null>(null)

  const [challengeFeedback, setChallengeFeedback] = useState('')

  const [loading, setLoading] = useState(false)

  const [completed, setCompleted] = useState(false)

  const [message, setMessage] = useState('')

  const [error, setError] = useState('')

  const { slug, lessonId } = useParams()

  const lessonNumber = Number(lessonId)

  const course = courseContents.find(
  (course) => course.slug === slug
)

const lesson = lessonContents.find(
  (lesson) =>
    lesson.courseSlug === slug &&
    lesson.lessonId === lessonNumber
)

useEffect(() => {
  setChallengeCode(
    lesson?.challenge?.starterCode ?? ''
  )

  // Reiniciar reto
  setChallengePassed(false)
  setChallengeProof(null)
  setChallengeFeedback('')

  // Reiniciar terminal
  setCodeOutput('')
  setCodeError('')
  setCodeExecutedSuccessfully(false)

  // Reiniciar mensaje
  setMessage('')
  setError('')

  // Reiniciar estado de lección
  setCompleted(false)

  // Reiniciar posibles modales anteriores
  setUnlockedAchievements([])
  setLevelUpInfo(null)
}, [lesson])

useEffect(() => {
  const checkProgress = async () => {
    if (!course || !lesson) {
      return
    }

    try {
      const result = await getMyProgress()

      const isCompleted =
        result.completedLessons.some(
          (completedLesson) =>
            completedLesson.courseSlug ===
              course.slug &&
            completedLesson.lessonId ===
              lesson.lessonId
        )

      setCompleted(isCompleted)
    } catch (error) {
      console.error(error)
    }
  }

  checkProgress()
}, [course, lesson])

  if (!course || !lesson) {
    return (
      <div className="lesson-not-found">
        <h1>Lección no encontrada 🐻</h1>

        <Link to="/courses">
          ← Regresar a cursos
        </Link>
      </div>
    )
  }

  const handleCompleteLesson = async () => {
  setLoading(true)
  setMessage('')
  setError('')

  try {
    const result = await completeLesson(
      course.slug,
      lesson.lessonId,
      challengeProof
    )

    /*
     * Guardamos los nuevos logros.
     */
    if (
      result.newAchievements &&
      result.newAchievements.length > 0
    ) {
      setUnlockedAchievements(
        result.newAchievements
      )
    }


    setCompleted(true)
    setMessage(result.message)


    const totalXp =
      result.totalXp ?? result.xp


    /*
     * =========================================
     * ✨ DETECTAR SUBIDA DE NIVEL
     * =========================================
     *
     * El backend nos dice:
     *
     * totalXp  = XP después de completar
     * xpEarned = XP ganado en esta lección
     *
     * Por eso podemos reconstruir
     * cuántos XP tenía antes.
     */
    if (
      !result.alreadyCompleted &&
      typeof totalXp === 'number' &&
      typeof result.xpEarned === 'number'
    ) {
      const previousXp =
        totalXp - result.xpEarned

      const previousLevel =
        getLevelFromXp(
          previousXp
        ).currentLevel

      const currentLevel =
        getLevelFromXp(
          totalXp
        ).currentLevel


      /*
       * Si el número de nivel cambió,
       * mostramos el modal.
       */
      if (
        currentLevel.level >
        previousLevel.level
      ) {
        setLevelUpInfo({
          previousLevel,
          currentLevel,
        })
      }
    }


    /*
     * Actualizamos también el XP
     * guardado en localStorage.
     */
    const storedUser =
      localStorage.getItem(
        'osocoddy_user'
      )

    if (
      storedUser &&
      typeof totalXp === 'number'
    ) {
      const user =
        JSON.parse(storedUser)

      user.xp = totalXp

      localStorage.setItem(
        'osocoddy_user',
        JSON.stringify(user)
      )
    }

  } catch (err) {

    if (err instanceof Error) {
      setError(err.message)
    } else {
      setError(
        'Ocurrió un error inesperado.'
      )
    }

  } finally {

    setLoading(false)

  }
}

const handleCheckChallenge = async () => {
  if (!lesson.challenge) {
    return
  }


  /*
   * El código primero debe haberse
   * ejecutado correctamente.
   */
  if (!codeExecutedSuccessfully) {
    setChallengePassed(false)
    setChallengeProof(null)

    setChallengeFeedback(
      'Primero ejecuta tu código sin errores.'
    )

    return
  }


  setCheckingChallenge(true)

  /*
   * Limpiamos posibles errores anteriores.
   */
  setCodeError('')


  try {

    /*
     * Los retos de Python 1 al 12
     * son evaluados por ASP.NET.
     */
    if (
      course.slug === 'python' &&
      lesson.lessonId >= 1 &&
      lesson.lessonId <= 12
    ) {

      const result =
        await checkChallenge(
          course.slug,
          lesson.lessonId,
          challengeCode
        )


      /*
       * ======================================
       * RETO CORRECTO
       * ======================================
       */
      if (result.correct) {

        /*
         * Si el backend dice que está correcto,
         * también debe mandarnos el proof.
         */
        if (!result.proof) {

          setChallengePassed(false)
          setChallengeProof(null)

          setChallengeFeedback(
            'El reto fue correcto, pero no se pudo generar la prueba de validación.'
          )

          return
        }


        /*
         * Guardamos la aprobación y el proof.
         */
        setChallengePassed(true)
        setChallengeProof(
          result.proof
        )

      } else {

        /*
         * ======================================
         * RETO INCORRECTO
         * ======================================
         */
        setChallengePassed(false)
        setChallengeProof(null)

      }


      setChallengeFeedback(
        result.message
      )


      if (result.error) {
        setCodeError(
          result.error
        )
      }


      return
    }


    /*
     * Otros cursos todavía
     * no tienen juez.
     */
    setChallengePassed(false)
    setChallengeProof(null)

    setChallengeFeedback(
      'Este reto todavía no tiene un juez disponible.'
    )


  } catch (error) {

    /*
     * Si ocurre cualquier error,
     * eliminamos también el proof.
     */
    setChallengePassed(false)
    setChallengeProof(null)


    if (error instanceof Error) {

      setChallengeFeedback(
        error.message
      )

    } else {

      setChallengeFeedback(
        'No fue posible comprobar el reto.'
      )

    }


  } finally {

    setCheckingChallenge(false)

  }
}

const handleRunCode = async () => {
  setRunningCode(true)

  setCodeOutput('')
  setCodeError('')
  setCodeExecutedSuccessfully(false)

  try {
    const result = await runPythonInBrowser(
      challengeCode
    )

    setCodeOutput(result.output)

    if (result.success) {
      setCodeExecutedSuccessfully(true)
    } else {
      setCodeError(
        result.error ||
        'El código terminó con un error.'
      )
    }
  } catch (err) {
    if (err instanceof Error) {
      setCodeError(err.message)
    } else {
      setCodeError(
        'Ocurrió un error inesperado.'
      )
    }
  } finally {
    setRunningCode(false)
  }
}

  return (
    <div className="lesson-page">

      <header className="lesson-navbar">

        <Link to={`/courses/${course.slug}`}>
          ← {course.name}
        </Link>

        <Link
          to="/dashboard"
          className="lesson-logo"
        >
          🐻 oso<span>Coddy</span>
        </Link>

      </header>

      <main className="lesson-container">

        <section className="lesson-header">

          <div className="lesson-course-icon">
            {course.icon}

            {levelUpInfo && (
              <div className="level-up-overlay">

                <div className="level-up-modal">

                  <span className="level-up-label">
                    ✨ SUBISTE DE NIVEL
                  </span>


                  <div className="level-up-main-icon">
                    {levelUpInfo.currentLevel.icon}
                  </div>


                  <span className="level-up-number">
                    NIVEL {levelUpInfo.currentLevel.level}
                  </span>


                  <h2>
                    {levelUpInfo.currentLevel.name}
                  </h2>


                  <p className="level-up-message">
                    ¡Tu progreso está dando frutos!
                    Has alcanzado un nuevo rango.
                  </p>


                  <div className="level-up-change">

                    <span>
                      {levelUpInfo.previousLevel.icon}{' '}
                      {levelUpInfo.previousLevel.name}
                    </span>

                    <strong>
                      →
                    </strong>

                    <span className="level-up-new">
                      {levelUpInfo.currentLevel.icon}{' '}
                      {levelUpInfo.currentLevel.name}
                    </span>

                  </div>


                  <button
                    type="button"
                    className="level-up-close"
                    onClick={() =>
                      setLevelUpInfo(null)
                    }
                  >
                    Continuar 🐻
                  </button>

                </div>

              </div>
            )}

            {unlockedAchievements.length > 0 &&
              !levelUpInfo && (
              <div className="achievement-overlay">

                <div className="achievement-modal">

                  <span className="achievement-label">
                    🏆 LOGRO DESBLOQUEADO
                  </span>

                  <h2>
                    ¡Felicidades!
                  </h2>

                  <p className="achievement-intro">
                    Acabas de conseguir
                    {unlockedAchievements.length > 1
                      ? ' nuevos logros.'
                      : ' un nuevo logro.'}
                  </p>


                  <div className="achievement-list">

                    {unlockedAchievements.map(
                      (achievement) => (

                        <article
                          className="achievement-item"
                          key={achievement.code}
                        >

                          <div className="achievement-icon">
                            {achievement.icon}
                          </div>

                          <div>
                            <h3>
                              {achievement.title}
                            </h3>

                            <p>
                              {achievement.description}
                            </p>
                          </div>

                        </article>

                      )
                    )}

                  </div>


                  <button
                    type="button"
                    className="achievement-close"
                    onClick={() =>
                      setUnlockedAchievements([])
                    }
                  >
                    ¡Genial! 🐻
                  </button>

                </div>

              </div>
            )}

          </div>

          <div>
            <span className="lesson-label">
              {course.name.toUpperCase()} · LECCIÓN {lesson.lessonId}
            </span>

            <h1>
              {lesson.title}
            </h1>

            <p>
              {lesson.description}
            </p>
          </div>

        </section>

        <section className="lesson-content">

          <article className="lesson-section">

            <span className="lesson-section-label">
              📖 TEORÍA
            </span>

            <h2>
              Entendiendo el concepto
            </h2>

            {lesson.theory.map((paragraph, index) => (
              <p key={index}>
                {paragraph}
              </p>
            ))}

          </article>

          {lesson.code && (
            <article className="lesson-section">

              <span className="lesson-section-label">
                💻 EJEMPLO
              </span>

              <h2>
                Veámoslo en código
              </h2>

              <div className="lesson-code">

                <div className="lesson-code-header">
                  <span></span>
                  <span></span>
                  <span></span>

                  <small>
                    main.py
                  </small>
                </div>

                <pre>
                  <code>
                    {lesson.code}
                  </code>
                </pre>

              </div>

            </article>
          )}

          {lesson.challenge && (
            <article className="lesson-challenge">

              <div className="challenge-heading">
                <div className="challenge-icon">
                  🧠
                </div>

                <div>
                  <span>MINI RETO</span>

                  <h2>
                    Ahora inténtalo tú
                  </h2>

                  <p>
                    {lesson.challenge.instructions}
                  </p>
                </div>
              </div>


              <div className="challenge-editor">

                <div className="challenge-editor-header">
                  <span />
                  <span />
                  <span />

                  <small>
                    reto.py
                  </small>
                </div>

                <textarea
                  value={challengeCode}
                  onChange={(event) => {
                    setChallengeCode(event.target.value)

                    setChallengePassed(false)
                    setChallengeProof(null)
                    setChallengeFeedback('')

                    setCodeOutput('')
                    setCodeError('')
                    setCodeExecutedSuccessfully(false)
                  }}
                  spellCheck={false}
                />

              </div>


              <div className="challenge-actions">

                <button
                  type="button"
                  className="run-code-button"
                  onClick={handleRunCode}
                  disabled={runningCode}
                >
                  {runningCode
                    ? 'Ejecutando...'
                    : '▶ Ejecutar código'}
                </button>

                <button
                  type="button"
                  className="check-challenge-button"
                  onClick={handleCheckChallenge}
                  disabled={!codeExecutedSuccessfully || checkingChallenge}
                >
                  {checkingChallenge
                    ? 'Comprobando...'
                    : 'Comprobar respuesta'}
                </button>

              </div>


              <div className="challenge-terminal">

                <div className="terminal-header">
                  <span>TERMINAL</span>

                  <small>
                    Python 3.13
                  </small>
                </div>

                <div className="terminal-content">

                  {!codeOutput && !codeError && !codeExecutedSuccessfully && (
                    <span className="terminal-placeholder">
                      Ejecuta tu código para ver el resultado...
                    </span>
                  )}

                  {codeExecutedSuccessfully && !codeOutput && !codeError &&(
                    <span className="terminal-success">
                      ✓ Código ejecutado correctamente sin salida.
                    </span>
                  )}

                  {codeOutput && (
                    <pre className="terminal-output">
                      {codeOutput}
                    </pre>
                  )}

                  {codeError && (
                    <pre className="terminal-error">
                      {codeError}
                    </pre>
                  )}

                </div>

              </div>


              {challengeFeedback && (
                <p
                  className={
                    challengePassed
                      ? 'challenge-correct'
                      : 'challenge-incorrect'
                  }
                >
                  {challengePassed ? '✅ ' : '💡 '}
                  {challengeFeedback}
                </p>
              )}

            </article>
          )}

          <section className="lesson-finish">

            <div>
              <span>
                ⭐ RECOMPENSA
              </span>

              <h2>
                +{lesson.xp} XP
              </h2>

              <p>
                Completa esta lección para continuar avanzando.
              </p>
            </div>

            {message && (
              <p className="lesson-success">
                ✅ {message}
              </p>
            )}

            {error && (
              <p className="lesson-error">
                {error}
              </p>
            )}

            <button
              type="button"
              className="complete-lesson-button"
              onClick={handleCompleteLesson}
              disabled={ loading || completed ||
                (
                  Boolean(lesson.challenge) &&
                  !challengePassed
                )
              }
            >
              {loading
                ? 'Guardando...'
                : completed
                  ? '✅ Lección completada'
                  : lesson.challenge && !challengePassed
                    ? '🔒 Resuelve el mini reto'
                    : `Completar lección +${lesson.xp} XP`}
            </button>

          </section>

        </section>

      </main>

    </div>
  )
}

export default LessonDetail