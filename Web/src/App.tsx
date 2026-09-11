import { Routes, Route } from 'react-router-dom'
import CourseDetail from './pages/CourseDetail'
import LessonDetail from './pages/LessonDetail'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/courses"
        element={<Courses />}
      />

      <Route
        path="/courses/:slug"
        element={<CourseDetail />}
      />

      <Route
        path="/courses/:slug/lessons/:lessonId"
        element={<LessonDetail />}
      />

      <Route element={<ProtectedRoute />}>

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

      </Route>

      <Route
        path="*"
        element={<NotFound />}
      />


    </Routes>
  )
}

export default App