import React from 'react'
import { Route,Routes } from 'react-router-dom'
import SignUpPage from './pages/auth/signup/SignUpPage'
import LoginPage from './pages/auth/login/LoginPage'
import HomePage from './pages/home/HomePage'
import Sidebar from './components/common/Sidebar'
import RightPanel from './components/common/RightPanel'
const App = () => {
  return (
    <div className='flex max-w-7xl mx-auto'>
      <Sidebar></Sidebar>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/signup' element={<SignUpPage/>}/>
      </Routes>
      <RightPanel></RightPanel>
    </div>
  )
}

export default App
