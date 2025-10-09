import { Avatar, Divider } from "antd";
import Icon from "../AppIcon";
import { useEffect, useRef, useState } from "react";
import "./styles.css";
import { Link } from "react-router-dom";

const UserProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  /* Guarda una referencia mutable a un valor 
  o a un elemento del DOM sin provocar renderizados adicionales cuando cambia. */
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        dropdownRef?.current &&
        !dropdownRef?.current?.contains(event?.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    // Se limpia al desmontar el componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        className="flex items-center gap-3 cursor-pointer p-2 rounded-lg text-foreground hover:bg-(--color-muted) transition-smooth"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Avatar
          src={
            "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
          }
        />
        <div>
          <p className="text-sm font-medium text-foreground truncate max-w-32">
            User Test
          </p>
          <p className="text-xs text-muted-foreground truncate max-w-32">
            Administrator
          </p>
        </div>
        <Icon
          name="ChevronDown"
          className={`w-4 h-4 text-muted-foreground icon-dropdown ${
            isOpen ? "open" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-4 mt-2 w-48 bg-(--color-popover) border border-border rounded-lg shadow-lg z-50 dropdown-user-content">
          <ul className="py-1">
            <li>
              <Link
                className="block px-4 py-2 text-sm text-foreground hover:bg-(--color-muted) transition-smooth"
                to={""}
                aria-label="Profile"
              >
                <Icon name="User" className="w-4 h-4 inline-block mr-2" />
                Profile
              </Link>
            </li>
            <li>
              <Link
                className="block px-4 py-2 text-sm text-foreground hover:bg-(--color-muted) transition-smooth"
                to={""}
                aria-label="Settings"
              >
                <Icon name="Settings" className="w-4 h-4 inline-block mr-2" />
                Settings
              </Link>
            </li>
            <Divider style={{ margin: "3px 0 3px" }} />
            <li>
              <button className="w-full text-left block px-4 py-2 text-sm hover:bg-(--color-destructive-hover) transition-smooth cursor-pointer">
                <Icon
                  name="LogOut"
                  className="w-4 h-4 inline-block mr-2 text-(--color-destructive)"
                />
                <span className="text-sm text-destructive text-(--color-destructive)">
                  Log out
                </span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
