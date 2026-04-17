import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'

import LandingPage from './components/Landing-page/landingPage'
import Signup from './components/authentication/signup'
import Signin from './components/authentication/login'
import CafeData from './components/cafe-data/cafeData'
import Validate from './components/authentication/validate'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/signin' element={<Signin/>}/>
        <Route path='/CafeData' element={<CafeData/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
