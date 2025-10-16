import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import './styles.css';
import { BreadcrumbNavigation, Header } from "../components";

const PrivateLayout: React.FC = () => {
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        <BreadcrumbNavigation />
        <div className="p-5">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PrivateLayout;