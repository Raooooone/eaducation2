// src/pages/TeacherQuizResults.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';

export default function TeacherQuizResults() {
  const { quizId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/teacher/quizzes/${quizId}/results`)
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert('Impossible de charger les résultats');
        setLoading(false);
      });
  }, [quizId]);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }}>
            <span className="visually-hidden">Chargement...</span>
          </div>
          <h4 className="mt-4 text-muted">Chargement des résultats...</h4>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <h4>Erreur de chargement</h4>
          <p>Impossible de récupérer les résultats du quiz.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-gradient" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container py-5">
        {/* Carte principale avec effet verre (glassmorphism) */}
        <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ backdropFilter: 'blur(10px)', background: 'rgba(255, 255, 255, 0.95)' }}>
          {/* Header stylé */}
          <div className="bg-gradient text-white text-center py-5 px-4" style={{ background: 'linear-gradient(45deg, #4e54c8, #8f94fb)' }}>
            <h1 className="display-5 fw-bold mb-2">Résultats du Quiz</h1>
            <h2 className="h3 fw-light opacity-90">{data.quiz_title}</h2>
            <div className="mt-3">
              <span className="badge bg-light text-dark fs-6 px-4 py-2">
                {data.results.length} étudiant{data.results.length > 1 ? 's' : ''} ont passé le quiz
              </span>
            </div>
          </div>

          <div className="card-body p-5">
            {data.results.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-4">
                  <i className="bi bi-emoji-neutral display-1 text-muted"></i>
                </div>
                <h3 className="text-muted">Aucun résultat pour le moment</h3>
                <p className="text-muted lead">Les étudiants n'ont pas encore passé ce quiz.</p>
              </div>
            ) : (
              <>
                {/* Statistiques rapides */}
                <div className="row mb-4 g-4">
                  <div className="col-md-4">
                    <div className="text-center p-4 bg-success bg-opacity-10 rounded-3 border border-success border-opacity-25">
                      <h5 className="text-success fw-bold">
                        {data.results.filter(r => r.percentage >= 50).length}
                      </h5>
                      <p className="mb-0 text-success">Réussite (≥50%)</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center p-4 bg-warning bg-opacity-10 rounded-3 border border-warning border-opacity-25">
                      <h5 className="text-warning fw-bold">
                        {data.results.filter(r => r.percentage < 50).length}
                      </h5>
                      <p className="mb-0 text-warning">Échec (&lt;50%)</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center p-4 bg-primary bg-opacity-10 rounded-3 border border-primary border-opacity-25">
                      <h5 className="text-primary fw-bold">
                        {data.results.length > 0 
                          ? Math.round(data.results.reduce((a, r) => a + r.percentage, 0) / data.results.length)
                          : 0}%
                      </h5>
                      <p className="mb-0 text-primary">Moyenne de la classe</p>
                    </div>
                  </div>
                </div>

                {/* Tableau des résultats */}
                <div className="table-responsive rounded-3 overflow-hidden shadow-sm">
                  <table className="table table-hover mb-0">
                    <thead className="bg-dark text-white">
                      <tr>
                        <th className="ps-4">Étudiant</th>
                        <th className="text-center">Score</th>
                        <th className="text-center">Note</th>
                        <th className="text-center">Pourcentage</th>
                        <th className="text-end pe-4">Soumis le</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.results.map((r, i) => (
                        <tr 
                          key={i} 
                          className={`fw-medium ${
                            r.percentage >= 80 ? 'bg-success bg-opacity-5' :
                            r.percentage >= 60 ? 'bg-info bg-opacity-5' :
                            r.percentage >= 50 ? 'bg-warning bg-opacity-5' :
                            'bg-danger bg-opacity-5'
                          }`}
                        >
                          <td className="ps-4">
                            <div className="d-flex align-items-center">
                              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                                   style={{ width: '40px', height: '40px', fontSize: '14px' }}>
                                {r.student_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </div>
                              <div>
                                <div className="fw-bold">{r.student_name}</div>
                                <small className="text-muted">Étudiant</small>
                              </div>
                            </div>
                          </td>
                          <td className="text-center fw-bold">{r.score} / {r.total}</td>
                          <td className="text-center">
                            <span className={`badge rounded-pill px-3 py-2 fs-6 ${
                              r.percentage >= 80 ? 'bg-success' :
                              r.percentage >= 60 ? 'bg-info' :
                              r.percentage >= 50 ? 'bg-warning text-dark' :
                              'bg-danger'
                            }`}>
                              {r.percentage >= 80 ? 'Excellent' :
                               r.percentage >= 70 ? 'Très bien' :
                               r.percentage >= 60 ? 'Bien' :
                               r.percentage >= 50 ? 'Passable' : 'Insuffisant'}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="position-relative d-inline-block">
                              <span className={`fw-bold fs-4 ${
                                r.percentage >= 50 ? 'text-success' : 'text-danger'
                              }`}>
                                {r.percentage}%
                              </span>
                              <div className="progress mt-2" style={{ height: '8px' }}>
                                <div 
                                  className={`progress-bar ${r.percentage >= 50 ? 'bg-success' : 'bg-danger'}`}
                                  style={{ width: `${r.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="text-end pe-4 text-muted">
                            <div>{r.submitted_at}</div>
                            <small><em>{r.ago}</em></small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Bouton retour */}
            <div className="text-center mt-5">
              <Link 
                to="/teacher" 
                className="btn btn-lg btn-outline-primary px-5 py-3 rounded-pill shadow-sm hover-lift"
              >
                Retour au tableau de bord
              </Link>
            </div>
          </div>
        </div>

        {/* Crédit discret */}
        <div className="text-center mt-4 text-white opacity-75">
          <small>Plateforme d'enseignement • {new Date().getFullYear()}</small>
        </div>
      </div>
    </div>
  );
}