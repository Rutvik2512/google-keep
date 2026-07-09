import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { NotesContext } from "../context/Notescontext";
import {
  Lightbulb,
  BellRing,
  Tag,
  Pencil,
  Archive,
  Trash2,
} from "lucide-react";

const baseItem =
  "flex items-center gap-5 h-12 pr-6 rounded-r-full cursor-pointer text-sm transition-colors";

function Item({ to, icon: Icon, label, collapsed, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `${baseItem} ${collapsed ? " pl-8.5 justify-center  w-12" : "pl-6"} ${
          isActive
            ? "bg-yellow-100 text-neutral-900 font-medium"
            : "text-neutral-700 hover:bg-neutral-100"
        }`
      }
    >
      <Icon size={20} strokeWidth={1.8} className="shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}

export default function Sidebar() {
  const { sidebarOpen, allLabels } = useContext(NotesContext);
  const collapsed = !sidebarOpen;

  return (
    <aside
      className={`shrink-0 h-full overflow-y-auto pt-2 pb-4 transition-all duration-200 ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      <nav className="flex flex-col gap-0.5 justify-center">
        <Item to="/" end icon={Lightbulb} label="Notes" collapsed={collapsed} />
        <Item to="/reminders" icon={BellRing} label="Reminders" collapsed={collapsed} />

        {!collapsed && allLabels.length > 0 && (
          <div className="mt-2 flex flex-col gap-0.5">
            {allLabels.map((label) => (
              <Item
                key={label}
                to={`/label/${encodeURIComponent(label)}`}
                icon={Tag}
                label={label}
                collapsed={collapsed}
              />
            ))}
          </div>
        )}

        <Item to="/labels" icon={Pencil} label="Edit labels" collapsed={collapsed} />
        <Item to="/archive" icon={Archive} label="Archive" collapsed={collapsed} />
        <Item to="/bin" icon={Trash2} label="Bin" collapsed={collapsed} />
      </nav>
    </aside>
  );
}