import { Route, Routes } from "react-router-dom";
import RootComponent from "./components/root-component";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Training from "./components/Trainings";

const App = () => {
  return (
    <div className="h-screen w-screen">
      <Routes>
        <Route path="/" element={<RootComponent />}>
          <Route index element={<Dashboard />} />
          <Route path="/trainings" element={<Training />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<h1> Not Found </h1>} />
      </Routes>
    </div>
  )
}

export default App