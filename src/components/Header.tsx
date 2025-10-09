import UserProfileDropdown from "./user-profile-dropdown/UserProfileDropdown";

const Header = () => {
  return (
    <header className="bg-(--color-card) border-b border-border sticky top-0 z-1000">
      <div className="flex items-center justify-end h-20 px-6">
        <div className="flex items-center space-x-4">
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
