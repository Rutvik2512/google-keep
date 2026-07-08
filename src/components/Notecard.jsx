import { useContext, useState, useRef, useEffect } from "react";
import {
  Pin,
  BellPlus,
  Archive,
  ArchiveRestore,
  Palette,
  Trash2,
  RotateCcw,
  Tag,
  MoreVertical,
  Check,
  X,
} from "lucide-react";
import { NotesContext } from "../context/Notescontext";

function ColorDot({ hex, selected, onClick, name }) {
  return (
    <button
      onClick={onClick}
      title={name}
      className={`w-7 h-7 rounded-full border transition-transform hover:scale-110 ${
        selected ? "ring-2 ring-offset-1 ring-neutral-900" : "border-neutral-300"
      }`}
      style={{ backgroundColor: hex }}
    />
  );
}

export default function Notecard({ note, variant = "active" }) {
  const {
    COLORS,
    updateNote,
    togglePin,
    toggleArchive,
    trashNote,
    restoreNote,
    deleteForever,
    setColor,
    toggleChecklistItem,
    allLabels,
    addLabelToNote,
    removeLabelFromNote,
  } = useContext(NotesContext);

  const [showColors, setShowColors] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [labelInput, setLabelInput] = useState("");
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(note.title);
  const [draftContent, setDraftContent] = useState(note.content);
  const wrapRef = useRef(null);

  const bg = COLORS.find((c) => c.name === note.color)?.hex ?? "#ffffff";

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowColors(false);
        setShowLabels(false);
        if (editing) {
          updateNote(note.id, { title: draftTitle, content: draftContent });
          setEditing(false);
        }
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [editing, draftTitle, draftContent, note.id, updateNote]);

  const saveEdits = () => {
    updateNote(note.id, { title: draftTitle, content: draftContent });
    setEditing(false);
  };

  return (
    <div
      ref={wrapRef}
      style={{ backgroundColor: bg }}
      className="group relative rounded-xl border border-black/10 hover:shadow-md transition-shadow break-inside-avoid mb-4 flex flex-col"
    >
      <div className="p-4 pb-2 flex-1">
        {editing ? (
          <>
            <input
              autoFocus
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              placeholder="Title"
              className="w-full bg-transparent outline-none font-medium text-neutral-900 mb-2 placeholder:text-neutral-500"
            />
            <textarea
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              placeholder="Take a note..."
              rows={4}
              className="w-full bg-transparent outline-none resize-none text-sm text-neutral-800 placeholder:text-neutral-500"
            />
          </>
        ) : (
          <div onClick={() => setEditing(true)} className="cursor-text">
            {note.title && (
              <h3 className="font-medium text-neutral-900 mb-1 break-words">{note.title}</h3>
            )}
            {note.content && (
              <p className="text-sm text-neutral-800 whitespace-pre-wrap break-words">
                {note.content}
              </p>
            )}
            {note.checklist && (
              <ul className="flex flex-col gap-1.5 mt-1">
                {note.checklist.map((item) => (
                  <li key={item.id} className="flex items-center gap-2 text-sm">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleChecklistItem(note.id, item.id);
                      }}
                      className={`w-4 h-4 shrink-0 rounded-full border flex items-center justify-center ${
                        item.done
                          ? "bg-neutral-700 border-neutral-700 text-white"
                          : "border-neutral-500"
                      }`}
                    >
                      {item.done && <Check size={11} />}
                    </button>
                    <span
                      className={
                        item.done ? "line-through text-neutral-500" : "text-neutral-800"
                      }
                    >
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {!note.title && !note.content && !note.checklist && (
              <span className="text-sm text-neutral-500">Empty note</span>
            )}
          </div>
        )}

        {note.reminder && (
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-neutral-700 bg-black/5 px-2 py-1 rounded-full">
            <BellPlus size={12} />
            {new Date(note.reminder).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </div>
        )}

        {note.labels.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {note.labels.map((l) => (
              <span
                key={l}
                className="text-xs bg-black/5 text-neutral-700 px-2 py-1 rounded-full flex items-center gap-1"
              >
                {l}
                <button onClick={() => removeLabelFromNote(note.id, l)} aria-label="Remove label">
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {variant === "active" && (
        <button
          onClick={() => togglePin(note.id)}
          className={`absolute top-2 right-2 p-1.5 rounded-full hover:bg-black/10 transition-opacity ${
            note.pinned ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
          aria-label={note.pinned ? "Unpin note" : "Pin note"}
        >
          <Pin size={16} className={note.pinned ? "fill-neutral-800" : ""} />
        </button>
      )}

      {editing && (
        <div className="flex justify-end px-3 pb-2">
          <button
            onClick={saveEdits}
            className="text-sm px-4 py-1.5 rounded hover:bg-black/5 text-neutral-700"
          >
            Close
          </button>
        </div>
      )}

      <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center gap-0.5 px-2 py-1.5 relative">
        {variant === "active" && (
          <>
            <button
              onClick={() => setShowColors((s) => !s)}
              className="p-2 rounded-full hover:bg-black/10"
              aria-label="Background options"
            >
              <Palette size={17} />
            </button>
            <button
              onClick={() => setShowLabels((s) => !s)}
              className="p-2 rounded-full hover:bg-black/10"
              aria-label="Add label"
            >
              <Tag size={17} />
            </button>
            <button
              onClick={() => {
                const time = prompt("Remind me on (YYYY-MM-DDTHH:mm):", note.reminder ?? "");
                if (time !== null) updateNote(note.id, { reminder: time || null });
              }}
              className="p-2 rounded-full hover:bg-black/10"
              aria-label="Reminder"
            >
              <BellPlus size={17} />
            </button>
            <button
              onClick={() => toggleArchive(note.id)}
              className="p-2 rounded-full hover:bg-black/10"
              aria-label="Archive"
            >
              <Archive size={17} />
            </button>
            <button
              onClick={() => trashNote(note.id)}
              className="p-2 rounded-full hover:bg-black/10 ml-auto"
              aria-label="Delete"
            >
              <Trash2 size={17} />
            </button>
          </>
        )}

        {variant === "archived" && (
          <>
            <button
              onClick={() => toggleArchive(note.id)}
              className="p-2 rounded-full hover:bg-black/10"
              aria-label="Unarchive"
            >
              <ArchiveRestore size={17} />
            </button>
            <button
              onClick={() => trashNote(note.id)}
              className="p-2 rounded-full hover:bg-black/10 ml-auto"
              aria-label="Delete"
            >
              <Trash2 size={17} />
            </button>
          </>
        )}

        {variant === "trashed" && (
          <>
            <button
              onClick={() => restoreNote(note.id)}
              className="p-2 rounded-full hover:bg-black/10 flex items-center gap-1.5 text-sm"
              aria-label="Restore"
            >
              <RotateCcw size={16} /> Restore
            </button>
            <button
              onClick={() => {
                if (confirm("Delete this note forever? This can't be undone.")) {
                  deleteForever(note.id);
                }
              }}
              className="p-2 rounded-full hover:bg-black/10 ml-auto"
              aria-label="Delete forever"
            >
              <Trash2 size={17} />
            </button>
          </>
        )}

        {variant === "active" && (
          <button className="p-2 rounded-full hover:bg-black/10" aria-label="More">
            <MoreVertical size={17} />
          </button>
        )}

        {showColors && (
          <div className="absolute bottom-11 left-0 bg-white rounded-lg shadow-lg border border-neutral-200 p-2 flex flex-wrap gap-1.5 w-48 z-10">
            {COLORS.map((c) => (
              <ColorDot
                key={c.name}
                hex={c.hex}
                name={c.name}
                selected={note.color === c.name}
                onClick={() => setColor(note.id, c.name)}
              />
            ))}
          </div>
        )}

        {showLabels && (
          <div className="absolute bottom-11 left-0 bg-white rounded-lg shadow-lg border border-neutral-200 p-2 w-56 z-10">
            <input
              autoFocus
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && labelInput.trim()) {
                  addLabelToNote(note.id, labelInput.trim());
                  setLabelInput("");
                }
              }}
              placeholder="Create or search labels"
              className="w-full text-sm px-2 py-1.5 border border-neutral-200 rounded outline-none mb-1"
            />
            <div className="max-h-32 overflow-y-auto flex flex-col">
              {allLabels
                .filter((l) => l.toLowerCase().includes(labelInput.toLowerCase()))
                .map((l) => (
                  <button
                    key={l}
                    onClick={() =>
                      note.labels.includes(l)
                        ? removeLabelFromNote(note.id, l)
                        : addLabelToNote(note.id, l)
                    }
                    className="flex items-center gap-2 text-sm px-2 py-1.5 rounded hover:bg-neutral-100 text-left"
                  >
                    <span
                      className={`w-4 h-4 border rounded-sm flex items-center justify-center shrink-0 ${
                        note.labels.includes(l)
                          ? "bg-neutral-800 border-neutral-800 text-white"
                          : "border-neutral-400"
                      }`}
                    >
                      {note.labels.includes(l) && <Check size={11} />}
                    </span>
                    {l}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}