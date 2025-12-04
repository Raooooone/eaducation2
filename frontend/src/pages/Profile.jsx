// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

function Profile() {
  const { user: currentUser, token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (!token) navigate('/login') }, [token, navigate])
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '')
      setEmail(currentUser.email || '')
    }
  }, [currentUser])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setMessage(''); setLoading(true)
    try {
      await API.put('/me', { name, email })
      setMessage('Profil mis à jour avec succès !')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la mise à jour')
    } finally { setLoading(false) }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPassword.length < 6) return setMessage('Le mot de passe doit faire au moins 6 caractères')
    setLoading(true)
    try {
      await API.put('/me/password', { password: newPassword })
      setMessage('Mot de passe changé avec succès !')
      setNewPassword('')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur mot de passe')
    } finally { setLoading(false) }
  }

  if (!currentUser) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }}>
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-vh-100 bg-white">
      <div className="container py-5">

        {/* Avatar + Titre */}
        <div className="text-center mb-5">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle text-white mb-4 shadow-lg"
            style={{
              width: '140px',
              height: '140px',
              fontSize: '4.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' // Bleu ciel moderne
            }}
          >
            {name.charAt(0).toUpperCase()}
          </div>
          <h1 className="display-5 fw-bold text-dark mb-2">{name}</h1>
          <p className="lead text-primary fw-semibold">
            {currentUser.role === 'teacher' ? 'Enseignant' : 'Étudiant'}
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`alert rounded-4 shadow-sm text-center py-3 mb-5 ${
            message.includes('succès') ? 'alert-success border-success' : 'alert-danger border-danger'
          }`}>
            <strong>{message}</strong>
          </div>
        )}

        <div className="row g-5 justify-content-center">

          {/* Informations personnelles → VERT PASTEL */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden h-100">
              <div className="card-header text-white text-center py-4"
                   style={{ background: 'linear-gradient(135deg, #a8e6cf 0%, #dcedc1 100%)' }}>
                <h4 className="mb-0 fw-bold">Mes informations</h4>
              </div>
              <div className="card-body p-5 bg-white">
                <form onSubmit={handleUpdateProfile}>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Nom complet</label>
                    <input
                      type="text"
                      className="form-control form-control-lg rounded-pill border-0 shadow-sm bg-light"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control form-control-lg rounded-pill border-0 shadow-sm bg-light"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn w-100 rounded-pill fw-bold text-white shadow-sm"
                    style={{
                      background: 'linear-gradient(135deg, #a8e6cf 0%, #88d8a3 100%)',
                      height: '56px'
                    }}
                    disabled={loading}
                  >
                    {loading ? 'Enregistrement...' : 'Mettre à jour'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Mot de passe → JAUNE PASTEL */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden h-100">
              <div className="card-header text-dark text-center py-4"
                   style={{ background: 'linear-gradient(135deg, #fff9c4 0%, #ffe082 100%)' }}>
                <h4 className="mb-0 fw-bold">Mot de passe</h4>
              </div>
              <div className="card-body p-5 bg-white">
                <form onSubmit={handleChangePassword}>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Nouveau mot de passe</label>
                    <input
                      type="password"
                      className="form-control form-control-lg rounded-pill border-0 shadow-sm bg-light"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 caractères"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn w-100 rounded-pill fw-bold shadow-sm"
                    style={{
                      background: 'linear-gradient(135deg, #fff9c4 0%, #ffd54f 100%)',
                      color: '#5d4037',
                      height: '56px'
                    }}
                    disabled={loading}
                  >
                    {loading ? 'Changement...' : 'Changer le mot de passe'}
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>

        {/* Crédit */}
        <div className="text-center mt-5 text-muted">
          <small>© {new Date().getFullYear()} • Plateforme d'enseignement</small>
        </div>
      </div>
    </div>
  )
}

export default Profile