// src/pages/StudentDashboard.jsx
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses } from '../Slices/courseSlice'
import { Link } from 'react-router-dom'

function StudentDashboard() {
  const dispatch = useDispatch()
  const { courses, loading } = useSelector(state => state.courses)

  useEffect(() => {
    dispatch(fetchCourses())
  }, [dispatch])

  return (
    <div className="min-vh-100 bg-white">
      <div className="container py-5">

        {/* Titre principal */}
        <div className="text-center mb-5 pt-3">
          <h1 className="display-5 fw-bold text-dark mb-2">Mes Cours Disponibles</h1>
          <p className="lead text-muted">Accédez à vos supports et quizzes</p>
        </div>

        {/* Chargement */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        )}

        {/* Aucun cours */}
        {!loading && courses.length === 0 && (
          <div className="text-center py-5">
            <div className="bg-light rounded-4 p-5 border">
              <i className="bi bi-journal-text display-1 text-muted opacity-20 mb-4"></i>
              <h4 className="text-muted">Aucun cours disponible</h4>
              <p className="text-muted">Revenez bientôt !</p>
            </div>
          </div>
        )}

        {/* Liste des cours – SANS OMBRE */}
        {!loading && courses.length > 0 && (
          <div className="row g-4">
            {courses.map((course) => (
              <div key={course.id} className="col-md-6 col-lg-4">
                <div
                  className="card h-100 border-0 rounded-4 overflow-hidden"
                  style={{
                    background: 'white',
                    border: '1px solid #f0f0f0',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {/* Header vert pastel */}
                  <div
                    className="text-white text-center py-4"
                    style={{ background: 'linear-gradient(135deg, #a8e6cf 0%, #dcedc1 100%)' }}
                  >
                    <h5 className="mb-0 fw-bold">{course.title}</h5>
                  </div>

                  <div className="card-body d-flex flex-column p-4">
                    <p className="text-muted small flex-grow-1 mb-4">
                      {course.description || 'Aucune description'}
                    </p>

                    {/* PDF */}
                    {course.pdf_url ? (
                      <a
                        href={course.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-success rounded-pill mb-3 fw-bold"
                        style={{ height: '48px' }}
                      >
                        Ouvrir le PDF
                      </a>
                    ) : (
                      <div className="text-center text-muted small mb-3">
                        PDF non disponible
                      </div>
                    )}

                    {/* Bouton principal – bleu pastel */}
                    <Link
                      to={`/courses/${course.id}`}
                      className="btn rounded-pill fw-bold text-white mt-auto"
                      style={{
                        background: 'linear-gradient(135deg, #a0d8ef 0%, #6ab7ff 100%)',
                        height: '52px'
                      }}
                    >
                      Accéder au cours
                    </Link>
                  </div>

                  <div className="card-footer bg-white text-center text-muted small border-top">
                    Par <strong>{course.teacher?.name || 'Enseignant'}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Crédit */}
        <div className="text-center mt-5 text-muted">
          <small>© {new Date().getFullYear()} • Plateforme d’enseignement</small>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard