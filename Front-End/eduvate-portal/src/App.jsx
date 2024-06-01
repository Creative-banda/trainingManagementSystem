
import { Route, Routes } from 'react-router-dom'
import './App.css'
import RootComponent from '../components/root-template'
import Dashboard from '../components/Dashboard'
import Schools, { ShowSchools } from '../components/Schools'
import Trainings from '../components/Trainings'
import SchoolRegistration from '../components/SchoolRegistration'
import Login from '../components/Login'
import Scheduler from '../components/Scheduler'
import AssignTraining from '../components/AssignTraining'
import Profile from '../components/Profile'

function App() {

  return (
    <main className=''>
      <Routes>
        <Route path='/' element={
          <RootComponent />
        }>
          <Route index element={< Dashboard />} />
          <Route path='/training' element={<Trainings />} />
          <Route path='/schools' element={<Schools />} />
          <Route path='/schools/:id' element={<ShowSchools />} />
          <Route path="/scheduller" element={<Scheduler />} />
          <Route path='/assign' element={<AssignTraining/>}/>
          <Route path="/profile" element={<Profile/>} />
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/school-register' element={<SchoolRegistration />} />
      </Routes>
    </main>
  )
}

export default App
