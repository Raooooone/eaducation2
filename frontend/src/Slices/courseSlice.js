// src/Slices/courseSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../services/api'

export const fetchCourses = createAsyncThunk('courses/fetchCourses', async () => {
  const res = await API.get('/courses')
  return res.data
})

export const createCourse = createAsyncThunk('courses/createCourse', async (formData) => {
  const res = await API.post('/courses', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // CRUCIAL POUR LES FICHIERS
    },
  })
  return res.data
})

const courseSlice = createSlice({
  name: 'courses',
  initialState: { courses: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => { state.loading = true })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false
        state.courses = action.payload
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.courses.push(action.payload)
      })
  },
})

export default courseSlice.reducer