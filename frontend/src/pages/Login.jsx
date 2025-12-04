// src/pages/Login.jsx
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../Slices/authSlice'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap()
      if (result.user.role === 'teacher') {
        navigate('/teacher')
      } else if (result.user.role === 'student') {
        navigate('/student')
      } else {
        navigate('/')
      }
    } catch {
      alert('Identifiants incorrects')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 bg-white d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">

            {/* Logo / Titre */}
            <div className="text-center mb-5">
              <div className="d-inline-flex align-items-center justify-content-center rounded-circle text-white mb-4 shadow-lg"
                   style={{
                     width: '100px',
                     height: '100px',
                     fontSize: '2.8rem',
                     fontWeight: 'bold',
                     background: 'linear-gradient(135deg, #a8e6cf 0%, #dcedc1 100%)'
                   }}>
                E
              </div>
              <h1 className="h3 fw-bold text-dark">Bienvenue !</h1>
              <p className="text-muted">Connectez-vous à votre espace</p>
            </div>

            {/* Carte de connexion */}
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="card-header text-white text-center py-4"
                   style={{ background: 'linear-gradient(135deg, #a0d8ef 0%, #6ab7ff 100%)' }}>
                <h4 className="mb-0 fw-bold">Connexion</h4>
              </div>

              <div className="card-body p-5 bg-white">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Adresse email</label>
                    <input
                      type="email"
                      className="form-control form-control-lg rounded-pill border-0 shadow-sm bg-light"
                      placeholder="exemple@domaine.com"
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
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

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
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Connexion...
                      </>
                    ) : (
                      'Se connecter'
                    )}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <small className="text-muted">
                    Pas encore de compte ? <a href="/register" className="text-primary fw-semibold">S'inscrire</a>
                  </small>
                </div>
              </div>
            </div>

            {/* Crédit discret */}
            <div className="text-center mt-4 text-muted">
              <small>© {new Date().getFullYear()} • Plateforme d'enseignement moderne</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login