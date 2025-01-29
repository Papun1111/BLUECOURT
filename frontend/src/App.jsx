import React from 'react'
import { Route,Routes } from 'react-router-dom'
import SignUpPage from './pages/auth/signup/SignUpPage'
import LoginPage from './pages/auth/login/LoginPage'
import HomePage from './pages/home/HomePage'
const App = () => {
  return (
    <div className='flex max-w-7xl mx-auto'>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/signup' element={<SignUpPage/>}/>
      </Routes>
    </div>
  )
}

export default App
