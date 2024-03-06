import { Route, Routes } from "react-router-dom";
import RootComponent from "./components/root-component";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Training from "./components/Trainings";
import EditTable from "./components/Testing_components/EditableTable";
import TrainingSheet from "./components/TrainingSheet";

const App = () => {
  return (
    <div className="h-screen w-screen">
      <Routes>
        <Route path="/" element={<RootComponent />}>
          <Route index element={<Dashboard />} />
          <Route path="/trainings" element={<Training />} />
          <Route path="/school/:id" element={<TrainingSheet/>} />
          <Route path="/test" element={<EditTable/>}/>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<h1> Not Found </h1>} />
      </Routes>
    </div>
  )
}

export default App