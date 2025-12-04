// src/pages/CoursePage.jsx
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import API from '../services/api'

export default function CoursePage() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [quizzes, setQuizzes] = useState([])

  useEffect(() => {
    API.get(`/courses/${id}`).then(res => setCourse(res.data))
    API.get(`/courses/${id}/quizzes`)
      .then(res => setQuizzes(res.data))
      .catch(() => setQuizzes([]))
  }, [id])

  if (!course) {
    return (
      <div className="min-vh-100 bg-white d-flex align-items-center justify-content-center">
        <div className="spinner-border" style={{ width: '4rem', height: '4rem', color: '#81d4fa' }}></div>
      </div>
    )
  }

  return (
    <div className="min-vh-100 bg-white">
      <div className="container py-5 py-lg-6">

        {/* Titre principal */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-dark mb-3">{course.title}</h1>
          <p className="lead text-muted fs-5">{course.description}</p>
        </div>

        {/* Carte principale – Style capture d'écran */}
        <div className="mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="bg-white rounded-4 border" style={{ borderColor: '#e0e0e0', overflow: 'hidden' }}>

            {/* Header bleu ciel */}
            <div className="text-center py-5" style={{ backgroundColor: '#81d4fa' }}>
              <h3 className="mb-0 fw-bold text-white fs-2">Contenu du cours</h3>
            </div>

            <div className="p-5 p-lg-6">

              {/* Bouton PDF – Vert menthe */}
              {course.pdf_url ? (
                <div className="text-center mb-5">
                  <a
                    href={course.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn rounded-pill fw-bold text-white px-5"
                    style={{
                      backgroundColor: '#94e6b0',
                      height: '64px',
                      fontSize: '1.25rem',
                      minWidth: '280px'
                    }}
                  >
                    Télécharger le PDF du cours
                  </a>
                </div>
              ) : (
                <p className="text-center text-muted fs-5 mb-5">Aucun PDF disponible</p>
              )}

              {/* Section Quizzes */}
              <h4 className="text-center fw-bold text-dark mb-5 fs-4">
                Quizzes disponibles
              </h4>

              {quizzes.length === 0 ? (
                <div className="text-center py-6">
                  <div className="bg-light rounded-4 py-5 px-4" style={{ border: '2px dashed #ddd' }}>
                    <i className="bi bi-journal-text display-1 text-muted opacity-20 mb-4"></i>
                    <p className="lead text-muted mb-0">Aucun quiz pour le moment</p>
                  </div>
                </div>
              ) : (
                <div className="row g-4 justify-content-center">
                  {quizzes.map((quiz) => (
                    <div key={quiz.id} className="col-md-6 col-lg-5">
                      <div
                        className="h-100 rounded-4 p-4 border-0 text-center"
                        style={{ backgroundColor: '#fff9c4' }}
                      >
                        <h5 className="fw-bold text-primary mb-3">{quiz.title}</h5>
                        <p className="text-muted small mb-4">
                          Date limite :<br />
                          <strong className="text-dark">
                            {new Date(quiz.deadline).toLocaleDateString('fr-FR')}
                          </strong> à {new Date(quiz.deadline).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <Link
                          to={`/quizzes/${quiz.id}`}
                          className="btn rounded-pill fw-bold text-white w-100"
                          style={{
                            backgroundColor: '#81d4fa',
                            height: '56px',
                            fontSize: '1.1rem'
                          }}
                        >
                          Passer le quiz
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bouton retour au tableau de bord – Style capture */}
          <div className="text-center mt-5">
            <Link
              to="/student"
              className="btn rounded-pill fw-bold px-5"
              style={{
                backgroundColor: 'white',
                color: '#40c4ff',
                border: '2px solid #81d4fa',
                height: '56px',
                fontSize: '1.1rem',
                minWidth: '240px'
              }}
            >
              Retour au tableau de bord
            </Link>
          </div>

          {/* Crédit */}
          <div className="text-center mt-5 text-muted small">
            © {new Date().getFullYear()} • Plateforme d’enseignement moderne
          </div>
        </div>
      </div>
    </div>
  )
}