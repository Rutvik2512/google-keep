import { useContext } from "react";
import { NotesContext } from "../context/Notescontext";
import Notecard from "../components/Notecard";

export default function Remainders() {
  const { notes, searchTerm } = useContext(NotesContext);

  const reminders = notes
    .filter(
      (n) =>
        !!n.reminder &&
        !n.trashed &&
        !n.archived &&
        (n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.content.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => new Date(a.reminder) - new Date(b.reminder));

  return (
    <div className="px-6 py-6 max-w-6xl mx-auto w-full">
      <h1 className="text-lg text-neutral-500 mb-4">Reminders</h1>
      {reminders.length === 0 ? (
        <p className="text-center text-neutral-400 mt-16">Notes with reminders appear here</p>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
          {reminders.map((n) => (
            <Notecard key={n.id} note={n} variant="active" />
          ))}
        </div>
      )}
    </div>
  );
}