import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'

import LandingPage from './components/Landing-page/landingPage'
import Signup from './components/authentication/signup'
import Signin from './components/authentication/login'
import Client from './components/chat/Client'
import CafeData from './components/cafe-data/cafeData'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/signin' element={<Signin/>}/>
        {/* <Route path='/Client' element={<Client/>}/> */}
        <Route path='/CafeData' element={<CafeData/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
