import { Routes, Route } from "react-router-dom";
import { NotesProvider } from "./context/Notescontext";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import Remainders from "./pages/Remainders";
import Labels from "./pages/Labels";
import Archive from "./pages/Archive";
import Bin from "./pages/Bin";
import "./App.css";

export default function App() {
  return (
    <NotesProvider>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Notes />} />
          <Route path="reminders" element={<Remainders />} />
          <Route path="labels" element={<Labels />} />
          <Route path="label/:label" element={<Labels />} />
          <Route path="archive" element={<Archive />} />
          <Route path="bin" element={<Bin />} />
        </Route>
      </Routes>
    </NotesProvider>
  );
}