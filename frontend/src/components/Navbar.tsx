import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = localStorage.getItem("email");

  const getTitle = () => {
    if (location.pathname === "/dashboard") return "Dashboard";
    return "";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("expenses");
    navigate("/");
  };

  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6">
      {/* Left */}
      <span className="text-lg font-semibold text-gray-800">
        {getTitle()}
      </span>

      {/* Right */}
      <div className="flex items-center gap-4">
        {email && (
          <span className="text-sm text-gray-600">
            {email}
          </span>
        )}

        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
