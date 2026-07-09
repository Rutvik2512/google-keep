import { useContext } from "react";
import { Menu, LayoutGrid, List, Settings, Grid3x3, Lightbulb } from "lucide-react";
import Searchbar from "./Searchbar";
import { NotesContext } from "../context/Notescontext";

export default function Navbar() {
  const { sidebarOpen, setSidebarOpen, gridView, setGridView } = useContext(NotesContext);

  return (
    <header className="h-16 flex  items-center gap-4 px-3 border-b border-neutral-200 shrink-0">
      <div className="flex items-center gap-3 min-w-[130px]">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 rounded-full hover:bg-neutral-100 text-neutral-700"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-1.5 select-none">
          <Lightbulb className="text-yellow-500" size={26} fill="currentColor" />
          <span className="text-xl text-neutral-700 tracking-tight">Keep</span>
        </div>
      </div>
<div className="pl-40 w-500"><Searchbar /></div>
      

      <div className="flex items-center gap-1 ml-auto">
        <button
          onClick={() => setGridView(!gridView)}
          className="p-3 rounded-full hover:bg-neutral-100 text-neutral-700"
          aria-label="Toggle view"
        >
          {gridView ? <List size={20} /> : <LayoutGrid size={20} />}
        </button>
        <button className="p-3 rounded-full hover:bg-neutral-100 text-neutral-700" aria-label="Settings">
          <Settings size={20} />
        </button>
        <button className="p-3 rounded-full hover:bg-neutral-100 text-neutral-700" aria-label="Apps">
          <Grid3x3 size={20} />
        </button>
        <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-medium ml-2 cursor-pointer">
          R
        </div>
      </div>
    </header>
  );
}