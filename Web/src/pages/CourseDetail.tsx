import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { courseContents } from '../data/courseContent'
import {
  getMyProgress,
  type CompletedLesson,
} from '../services/api'
import './CourseDetail.css'

function CourseDetail() {
  const { slug } = useParams()

  const [completedLessons, setCompletedLessons] =
    useState<CompletedLesson[]>([])

  const [loadingProgress, setLoadingProgress] =
    useState(true)

  const [totalXp, setTotalXp] =
    useState(0)

  useEffect(() => {
  const loadProgress = async () => {
    try {
      const result = await getMyProgress()

      setCompletedLessons(
        result.completedLessons
      )

      setTotalXp(result.totalXp)

    } catch (error) {
      console.error(
        'Error cargando progreso:',
        error
      )
    } finally {
      setLoadingProgress(false)
    }
  }

  loadProgress()
}, [])

  const course = courseContents.find(
    (course) => course.slug === slug
  )

  if (!course) {
    return (
      <div className="course-not-found">
        <h1>Curso no encontrado 🐻</h1>

        <Link to="/courses">
          ← Regresar a cursos
        </Link>
      </div>
    )
  }

  const totalLessons = course.modules.reduce(
    (total, module) => total + module.lessons.length, 0
  )

  const courseCompletedLessons =
  completedLessons.filter(
    (lesson) =>
      lesson.courseSlug === course.slug
  )

  const completedCount =
    courseCompletedLessons.length

  const progressPercentage =
    totalLessons === 0
      ? 0
      : Math.round(
        (completedCount / totalLessons) * 100
      )

  const completedLessonIds = new Set(
    courseCompletedLessons.map(
      (lesson) => lesson.lessonId
    )
  )

  const courseXp =
    courseCompletedLessons.reduce(
      (total, lesson) =>
        total + lesson.xpEarned,
      0
    )

  const allLessons =
    course.modules.flatMap(
      (module) => module.lessons
    )

  const nextLesson =
    allLessons.find(
      (lesson) =>
        !completedLessonIds.has(lesson.id)
    )

  const courseFinished =
    totalLessons > 0 &&
    completedCount === totalLessons

  return (
    <div className="course-detail-page">

      <header className="course-detail-nav">

        <Link to="/courses">
          ← Cursos
        </Link>

        <Link
          to="/dashboard"
          className="course-detail-logo"
        >
          🐻 oso<span>Coddy</span>
        </Link>

      </header>

      <main className="course-detail-container">

        <section className="course-detail-hero">

          <div className="course-detail-icon">
            {course.icon}
          </div>

          <div>
            <span className="course-small-title">
              CURSO
            </span>

            <h1>
              {course.name}
            </h1>

            <p>
              {course.description}
            </p>

            <div className="course-detail-info">
              <span>
                📚 {totalLessons} lecciones
              </span>

              <span>
                📦 {course.modules.length} módulos
              </span>

              <span>
                ⭐ {courseXp} XP del curso
              </span>

              <span>
                🏆 {totalXp} XP total
              </span>
            </div>
          </div>

        </section>

        <div className="course-progress">
          <div className="course-progress-header">
            <span>Tu progreso</span>

            <strong>
              {loadingProgress
                ? '...'
                : `${progressPercentage}%`}
            </strong>
          </div>

          <div className="course-progress-track">
            <div
              className="course-progress-value"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>
        </div>

        <div className="course-next-action">
          {courseFinished ? (
            <div className="course-completed-message">
              🏆 ¡Curso completado!
            </div>
          ) : nextLesson ? (
            <Link
              to={`/courses/${course.slug}/lessons/${nextLesson.id}`}
              className="continue-course-button"
            >
              Continuar: {nextLesson.title}
              <span>→</span>
            </Link>
          ) : null}
        </div>

        <section className="modules-section">

          <div className="modules-heading">
            <span>CONTENIDO</span>

            <h2>
              Módulos del curso
            </h2>
          </div>

          <div className="modules-list">

          {course.modules.map((module, moduleIndex) => {
            const moduleCompletedCount =
              module.lessons.filter(
                (lesson) =>
                  completedLessonIds.has(lesson.id)
              ).length

            const moduleFinished =
              moduleCompletedCount ===
              module.lessons.length

            return (
              <article
                className="module-card"
                key={module.id}
              >

                <div className="module-header">

                  <div className="module-number">
                    {moduleIndex + 1}
                  </div>

                  <div>
                    <span>
                      MÓDULO {moduleIndex + 1}
                    </span>

                    <h3>
                      {module.title}
                    </h3>

                    <p>
                      {module.description}
                    </p>

                    <div className="module-progress-info">
                      <span>
                        {moduleCompletedCount}/
                        {module.lessons.length} lecciones
                      </span>

                      {moduleFinished && (
                        <strong>
                          ✅ Módulo completado
                        </strong>
                      )}
                    </div>

                  </div>

                </div>

                <div className="lessons-list">

                  {module.lessons.map(
                    (lesson, lessonIndex) => (

                      <Link
                        to={`/courses/${course.slug}/lessons/${lesson.id}`}
                        className="lesson-row"
                        key={lesson.id}
                      >

                        <div className="lesson-left">

                          <span className="lesson-status">
                            {completedLessonIds.has(lesson.id)
                              ? '✅'
                              : '○'}
                          </span>

                          <div>
                            <small>
                              LECCIÓN {lessonIndex + 1}
                            </small>

                            <strong>
                              {lesson.title}
                            </strong>
                          </div>

                        </div>

                        <span className="lesson-arrow">
                          →
                        </span>

                      </Link>

                    )
                  )}

                </div>

              </article>
            )
          })}

          </div>

        </section>

      </main>

    </div>
  )
}

export default CourseDetail