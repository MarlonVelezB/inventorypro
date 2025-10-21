import { NavLink } from "react-router-dom";
import Icon from "../AppIcon";
import SidebarDropdown from "./SibebarDropdown";
import type { SidebarMenuProps } from "../../types/component.types";

const ROUTES: SidebarMenuProps[] = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "LayoutDashboard",
    type: "link",
  },
  {
    path: "/product-management",
    name: "Product",
    icon: "Box",
    type: "link",
  },
  {
    path: "",
    name: "Vouchers",
    icon: "FileText",
    type: "dropdown",
    children: [
      { path: "/voucher/pre-invoice", name: "Pre-Invoice", type: "link" },
    ],
  },
  {
    path: "/client-management",
    name: "Clients",
    icon: "Users",
    type: "link",
  },
];

const SidebarMenu = ({ collapsed }: { collapsed: boolean }) => {
  return (
    <nav>
      <ul>
        {ROUTES.map((route) =>
          route.type === "link" ? (
            <li key={route.path}>
              <NavLink
                to={route.path}
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                aria-label="Dashboard"
              >
                <Icon className="nav-item-icon" name={route.icon} size={20} />
                {!collapsed && <span className="nav-text">{route.name}</span>}
              </NavLink>
            </li>
          ) : (
            <li key={route.name}>
              {route.children && <SidebarDropdown icon={route.icon} name={route.name} options={route.children} collapsed={collapsed}/>}
            </li>
          )
        )}
      </ul>
    </nav>
  );
};

export default SidebarMenu;
