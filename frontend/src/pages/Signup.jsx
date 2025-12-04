// src/pages/Signup.jsx
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { signupUser } from '../Slices/authSlice'
import { useNavigate, Link } from 'react-router-dom'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await dispatch(
        signupUser({
          name: name.trim(),
          email: email.trim(),
          password,
          role: role.toLowerCase(),
        })
      ).unwrap()

      if (result.user.role === 'teacher') {
        navigate('/teacher')
      } else {
        navigate('/student')
      }
    } catch (err) {
      const msg =
        err?.errors
          ? Object.values(err.errors).flat().join(', ')
          : err?.message || 'Inscription échouée.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 bg-white d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">

            {/* Avatar + Titre – IDENTIQUE à Login */}
            <div className="text-center mb-5">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle text-white mb-4 shadow-lg"
                style={{
                  width: '100px',
                  height: '100px',
                  fontSize: '2.8rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #a8e6cf 0%, #dcedc1 100%)' // VERT PASTEL COMME DANS LOGIN
                }}
              >
                R
              </div>
              <h1 className="h3 fw-bold text-dark">Créer un compte</h1>
              <p className="text-muted">Rejoignez la plateforme d’apprentissage</p>
            </div>

            {/* Carte – MÊME BLEU PASTEL QUE LOGIN */}
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="card-header text-white text-white text-center py-4"
                   style={{ background: 'linear-gradient(135deg, #a0d8ef 0%, #6ab7ff 100%)' }}>
                <h4 className="mb-0 fw-bold">Inscription</h4>
              </div>

              <div className="card-body p-5 bg-white">
                {/* Erreur */}
                {error && (
                  <div className="alert alert-danger rounded-4 shadow-sm text-center py-3 mb-4">
                    <strong>{error}</strong>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Nom complet</label>
                    <input
                      type="text"
                      className="form-control form-control-lg rounded-pill border-0 shadow-sm bg-light"
                      placeholder="Jean Dupont"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Email</label>
                    <input
                      type="email"
                      className="form-control form-control-lg rounded-pill border-0 shadow-sm bg-light"
                      placeholder="jean@exemple.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Mot de passe</label>
                    <input
                      type="password"
                      className="form-control form-control-lg rounded-pill border-0 shadow-sm bg-light"
                      placeholder="Minimum 6 caractères"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength="6"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Je suis...</label>
                    <select
                      className="form-select form-select-lg rounded-pill shadow-sm bg-light border-0"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      disabled={loading}
                      style={{ height: '56px' }}
                    >
                      <option value="student">Étudiant</option>
                      <option value="teacher">Enseignant</option>
                    </select>
                  </div>

                  {/* BOUTON IDENTIQUE À LOGIN */}
                  <button
                    type="submit"
                    className="btn w-100 rounded-pill fw-bold text-white shadow-sm"
                    style={{
                      background: 'linear-gradient(135deg, #a0d8ef 0%, #6ab7ff 100%)',
                      height: '56px',
                      fontSize: '1.1rem'
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Inscription...
                      </>
                    ) : (
                      'Créer mon compte'
                    )}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <small className="text-muted">
                    Déjà un compte ?{' '}
                    <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                      Se connecter
                    </Link>
                  </small>
                </div>
              </div>
            </div>

            <div className="text-center mt-4 text-muted">
              <small>© {new Date().getFullYear()} • Plateforme d’enseignement</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup