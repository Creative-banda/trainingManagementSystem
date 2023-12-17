
import { Route, Routes } from 'react-router-dom'
import RootComponent from '../components/root-template'
import './App.css'
import Dashboard from '../components/Dashboard'
import Schools from '../components/Schools'
import Training from '../components/Trainings'

function App() {

  return (
    <main className='h-screen w-screen'>
      <Routes>
          <Route path='/' element={<RootComponent/>}>
            <Route index element={< Dashboard/>}/>
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path='/schools' element={<Schools/>}/>
            <Route path='/training' element={<Training/>}/>
          </Route>
          <Route path='/login' element={<h1>Login</h1>}/>
      </Routes>
    </main>
  )
}

export default App
