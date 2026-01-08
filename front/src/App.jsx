import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Finder from './pages/Finder'
import Tracker from './pages/Tracker'
const App = () => {
  return (
    <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/finder/:id' element={<Finder/>} />
        <Route path='/tracker/:unique' element={<Tracker/>} />
    </Routes>
  )
}

export default App