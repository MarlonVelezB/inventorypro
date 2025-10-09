import { useState } from "react";
import Icon from "../AppIcon";
import "./SidebarStyles.css";
import { Button } from "antd";
import SidebarMenu from "./SibebarMenu";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  const handleToggle = () => setIsCollapsed(!isCollapsed);

  return (
    <aside>
      {/* menu haburguesa */}
      <div className="menu-hamburguesa">
        <div className="flex items-center gap-2">
          <div className="logo-container">
            <Icon
              className={`boxIcon ${
                isCollapsed && isLogoHovered ? "boxIconOutside" : ""
              }`}
              name="Box"
              size={20}
              color="white"
            />
          </div>
          <h1 className="sidebar-title">InventoryPro</h1>
        </div>

        <Icon name="Menu" size={20} color="black" style={{ margin: "10px" }} />
      </div>

      <div className={`sidebar-layout ${isCollapsed ? "collapsed" : ""}`}>
        {/* HEADER */}
        <div className="sidebar-header">
          <button
            className="logo-container"
            onMouseEnter={() => isCollapsed && setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
            onClick={handleToggle}
            aria-label={isCollapsed ? "Expand sidebar" : "InventoryPro"}
            disabled={!isCollapsed}
          >
            <Icon
              className={`box-icon ${
                isCollapsed && isLogoHovered ? "hidden" : ""
              }`}
              name="Box"
              size={20}
              color="white"
            />
            <Icon
              className={`arrow-icon ${
                isCollapsed && isLogoHovered ? "visible" : ""
              }`}
              name="ChevronRight"
              size={20}
              color="white"
            />
          </button>

          {!isCollapsed && <h1 className="sidebar-title">InventoryPro</h1>}

          {!isCollapsed && (
            <Button
              onClick={handleToggle}
              type="text"
              icon={<Icon name="ChevronLeft" size={16} />}
              className="collapse-btn"
            />
          )}
        </div>

        <div className={`sidebar-content ${isCollapsed ? "collapsed" : ""}`}>
            {/* MENU */}
            <SidebarMenu collapsed={isCollapsed}/>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
