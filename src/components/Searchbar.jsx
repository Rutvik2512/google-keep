import { useContext } from "react";
import { Search, X } from "lucide-react";
import { NotesContext } from "../context/Notescontext";

export default function Searchbar() {
  const { searchTerm, setSearchTerm } = useContext(NotesContext);

  return (
    <div className="flex-1 max-w-2xl">
      <div className="flex items-center gap-3 bg-neutral-100 hover:bg-neutral-200/70 focus-within:bg-white focus-within:shadow-md rounded-lg px-4 h-12 transition-colors">
        <Search size={20} className="text-neutral-600 shrink-0" strokeWidth={2} />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          placeholder="Search your notes"
          className="bg-transparent outline-none border-none flex-1 text-base text-neutral-800 placeholder:text-neutral-500"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="p-1 rounded-full hover:bg-neutral-300/60 text-neutral-600"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}