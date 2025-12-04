// src/components/Navbar.jsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../Slices/authSlice'

function Navbar() {
  const { token, user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const goToProfile = () => {
    navigate('/profile')
  }

  return (
    <nav
      className="navbar navbar-expand-lg py-4"
      style={{
        background: 'white',
        borderBottom: '1px solid #f0f0f0',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        minHeight: '90px' // ← cadre bien plus grand
      }}
    >
      <div className="container-fluid px-4 px-lg-5">

        {/* Logo – plus grand et plus classe */}
        <Link
          className="navbar-brand fw-bold d-flex align-items-center gap-3"
          to="/"
          style={{ fontSize: '2rem' }}
        >
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle text-white shadow-sm"
            style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #a8e6cf 0%, #dcedc1 100%)',
              fontSize: '1.8rem',
              fontWeight: 'bold'
            }}
          >
            L
          </div>
          <span style={{ color: '#222', letterSpacing: '0.5px' }}>Learning</span>
        </Link>

        {/* Boutons à droite – espacés et plus gros */}
        <div className="ms-auto d-flex align-items-center gap-4">

          {token ? (
            <>
              {/* Avatar + Nom – plus grand */}
              <div
                className="d-flex align-items-center gap-3 cursor-pointer"
                onClick={goToProfile}
                style={{ cursor: 'pointer' }}
                title="Voir mon profil"
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold shadow-sm"
                  style={{
                    width: '54px',
                    height: '54px',
                    fontSize: '1.4rem',
                    background: 'linear-gradient(135deg, #a0d8ef 0%, #6ab7ff 100%)'
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="fw-semibold text-dark d-none d-md-block" style={{ fontSize: '1.2rem' }}>
                  {user?.name}
                </span>
              </div>

              {/* Bouton Déconnexion – plus large et plus visible */}
              <button
                onClick={handleLogout}
                className="btn rounded-pill fw-bold px-5 shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
                  color: '#5d4037',
                  height: '54px',
                  fontSize: '1.1rem',
                  minWidth: '160px'
                }}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn rounded-pill fw-bold text-white px-5 shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, #a0d8ef 0%, #6ab7ff 100%)',
                  height: '56px',
                  fontSize: '1.15rem',
                  minWidth: '160px'
                }}
              >
                Se connecter
              </Link>

              <Link
                to="/signup"
                className="btn rounded-pill fw-bold px-5 shadow-sm"
                style={{
                  background: 'white',
                  color: '#333',
                  border: '2.5px solid #a0d8ef',
                  height: '56px',
                  fontSize: '1.15rem',
                  minWidth: '160px'
                }}
              >
                S’inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar