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
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateLayout;