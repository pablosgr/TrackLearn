import { Route, Routes } from 'react-router'
import Layout from './Layout'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Classroom from './pages/Classroom'
import Test from './pages/Test'

function App() {
  return (
    <>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Login />} />
          <Route element={<Layout />}>
            <Route path='/home' element={<Home />}/>
            <Route path='/profile' element={<Profile />}/>
            <Route path='/test' element={<Test />} />
            <Route path='/classroom' element={<Classroom />} />
          </Route>
        </Routes>
    </>
  )
}

export default App
