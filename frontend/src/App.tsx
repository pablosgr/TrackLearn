import { Route, Routes } from 'react-router'
import Layout from './Layout'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import Classroom from './pages/Classroom'
import ClassroomDetail from './pages/ClassroomDetail'
import EnrollClassroom from './pages/EnrollClassroom'
import Test from './pages/Test'
import Users from './pages/Users'

function App() {
  return (
    <>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/' element={<Login />} />
          <Route element={<Layout />}>
            <Route path='/home' element={<Home />}/>
            <Route path='/profile' element={<Profile />}/>
            <Route path='/test' element={<Test />} />
            <Route path='/classroom' element={<Classroom />} />
            <Route path="/classroom/:id" element={<ClassroomDetail />} />
            <Route path="/enroll/:id" element={<EnrollClassroom />} />
            <Route path="/users" element={<Users />} />
          </Route>
        </Routes>
    </>
  )
}

export default App
