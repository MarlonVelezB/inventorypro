import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import './styles.css';
import Header from "../components/Header";

const PrivateLayout: React.FC = () => {
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateLayout;