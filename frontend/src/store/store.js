import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../Slices/authSlice'
import coursesReducer from '../Slices/courseSlice'
import quizzesReducer from '../Slices/quizSlice'

export default configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    quizzes: quizzesReducer
  }
})
