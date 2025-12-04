// src/pages/QuizTake.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function QuizTake() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/quizzes/${id}`)
      .then(res => {
        setQuiz(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert('Impossible de charger le quiz');
        setLoading(false);
      });
  }, [id]);

  const handleAnswer = (questionId, optionIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    let user;
    try {
      const res = await API.get('/me');
      user = res.data;
    } catch {
      alert('Vous devez être connecté !');
      navigate('/login');
      return;
    }

    const payload = Object.entries(answers).map(([qid, idx]) => ({
      question_id: Number(qid),
      selected_option: Number(idx)
    }));

    try {
      const res = await API.post(`/quizzes/${id}/submit`, {
        student_id: user.id,
        answers: payload
      });
      setResult(res.data);
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la soumission');
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-white d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border" style={{ width: '4rem', height: '4rem', color: '#81d4fa' }}></div>
          <p className="mt-3 text-muted fs-5">Chargement du quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-vh-100 bg-white d-flex align-items-center justify-content-center">
        <p className="text-muted fs-4">Quiz non trouvé</p>
      </div>
    );
  }

  // === ÉCRAN RÉSULTATS ===
  // === ÉCRAN RÉSULTATS ===
if (submitted && result) {
  const isSuccess = result.percentage >= 50;

  // Styles globaux
  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e3f2fd, #ffffff)",
    padding: "40px 0",
  };

  const cardStyle = {
    background: "white",
    borderRadius: "22px",
    border: "1px solid #e0e0e0",
    overflow: "hidden",
    boxShadow: "0px 10px 25px rgba(0,0,0,0.08)",
    animation: "fadeIn 0.7s ease-in-out",
  };

  const headerStyle = {
    textAlign: "center",
    padding: "60px 20px",
    background: isSuccess
      ? "linear-gradient(135deg, #43e97b, #38f9d7)"
      : "linear-gradient(135deg, #ff6a88, #ff99ac)",
    color: "white",
  };

  const answerBox = (ok) => ({
    backgroundColor: ok ? "#e8f5e8" : "#ffebee",
    border: `2px solid ${ok ? "#94e6b0" : "#ff9a9e"}`,
    borderRadius: "18px",
    padding: "25px",
    marginBottom: "25px",
    display: "flex",
    gap: "20px",
    alignItems: "center",
    transition: "0.3s ease",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
  });

  const statusCircle = (ok) => ({
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    backgroundColor: ok ? "#43a047" : "#e53935",
    color: "white",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1rem",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
  });

  const buttonStyle = {
    borderRadius: "50px",
    height: "60px",
    minWidth: "260px",
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "#00b0ff",
    background: "white",
    border: "2.5px solid #4dd0e1",
    transition: "0.3s ease",
  };

  return (
    <div style={containerStyle}>
      <div className="container">
        <div className="mx-auto" style={{ maxWidth: "900px" }}>
          <div style={cardStyle}>

            {/* HEADER */}
            <div style={headerStyle}>
              <h1 className="fw-bold mb-3" style={{ fontSize: "3rem" }}>
                Quiz terminé !
              </h1>
              <h2 className="fw-bold" style={{ fontSize: "2.5rem" }}>
                {result.score} / {result.total}
              </h2>
              <h3 className="fw-bold" style={{ fontSize: "3.2rem" }}>
                {result.percentage}%
              </h3>
              <p style={{ fontSize: "1.4rem" }}>
                {isSuccess ? "Félicitations !" : "Vous pouvez faire mieux"}
              </p>
            </div>

            {/* CONTENU */}
            <div className="p-5">

              {/* Liste des réponses */}
              {result.results?.map((r, i) => (
                <div key={r.question_id} style={answerBox(r.is_correct)}>
                  <div style={statusCircle(r.is_correct)}>
                    {r.is_correct ? "✔" : "✖"}
                  </div>
                  <div>
                    <h6 className="fw-bold mb-2" style={{ fontSize: "1.2rem" }}>
                      {i + 1}. {r.question_text}
                    </h6>

                    <p><strong>Ta réponse :</strong> {r.options?.[r.user_answer] || "Aucune"}</p>

                    {!r.is_correct && (
                      <p className="text-success mb-0">
                        <strong>Bonne réponse :</strong> {r.options?.[r.correct_answer]}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Bouton */}
              <div className="text-center mt-4">
                <button
                  onClick={() => navigate("/student")}
                  style={buttonStyle}
                  onMouseOver={(e) => (e.target.style.background = "#e0f7fa")}
                  onMouseOut={(e) => (e.target.style.background = "white")}
                >
                  Retour au tableau de bord
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

  // === ÉCRAN QUIZ EN COURS ===
  return (
    <div className="min-vh-100 bg-white">
      <div className="container py-5 py-lg-6">
        <div className="mx-auto" style={{ maxWidth: '900px' }}>

          {/* Header du quiz */}
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold text-dark mb-3">{quiz.title}</h1>
            <p className="text-muted fs-5">
              {quiz.questions.length} questions • Répondez à toutes pour valider
            </p>
          </div>

          <div className="bg-white rounded-4 border" style={{ borderColor: '#e0e0e0', overflow: 'hidden' }}>
            <div className="p-5 p-lg-6">

              <form onSubmit={handleSubmit}>
                {quiz.questions.map((q, qIndex) => (
                  <div key={q.id} className="mb-5 p-4 rounded-4" style={{ backgroundColor: '#f8fff9', border: '1px solid #e0f2e1' }}>
                    <h5 className="fw-bold mb-4 text-dark">
                      Question {qIndex + 1} • {q.question_text}
                    </h5>

                    <div className="row g-3">
                      {q.options
                        .sort((a, b) => a.id - b.id)
                        .map((opt, index) => (
                          <div className="col-12 col-md-6" key={opt.id}>
                            <label
                              className="d-flex align-items-center gap-3 p-3 rounded-3 border"
                              style={{
                                backgroundColor: answers[q.id] === index ? '#e3f2fd' : 'white',
                                borderColor: answers[q.id] === index ? '#81d4fa' : '#e0e0e0',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onClick={() => handleAnswer(q.id, index)}
                            >
                              <input
                                type="radio"
                                name={`question-${q.id}`}
                                checked={answers[q.id] === index}
                                onChange={() => handleAnswer(q.id, index)}
                                className="form-check-input"
                                style={{ width: '20px', height: '20px' }}
                              />
                              <span className="fw-medium">{opt.option_text}</span>
                            </label>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}

                {/* Barre de progression + bouton */}
                <div className="text-center mt-5">
                  <div className="d-inline-block bg-light rounded-pill px-4 py-2 mb-4">
                    <span className="text-muted">
                      {Object.keys(answers).length} / {quiz.questions.length} questions répondues
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={Object.keys(answers).length !== quiz.questions.length}
                    className="btn rounded-pill fw-bold px-5 text-white"
                    style={{
                      backgroundColor: '#94e6b0',
                      height: '64px',
                      fontSize: '1.25rem',
                      minWidth: '280px',
                      opacity: Object.keys(answers).length === quiz.questions.length ? 1 : 0.6
                    }}
                  >
                    Soumettre le quiz
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="text-center mt-4 text-muted small">
            © {new Date().getFullYear()} • Plateforme d’enseignement moderne
          </div>
        </div>
      </div>
    </div>
  );
}