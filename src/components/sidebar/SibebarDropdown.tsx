import { useEffect, useState } from "react";
import Icon from "../AppIcon";
import type {
  IconName,
  SidebarMenuWithOptionalIcon,
} from "../../types/componentTypes";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

const SidebarDropdown = ({
  options,
  name,
  icon,
  collapsed,
}: {
  options: SidebarMenuWithOptionalIcon[];
  name: string;
  icon: IconName;
  collapsed?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsedState, setCollapsedState] = useState(collapsed);
  const location = useLocation();

  useEffect(() => {
    // Buscar una coincidencia de ruta
    const found = options.some((option) =>
      location.pathname.toLowerCase().includes(option.path.toLowerCase())
    );

    // Actualizar estados de manera más directa
    if (collapsed) {
      setIsOpen(false);
      setCollapsedState(found);
    } else {
      setIsOpen(found);
      setCollapsedState(false);
    }
  }, [collapsed, location.pathname, options]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      <div
        className={`dropdown nav-item ${collapsedState && "active"}`}
        onClick={toggleDropdown}
      >
        <div className="flex items-center gap-2">
          <Icon name={icon || "Folder"} size={20} />
          {!collapsed && <span className="nav-text">{name}</span>}
        </div>
        <Icon
          className={`icon-dropdown ${isOpen ? "rotated" : ""}`}
          name="ChevronDown"
          size={20}
        />
      </div>
      <div className={`dropdown-content ${isOpen ? "visible" : ""}`}>
        <ul>
          {options.map((option) => (
            <li key={option.path}>
              <NavLink
                to={option.path}
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                aria-label={option.name}
              >
                <span className="nav-text">{option.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarDropdown;
