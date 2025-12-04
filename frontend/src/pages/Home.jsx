import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses } from '../Slices/courseSlice'
import { Link } from 'react-router-dom'

function Home() {
  const dispatch = useDispatch()
  const { courses } = useSelector(state => state.courses)

  useEffect(() => {
    dispatch(fetchCourses())
  }, [dispatch])

  return (
    <div>
      <h2>Available Courses</h2>
      <div className="row">
        {courses.map(course => (
          <div className="col-md-4 mb-3" key={course.id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text">{course.description}</p>
                <Link to={`/courses/${course.id}`} className="btn btn-primary">View Course</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
