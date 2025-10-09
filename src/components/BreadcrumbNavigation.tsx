import { Link, useLocation } from "react-router-dom";
import Icon from "./AppIcon";

const BreadcrumbNavigation = () => {
  const location = useLocation();

  const getSectionName = (path: string) => {
    switch (path) {
      case "/product-management":
        return "Product Management";
      case "/pre-invoice-generator":
        return "Pre-Invoice Generator";
      case "/client-management":
        return "Client Management";
      default:
        return "";
    }
  };

  return (
    <nav
      className="flex items-center space-x-2 text-sm p-5"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        <li className="flex items-center">
          {location.pathname !== "/dashboard" ? (
            <div className="flex items-center">
              <Link
                to={"/dashboard"}
                className="text-gray-500 hover:text-(--color-blue-primary) transition-smooth focus:outline-none focus:underline"
              >
                Dashboard
              </Link>
              <Icon
                name="ChevronRight"
                size={16}
                className="text-muted-foreground mx-2"
              />
              <span className="text-(--color-muted-foreground)">
                {getSectionName(location.pathname)}
              </span>
            </div>
          ) : (
            <span className="text-gray-500">Dashboard</span>
          )}
        </li>
      </ol>
    </nav>
  );
};

export default BreadcrumbNavigation;
