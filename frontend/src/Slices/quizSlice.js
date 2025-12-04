import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../services/api'

// Thunk pour récupérer les quizzes d'un cours
export const fetchQuizzes = createAsyncThunk(
  'quizzes/fetchQuizzes',
  async (courseId) => {
    const res = await API.get(`/courses/${courseId}/quizzes`)
    return res.data
  }
)

// Thunk pour soumettre un quiz
export const submitQuiz = createAsyncThunk(
  'quizzes/submitQuiz',
  async ({ quizId, answers }) => {
    const res = await API.post(`/quizzes/${quizId}/submit`, { answers })
    return res.data
  }
)

const quizSlice = createSlice({
  name: 'quizzes',
  initialState: {
    quizzes: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => { state.status = 'loading' })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.quizzes = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        // Tu peux gérer ici les résultats après soumission si besoin
        console.log('Quiz submitted', action.payload)
      })
  }
})

export default quizSlice.reducer
