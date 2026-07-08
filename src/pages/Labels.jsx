import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Pencil, X, Plus, Tag } from "lucide-react";
import { NotesContext } from "../context/Notescontext";
import Notecard from "../components/Notecard";

function EditLabels() {
  const { allLabels, renameLabel, deleteLabel, addLabelToNote, notes } = useContext(NotesContext);
  const [newLabel, setNewLabel] = useState("");
  const [editingLabel, setEditingLabel] = useState(null);
  const [draft, setDraft] = useState("");

  const createLabel = () => {
    const name = newLabel.trim();
    if (!name || allLabels.includes(name)) return;
    if (notes[0]) addLabelToNote(notes[0].id, name);
    setNewLabel("");
  };

  return (
    <div className="px-6 py-6 max-w-md mx-auto w-full">
      <h1 className="text-lg text-neutral-700 mb-4">Edit labels</h1>

      <div className="flex items-center gap-2 border-b border-neutral-200 pb-3 mb-2">
        <Plus size={18} className="text-neutral-500" />
        <input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createLabel()}
          placeholder="Create new label"
          className="flex-1 outline-none text-sm bg-transparent"
        />
        {newLabel && (
          <button onClick={() => setNewLabel("")} className="text-neutral-400 hover:text-neutral-700">
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex flex-col">
        {allLabels.length === 0 && (
          <p className="text-sm text-neutral-400 mt-4">No labels yet</p>
        )}
        {allLabels.map((label) => (
          <div
            key={label}
            className="flex items-center gap-2 py-2.5 border-b border-neutral-100 group"
          >
            <Tag size={16} className="text-neutral-400 shrink-0" />
            {editingLabel === label ? (
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && draft.trim()) {
                    renameLabel(label, draft.trim());
                    setEditingLabel(null);
                  }
                }}
                onBlur={() => setEditingLabel(null)}
                className="flex-1 outline-none text-sm bg-transparent border-b border-neutral-400"
              />
            ) : (
              <span className="flex-1 text-sm text-neutral-800">{label}</span>
            )}
            <button
              onClick={() => {
                setEditingLabel(label);
                setDraft(label);
              }}
              className="p-1.5 rounded-full hover:bg-neutral-100 opacity-0 group-hover:opacity-100"
              aria-label="Rename label"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => deleteLabel(label)}
              className="p-1.5 rounded-full hover:bg-neutral-100 opacity-0 group-hover:opacity-100"
              aria-label="Delete label"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function LabelFeed({ labelName }) {
  const { notes, searchTerm } = useContext(NotesContext);

  const filtered = notes.filter(
    (n) =>
      !n.trashed &&
      n.labels.includes(labelName) &&
      (n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="px-6 py-6 max-w-6xl mx-auto w-full">
      <h1 className="text-lg text-neutral-500 mb-4">{labelName}</h1>
      {filtered.length === 0 ? (
        <p className="text-center text-neutral-400 mt-16">No notes with this label</p>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
          {filtered.map((n) => (
            <Notecard key={n.id} note={n} variant={n.archived ? "archived" : "active"} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Labels() {
  const { label } = useParams();
  return label ? <LabelFeed labelName={decodeURIComponent(label)} /> : <EditLabels />;
}