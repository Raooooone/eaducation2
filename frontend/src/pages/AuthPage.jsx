import React, { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser as login, signupUser as register } from '../Slices/authSlice'
import { useNavigate } from 'react-router-dom'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const { user, token } = useSelector(state => state.auth) // On récupère l'utilisateur connecté
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const roleRef = useRef()

  // Si déjà connecté → redirige selon rôle
  useEffect(() => {
    if (token && user) {
      if (user.role === 'teacher') {
        navigate('/teacher')
      } else {
        navigate('/student')
      }
    }
  }, [token, user, navigate])

  const submit = async (e) => {
    e.preventDefault()

    const payload = {
      name: mode === 'signup' ? nameRef.current.value.trim() : undefined,
      email: emailRef.current.value.trim(),
      password: passwordRef.current.value,
      role: mode === 'signup' ? (roleRef.current?.value || 'student') : undefined
    }

    try {
      if (mode === 'login') {
        await dispatch(login(payload)).unwrap()
      } else {
        await dispatch(register(payload)).unwrap()
      }

      // Après succès → Redux met à jour user et token → useEffect redirige
    } catch (err) {
      const errorMsg = err?.errors
        ? Object.values(err.errors).flat().join(', ')
        : err?.message || 'Échec de l’authentification'
      alert(errorMsg)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">

            {/* Si connecté → affiche le profil rapide */}
            {token && user ? (
              <div className="text-center p-5 bg-white rounded shadow">
                <div className="mb-4">
                  <div
                    className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center fs-1"
                    style={{ width: '100px', height: '100px' }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <h3>Bonjour, {user.name} !</h3>
                <p className="text-muted">Vous êtes connecté en tant que <strong>{user.role === 'teacher' ? 'Enseignant' : 'Étudiant'}</strong></p>
                <div className="d-flex gap-3 justify-content-center mt-4">
                  <button
                    onClick={() => user.role === 'teacher' ? navigate('/teacher') : navigate('/student')}
                    className="btn btn-primary px-5"
                  >
                    Aller au tableau de bord
                  </button>
                  <button
                    onClick={() => navigate('/profile')}
                    className="btn btn-outline-primary"
                  >
                    Voir mon profil
                  </button>
                </div>
              </div>
            ) : (
              /* Formulaire login/signup */
              <div className="card shadow border-0">
                <div className="card-body p-5">
                  <h3 className="text-center mb-4">
                    {mode === 'login' ? 'Connexion' : 'Créer un compte'}
                  </h3>

                  <form onSubmit={submit}>
                    {mode === 'signup' && (
                      <div className="mb-3">
                        <label className="form-label">Nom complet</label>
                        <input ref={nameRef} className="form-control form-control-lg" placeholder="Jean Dupont" required />
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input ref={emailRef} type="email" className="form-control form-control-lg" placeholder="jean@example.com" required />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Mot de passe</label>
                      <input ref={passwordRef} type="password" className="form-control form-control-lg" placeholder="••••••••" required minLength={6} />
                    </div>

                    {mode === 'signup' && (
                      <div className="mb-4">
                        <label className="form-label">Je suis...</label>
                        <select ref={roleRef} className="form-select form-select-lg">
                          <option value="student">Étudiant</option>
                          <option value="teacher">Enseignant</option>
                        </select>
                      </div>
                    )}

                    <button type="submit" className="btn btn-primary w-100 btn-lg mb-3">
                      {mode === 'login' ? 'Se connecter' : 'S’inscrire'}
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                        className="btn btn-link text-decoration-none"
                      >
                        {mode === 'login'
                          ? "Pas de compte ? S’inscrire"
                          : "Déjà un compte ? Se connecter"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}