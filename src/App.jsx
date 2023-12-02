import React from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Previewpage from './Pages/Previewpage'
import { Provider } from 'react-redux'
import store from '../Store/store'

const App = () => {
  return (
    <BrowserRouter>
    <Provider store={store}>
      <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/preview' element={<Previewpage/>}/>
      </Routes>
      </Provider>
    </BrowserRouter>
  )
}

export default App
