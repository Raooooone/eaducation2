// src/pages/CreateQuiz.jsx
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../services/api'

export default function CreateQuiz() {
  const { courseId } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [deadline, setDeadline] = useState('')
  const [questions, setQuestions] = useState([
    { question_text: '', options: ['', '', '', ''], correct_option: 0 }
  ])

  const addQuestion = () => {
    setQuestions([...questions, { question_text: '', options: ['', '', '', ''], correct_option: 0 }])
  }

  const updateQuestion = (index, field, value, optionIndex = null) => {
    const updated = [...questions]
    if (optionIndex !== null) {
      updated[index].options[optionIndex] = value
    } else if (field === 'correct_option') {
      updated[index].correct_option = value
    } else {
      updated[index][field] = value
    }
    setQuestions(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !deadline) return alert('Titre et date limite obligatoires')

    const payload = {
      title: title.trim(),
      deadline,
      course_id: Number(courseId),
      questions: questions.map(q => ({
        question_text: q.question_text.trim(),
        options: q.options.map(o => o.trim()),
        correct_option: q.correct_option
      }))
    }

    try {
      await API.post('/quizzes', payload)
      alert('Quiz créé avec succès !')
      navigate('/teacher')
    } catch (err) {
      console.error('Erreur →', err.response?.data || err)
      alert('Erreur lors de la création du quiz')
    }
  }

  return (
    <div className="min-vh-100 bg-white">
      <div className="container py-5">

        {/* Titre principal */}
        <div className="text-center mb-5 pt-3">
          <h1 className="display-5 fw-bold text-dark mb-2">Créer un Quiz</h1>
          <p className="lead text-muted">Pour le cours n°{courseId}</p>
        </div>

        {/* Carte principale – BLEU PASTEL comme Login */}
        <div className="card border-0 rounded-4 overflow-hidden mx-auto" style={{ maxWidth: '900px', border: '1px solid #f0f0f0' }}>
          
          {/* Header bleu pastel */}
          <div
            className="text-white text-center py-5"
            style={{ background: 'linear-gradient(135deg, #a0d8ef 0%, #6ab7ff 100%)' }}
          >
            <h3 className="mb-0 fw-bold">Nouveau Quiz</h3>
          </div>

          <div className="card-body p-5 bg-white">
            <form onSubmit={handleSubmit}>

              {/* Titre + Deadline */}
              <div className="row g-4 mb-5">
                <div className="col-lg-8">
                  <label className="form-label fw-semibold text-dark fs-5">Titre du quiz</label>
                  <input
                    type="text"
                    className="form-control form-control-lg rounded-pill border-0 bg-light shadow-sm"
                    placeholder="Ex: Quiz sur les verbes irréguliers"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ height: '58px' }}
                  />
                </div>
                <div className="col-lg-4">
                  <label className="form-label fw-semibold text-dark fs-5">Date limite</label>
                  <input
                    type="datetime-local"
                    className="form-control form-control-lg rounded-pill border-0 bg-light shadow-sm"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                    style={{ height: '58px' }}
                  />
                </div>
              </div>

              {/* Liste des questions */}
              {questions.map((q, i) => (
                <div key={i} className="border rounded-4 p-4 mb-4" style={{ borderColor: '#e0e0e0' }}>
                  <div className="d-flex align-items-center mb-3">
                    <span className="badge bg-primary rounded-pill px-3 py-2 me-3" style={{ fontSize: '1rem' }}>
                      Question {i + 1}
                    </span>
                    <input
                      type="text"
                      className="form-control form-control-lg border-0 bg-light rounded-pill flex-grow-1"
                      placeholder="Écrivez votre question ici..."
                      value={q.question_text}
                      onChange={(e) => updateQuestion(i, 'question_text', e.target.value)}
                      required
                      style={{ height: '52px' }}
                    />
                  </div>

                  {/* Options */}
                  <div className="row g-3">
                    {q.options.map((opt, idx) => (
                      <div className="col-12 col-md-6" key={idx}>
                        <div className="input-group">
                          <div className="input-group-text bg-white" style={{ borderRight: 'none' }}>
                            <input
                              type="radio"
                              name={`correct-${i}`}
                              checked={q.correct_option === idx}
                              onChange={() => updateQuestion(i, 'correct_option', idx)}
                              style={{ width: '18px', height: '18px' }}
                            />
                          </div>
                          <input
                            type="text"
                            className="form-control rounded-end-pill border-start-0 bg-light"
                            placeholder={`Réponse ${idx + 1}`}
                            value={opt}
                            onChange={(e) => updateQuestion(i, null, e.target.value, idx)}
                            required
                            style={{ height: '50px' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Boutons */}
              <div className="d-flex flex-wrap gap-3 justify-content-center mt-5">
                <button
                  type="button"
                  onClick={addQuestion}
                  className="btn rounded-pill px-5 fw-bold"
                  style={{
                    background: 'white',
                    color: '#333',
                    border: '2px solid #a0d8ef',
                    height: '56px',
                    minWidth: '220px'
                  }}
                >
                  + Ajouter une question
                </button>

                <button
                  type="submit"
                  className="btn rounded-pill px-5 fw-bold text-white"
                  style={{
                    background: 'linear-gradient(135deg, #a8e6cf 0%, #88d8a3 100%)',
                    height: '56px',
                    minWidth: '220px'
                  }}
                >
                  Publier le Quiz
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Crédit discret */}
        <div className="text-center mt-5 text-muted">
          <small>© {new Date().getFullYear()} • Plateforme d’enseignement moderne</small>
        </div>
      </div>
    </div>
  )
}