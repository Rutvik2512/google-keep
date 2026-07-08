import { useContext } from "react";
import { NotesContext } from "../context/Notescontext";
import Notecard from "../components/Notecard";

export default function Archive() {
  const { notes, searchTerm } = useContext(NotesContext);

  const archived = notes.filter(
    (n) =>
      n.archived &&
      !n.trashed &&
      (n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="px-6 py-6 max-w-6xl mx-auto w-full">
      <h1 className="text-lg text-neutral-500 mb-4">Archive</h1>
      {archived.length === 0 ? (
        <p className="text-center text-neutral-400 mt-16">Your archived notes appear here</p>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
          {archived.map((n) => (
            <Notecard key={n.id} note={n} variant="archived" />
          ))}
        </div>
      )}
    </div>
  );
}