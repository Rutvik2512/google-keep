import { useContext, useState, useRef, useEffect } from "react";
import { CheckSquare, Image, BellPlus, Palette, Trash2 } from "lucide-react";
import { NotesContext } from "../context/Notescontext";
import Notecard from "../components/Notecard";

function Composer() {
  const { addNote, COLORS } = useContext(NotesContext);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [checklistMode, setChecklistMode] = useState(false);
  const [items, setItems] = useState([]);
  const [itemDraft, setItemDraft] = useState("");
  const [color, setColor] = useState("default");
  const [showColors, setShowColors] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        commit();
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, title, content, items, color]);

  const reset = () => {
    setTitle("");
    setContent("");
    setItems([]);
    setItemDraft("");
    setChecklistMode(false);
    setColor("default");
    setShowColors(false);
    setOpen(false);
  };

  const commit = () => {
    const hasChecklist = checklistMode && items.length > 0;
    if (title.trim() || content.trim() || hasChecklist) {
      addNote({
        title: title.trim(),
        content: hasChecklist ? "" : content.trim(),
        checklist: hasChecklist ? items : null,
        color,
      });
    }
    reset();
  };

  const bg = COLORS.find((c) => c.name === color)?.hex ?? "#ffffff";

  return (
    <div className="flex justify-center mb-8">
      <div
        ref={ref}
        style={{ backgroundColor: bg }}
        className="w-full max-w-xl rounded-xl border border-neutral-300 shadow-sm hover:shadow-md transition-shadow"
      >
        {!open ? (
          <button
            onClick={() => setOpen(true)}
            className="w-full text-left px-4 py-3.5 flex items-center justify-between text-neutral-600"
          >
            <span>Take a note...</span>
            <span className="flex items-center gap-3 text-neutral-500">
              <CheckSquare
                size={20}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(true);
                  setChecklistMode(true);
                }}
              />
              <Image size={20} />
            </span>
          </button>
        ) : (
          <div className="p-4">
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full bg-transparent outline-none font-medium text-neutral-900 mb-2 placeholder:text-neutral-500"
            />

            {checklistMode ? (
              <div className="flex flex-col gap-1.5 mb-2">
                {items.map((it, i) => (
                  <div key={it.id} className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border border-neutral-500 shrink-0" />
                    <input
                      value={it.text}
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((p, idx) => (idx === i ? { ...p, text: e.target.value } : p))
                        )
                      }
                      className="flex-1 bg-transparent outline-none text-sm"
                    />
                    <button
                      onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-neutral-400 hover:text-neutral-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <input
                  value={itemDraft}
                  onChange={(e) => setItemDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && itemDraft.trim()) {
                      setItems((prev) => [
                        ...prev,
                        { id: crypto.randomUUID(), text: itemDraft.trim(), done: false },
                      ]);
                      setItemDraft("");
                    }
                  }}
                  placeholder="List item"
                  className="w-full bg-transparent outline-none text-sm text-neutral-600 pl-6"
                />
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Take a note..."
                rows={3}
                className="w-full bg-transparent outline-none resize-none text-sm text-neutral-800 placeholder:text-neutral-500 mb-2"
              />
            )}

            <div className="flex items-center justify-between pt-1 relative">
              <div className="flex items-center gap-0.5 text-neutral-600">
                <button
                  onClick={() => setChecklistMode((s) => !s)}
                  className="p-2 rounded-full hover:bg-black/10"
                  aria-label="Toggle checklist"
                >
                  <CheckSquare size={18} />
                </button>
                <button className="p-2 rounded-full hover:bg-black/10" aria-label="Add image">
                  <Image size={18} />
                </button>
                <button className="p-2 rounded-full hover:bg-black/10" aria-label="Add reminder">
                  <BellPlus size={18} />
                </button>
                <button
                  onClick={() => setShowColors((s) => !s)}
                  className="p-2 rounded-full hover:bg-black/10"
                  aria-label="Background color"
                >
                  <Palette size={18} />
                </button>

                {showColors && (
                  <div className="absolute bottom-11 left-0 bg-white rounded-lg shadow-lg border border-neutral-200 p-2 flex flex-wrap gap-1.5 w-48 z-10">
                    {COLORS.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setColor(c.name)}
                        title={c.name}
                        style={{ backgroundColor: c.hex }}
                        className={`w-7 h-7 rounded-full border hover:scale-110 transition-transform ${
                          color === c.name ? "ring-2 ring-offset-1 ring-neutral-900" : "border-neutral-300"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={commit}
                className="text-sm text-neutral-700 hover:bg-black/5 px-4 py-1.5 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MasonryGrid({ notes }) {
  if (notes.length === 0) return null;
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
      {notes.map((n) => (
        <Notecard key={n.id} note={n} variant="active" />
      ))}
    </div>
  );
}

export default function Notes() {
  const { notes, searchTerm } = useContext(NotesContext);

  const visible = notes.filter(
    (n) =>
      !n.archived &&
      !n.trashed &&
      (n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pinned = visible.filter((n) => n.pinned);
  const others = visible.filter((n) => !n.pinned);

  return (
    <div className="px-6 py-6 max-w-6xl mx-auto w-full">
      <Composer />

      {visible.length === 0 && (
        <p className="text-center text-neutral-400 mt-16">
          {searchTerm ? "No matching notes" : "Notes you add appear here"}
        </p>
      )}

      {pinned.length > 0 && (
        <>
          <h2 className="text-xs font-medium tracking-wide text-neutral-500 mb-2 uppercase">
            Pinned
          </h2>
          <MasonryGrid notes={pinned} />
          {others.length > 0 && (
            <h2 className="text-xs font-medium tracking-wide text-neutral-500 mb-2 mt-6 uppercase">
              Others
            </h2>
          )}
        </>
      )}

      <MasonryGrid notes={others} />
    </div>
  );
}