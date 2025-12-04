// src/App.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// Composants
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import TeacherDashboard from './pages/TeacherDashboard'
import StudentDashboard from './pages/StudentDashboard'
import CoursePage from './pages/CoursePage'
import QuizTake from './pages/QuizTake'
import CreateQuiz from './pages/CreateQuiz'

// LA LIGNE QUI MANQUAIT !
import TeacherQuizResults from './pages/TeacherQuizResults'   // AJOUTÉ ICI

function App() {
  const { token, user } = useSelector(state => state.auth)

  // Route protégée (optionnelle mais propre)
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!token) return <Navigate to="/login" replace />
    if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/" replace />
    return children
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Auth */}
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/" replace />} />
          <Route path="/signup" element={!token ? <Signup /> : <Navigate to="/" replace />} />

          {/* Profil */}
          <Route
            path="/profile"
            element={token ? <Profile /> : <Navigate to="/login" replace />}
          />

          {/* Dashboards */}
          <Route
            path="/teacher"
            element={
              token && user?.role === 'teacher'
                ? <TeacherDashboard />
                : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/student"
            element={
              token && user?.role === 'student'
                ? <StudentDashboard />
                : <Navigate to="/login" replace />
            }
          />

          {/* Cours & Quiz */}
          <Route
            path="/courses/:id"
            element={token ? <CoursePage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/quizzes/:id"
            element={token ? <QuizTake /> : <Navigate to="/login" replace />}
          />

          {/* Création de quiz */}
          <Route
            path="/teacher/courses/:courseId/create-quiz"
            element={
              token && user?.role === 'teacher'
                ? <CreateQuiz />
                : <Navigate to="/login" replace />
            }
          />

          {/* RÉSULTATS DU QUIZ (enseignant) */}
          <Route
            path="/teacher/quiz-results/:quizId"
            element={
              token && user?.role === 'teacher'
                ? <TeacherQuizResults />
                : <Navigate to="/login" replace />
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  )
}

export default App