import { useContext } from "react";
import { NotesContext } from "../context/Notescontext";
import Notecard from "../components/Notecard";

export default function Bin() {
  const { notes, searchTerm, emptyBin } = useContext(NotesContext);

  const trashed = notes.filter(
    (n) =>
      n.trashed &&
      (n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="px-6 py-6 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg text-neutral-500">Bin</h1>
        {trashed.length > 0 && (
          <button
            onClick={() => {
              if (confirm("Empty bin? Notes will be deleted forever.")) emptyBin();
            }}
            className="text-sm text-neutral-600 hover:bg-neutral-100 px-3 py-1.5 rounded"
          >
            Empty bin now
          </button>
        )}
      </div>

      {trashed.length === 0 ? (
        <p className="text-center text-neutral-400 mt-16">No notes in the bin</p>
      ) : (
        <>
          <p className="text-xs text-neutral-500 mb-4">
            Notes in the bin are deleted forever after 7 days.
          </p>
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
            {trashed.map((n) => (
              <Notecard key={n.id} note={n} variant="trashed" />
            ))}
          </div>
        </>
      )}
    </div>
  );
}