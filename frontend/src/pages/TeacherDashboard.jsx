// src/pages/TeacherDashboard.jsx
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses, createCourse } from '../Slices/courseSlice'
import { Link } from 'react-router-dom'
import API from '../services/api'

function TeacherDashboard() {
  const dispatch = useDispatch()
  const { courses, loading } = useSelector(state => state.courses)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [pdfFile, setPdfFile] = useState(null)
  const [fileName, setFileName] = useState('Aucun fichier choisi')
  const [quizResults, setQuizResults] = useState({})

  useEffect(() => { dispatch(fetchCourses()) }, [dispatch])

  const loadQuizResults = async (quizId) => {
    if (quizResults[quizId]) return
    try {
      const res = await API.get(`/teacher/quizzes/${quizId}/results`)
      setQuizResults(prev => ({ ...prev, [quizId]: res.data.results || [] }))
    } catch { /* empty */ }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      setPdfFile(file)
      setFileName(file.name)
    } else {
      setPdfFile(null)
      setFileName('PDF uniquement')
      alert('PDF uniquement !')
    }
  }

  const handleCreateCourse = async (e) => {
    e.preventDefault()
    if (!pdfFile) return alert('PDF obligatoire')

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('pdf', pdfFile)

    try {
      await dispatch(createCourse(formData)).unwrap()
      setTitle(''); setDescription(''); setPdfFile(null); setFileName('Aucun fichier choisi')
    } catch (err) { console.error(err) }
  }

  return (
    <div className="min-vh-100 bg-white">
      <div className="container py-5">

        {/* Titre principal */}
        <div className="text-center mb-5 pt-3">
          <h1 className="display-5 fw-bold text-dark mb-2">Espace Enseignant</h1>
          <p className="lead text-muted">Créez vos cours et suivez les progrès de vos étudiants</p>
        </div>

        {/* === Création de cours – BLEU PASTEL === */}
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-5">
          <div className="card-header text-white text-center py-4"
               style={{ background: 'linear-gradient(135deg, #a0d8ef 0%, #bbdcfe 100%)' }}>
            <h3 className="mb-0 fw-bold">Créer un Nouveau Cours</h3>
          </div>
          <div className="card-body p-5 bg-white">
            <form onSubmit={handleCreateCourse}>
              <div className="mb-4">
                <label className="form-label fw-semibold">Titre du cours</label>
                <input
                  type="text"
                  className="form-control form-control-lg rounded-pill border-0 shadow-sm bg-light"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Mathématiques Terminale"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">Description</label>
                <textarea
                  className="form-control rounded-4 border-0 shadow-sm bg-light"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez votre cours..."
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">PDF du cours (obligatoire)</label>
                <input
                  type="file" accept=".pdf"
                  className="form-control form-control-lg rounded-pill shadow-sm"
                  onChange={handleFileChange}
                  required
                />
                <div className="form-text text-muted mt-2">{fileName}</div>
              </div>
              <button
                type="submit"
                className="btn w-100 rounded-pill fw-bold text-white shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, #a0d8ef 0%, #6ab7ff 100%)',
                  height: '56px'
                }}
                disabled={loading}
              >
                {loading ? 'Création...' : 'Publier le Cours'}
              </button>
            </form>
          </div>
        </div>

        {/* === Mes Cours === */}
        <h2 className="text-center fw-bold text-dark mb-5">Mes Cours ({courses.length})</h2>

        <div className="row g-4">
          {courses.length === 0 ? (
            <div className="col-12 text-center py-5">
              <div className="bg-white rounded-4 shadow p-5">
                <i className="bi bi-journal-text display-1 text-muted opacity-20 mb-4"></i>
                <h4 className="text-muted">Aucun cours pour le moment</h4>
                <p className="text-muted">Créez votre premier cours ci-dessus</p>
              </div>
            </div>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 rounded-4 overflow-hidden shadow-lg hover-lift"
                     style={{ transition: 'all 0.3s ease' }}
                     onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                     onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {/* Header du cours – VERT PASTEL */}
                  <div className="text-white text-center py-4"
                       style={{ background: 'linear-gradient(135deg, #a8e6cf 0%, #dcedc1 100%)' }}>
                    <h5 className="mb-0 fw-bold">{course.title}</h5>
                  </div>

                  <div className="card-body d-flex flex-column bg-white">
                    <p className="text-muted small flex-grow-1 mb-4">
                      {course.description || 'Aucune description'}
                    </p>

                    {course.pdf_url ? (
                      <a href={course.pdf_url} target="_blank" rel="noopener noreferrer"
                         className="btn btn-outline-success btn-sm rounded-pill mb-3">
                        Voir le PDF
                      </a>
                    ) : (
                      <span className="text-danger small mb-3">PDF manquant</span>
                    )}

                    <Link to={`/teacher/courses/${course.id}/create-quiz`}
                          className="btn rounded-pill mb-4 shadow-sm fw-bold text-white"
                          style={{ background: 'linear-gradient(135deg, #a0d8ef 0%, #6ab7ff 100%)' }}>
                      Créer un Quiz
                    </Link>

                    {/* Quizzes */}
                    {course.quizzes?.length > 0 ? (
                      <div className="mt-auto">
                        <div className="border-top pt-3">
                          <h6 className="fw-semibold text-secondary small mb-3">
                            Quizzes ({course.quizzes.length})
                          </h6>
                          {course.quizzes.map((quiz) => (
                            <div key={quiz.id} className="bg-light rounded-3 p-3 mb-3 border"
                                 onMouseEnter={() => loadQuizResults(quiz.id)}>
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <strong className="text-primary small">{quiz.title}</strong>
                                <Link to={`/teacher/quiz-results/${quiz.id}`}
                                      className="btn btn-success btn-sm rounded-pill px-3">
                                  Résultats
                                </Link>
                              </div>

                              {quizResults[quiz.id]?.length > 0 ? (
                                <div className="small text-muted">
                                  {quizResults[quiz.id].slice(0, 3).map((r) => (
                                    <div key={r.student_id} className="d-flex justify-content-between py-1">
                                      <span>{r.student_name}</span>
                                      <span className={`badge rounded-pill ${
                                        r.percentage >= 50 ? 'bg-success' : 'bg-danger'
                                      }`}>
                                        {r.score}/{r.total}
                                      </span>
                                    </div>
                                  ))}
                                  {quizResults[quiz.id].length > 3 && (
                                    <div className="text-center mt-1 small">+ {quizResults[quiz.id].length - 3} autres</div>
                                  )}
                                </div>
                              ) : (
                                <p className="text-muted small mb-0">Aucun résultat</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-center text-muted small mt-3">Aucun quiz créé</p>
                    )}
                  </div>

                  <div className="card-footer bg-white text-center text-muted small border-top-0">
                    Créé le {new Date(course.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Crédit */}
        <div className="text-center mt-5 text-muted">
          <small>© {new Date().getFullYear()} • Plateforme d'enseignement</small>
        </div>
      </div>

      {/* Hover lift animation */}
      <style jsx>{`
        .hover-lift:hover {
          transform: translateY(-10px) !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important;
        }
      `}</style>
    </div>
  )
}

export default TeacherDashboard