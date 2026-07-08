import { createContext, useState, useMemo } from "react";

export const NotesContext = createContext(null);

const COLORS = [
  { name: "default", hex: "#ffffff" },
  { name: "coral", hex: "#faafa8" },
  { name: "peach", hex: "#f39f76" },
  { name: "sand", hex: "#fff8b8" },
  { name: "mint", hex: "#e2f6d3" },
  { name: "sage", hex: "#b4ddd3" },
  { name: "fog", hex: "#d4e4ed" },
  { name: "storm", hex: "#aeccdc" },
  { name: "dusk", hex: "#d3bfdb" },
  { name: "blossom", hex: "#f6e2dd" },
  { name: "clay", hex: "#e9e3d4" },
  { name: "chalk", hex: "#efeff1" },
];

const seedNotes = [
  {
    id: crypto.randomUUID(),
    title: "Welcome to Keep",
    content: "Pin your most important notes, colour-code the rest, and search across everything from the bar up top.",
    color: "sand",
    pinned: true,
    archived: false,
    trashed: false,
    labels: ["Getting started"],
    reminder: null,
    checklist: null,
    createdAt: Date.now() - 100000,
  },
  {
    id: crypto.randomUUID(),
    title: "Grocery run",
    content: "",
    color: "mint",
    pinned: true,
    archived: false,
    trashed: false,
    labels: ["Personal"],
    reminder: null,
    checklist: [
      { id: crypto.randomUUID(), text: "Oat milk", done: false },
      { id: crypto.randomUUID(), text: "Sourdough", done: true },
      { id: crypto.randomUUID(), text: "Basil", done: false },
    ],
    createdAt: Date.now() - 90000,
  },
  {
    id: crypto.randomUUID(),
    title: "Sprint retro notes",
    content: "Ship the search index fix, revisit the onboarding copy, pair on the flaky test suite before Friday.",
    color: "fog",
    pinned: false,
    archived: false,
    trashed: false,
    labels: ["Work"],
    reminder: null,
    checklist: null,
    createdAt: Date.now() - 80000,
  },
  {
    id: crypto.randomUUID(),
    title: "Book club",
    content: "Finish chapters 4-6 of Klara and the Sun before Thursday's call.",
    color: "dusk",
    pinned: false,
    archived: false,
    trashed: false,
    labels: ["Personal"],
    reminder: "2026-07-10T18:00",
    checklist: null,
    createdAt: Date.now() - 70000,
  },
  {
    id: crypto.randomUUID(),
    title: "Design review",
    content: "Check contrast on the empty states, confirm the focus rings are visible on the sidebar.",
    color: "default",
    pinned: false,
    archived: false,
    trashed: false,
    labels: ["Work"],
    reminder: null,
    checklist: null,
    createdAt: Date.now() - 60000,
  },
];

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState(seedNotes);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [gridView, setGridView] = useState(true);

  const addNote = (note) => {
    setNotes((prev) => [
      {
        id: crypto.randomUUID(),
        title: "",
        content: "",
        color: "default",
        pinned: false,
        archived: false,
        trashed: false,
        labels: [],
        reminder: null,
        checklist: null,
        createdAt: Date.now(),
        ...note,
      },
      ...prev,
    ]);
  };

  const updateNote = (id, changes) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...changes } : n)));
  };

  const togglePin = (id) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
  };

  const toggleArchive = (id) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, archived: !n.archived, pinned: false } : n))
    );
  };

  const trashNote = (id) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, trashed: true, archived: false, pinned: false } : n))
    );
  };

  const restoreNote = (id) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, trashed: false } : n)));
  };

  const deleteForever = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const emptyBin = () => {
    setNotes((prev) => prev.filter((n) => !n.trashed));
  };

  const setColor = (id, color) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, color } : n)));
  };

  const setReminder = (id, reminder) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, reminder } : n)));
  };

  const addLabelToNote = (id, label) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id && !n.labels.includes(label) ? { ...n, labels: [...n.labels, label] } : n
      )
    );
  };

  const removeLabelFromNote = (id, label) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, labels: n.labels.filter((l) => l !== label) } : n))
    );
  };

  const toggleChecklistItem = (id, itemId) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id && n.checklist
          ? {
              ...n,
              checklist: n.checklist.map((c) =>
                c.id === itemId ? { ...c, done: !c.done } : c
              ),
            }
          : n
      )
    );
  };

  const allLabels = useMemo(() => {
    const set = new Set();
    notes.forEach((n) => n.labels.forEach((l) => set.add(l)));
    return Array.from(set).sort();
  }, [notes]);

  const renameLabel = (oldName, newName) => {
    setNotes((prev) =>
      prev.map((n) => ({
        ...n,
        labels: n.labels.map((l) => (l === oldName ? newName : l)),
      }))
    );
  };

  const deleteLabel = (name) => {
    setNotes((prev) =>
      prev.map((n) => ({ ...n, labels: n.labels.filter((l) => l !== name) }))
    );
  };

  const value = {
    notes,
    COLORS,
    searchTerm,
    setSearchTerm,
    sidebarOpen,
    setSidebarOpen,
    gridView,
    setGridView,
    addNote,
    updateNote,
    togglePin,
    toggleArchive,
    trashNote,
    restoreNote,
    deleteForever,
    emptyBin,
    setColor,
    setReminder,
    addLabelToNote,
    removeLabelFromNote,
    toggleChecklistItem,
    allLabels,
    renameLabel,
    deleteLabel,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}