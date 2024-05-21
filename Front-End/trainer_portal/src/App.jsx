import { Route, Routes } from "react-router-dom";
import RootComponent from "./components/root-component";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Training from "./components/Trainings";
import EditTable from "./components/Testing_components/EditableTable";
import TrainingSheet from "./components/TrainingSheet";
import SchoolSheets from "./components/SchoolSheets";
import PageNotFound from "./components/PageNotFound";
import Schools from "./components/Schools";
import Testing_Sidebar from "./components/Testing_components/EditableTable";

const App = () => {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<RootComponent />}>
          <Route index element={<Dashboard />} />
          <Route exact path="/trainings" element={<Training />} />
          <Route exact path="/schools" element={<Schools />} />
          <Route path="/school/:id" element={<TrainingSheet />} />
          <Route path="/test" element={<EditTable />} />
          <Route exact path="/sheets" element={<SchoolSheets />} />
        </Route>
        <Route exact path="/login" element={<Login />} />
        <Route path="/testing" element={<Testing_Sidebar/>} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  )
}

export default App