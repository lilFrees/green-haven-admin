import { Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { BsGrid1X2Fill } from "react-icons/bs";
import { FaFileAlt } from "react-icons/fa";
import { FaCube, FaShapes, FaUserGroup } from "react-icons/fa6";
import { IoMdExit } from "react-icons/io";
import { MdStars } from "react-icons/md";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/hooks/useAuthStore";

const links = [
  {
    to: "/dashboard",
    title: "Dashboard",
    icon: <BsGrid1X2Fill />,
  },
  {
    to: "/products",
    title: "Products",
    icon: <FaCube />,
  },
  {
    to: "/categories",
    title: "Categories",
    icon: <FaShapes />,
  },
  {
    to: "/brands",
    title: "Brands",
    icon: <MdStars />,
  },
  {
    to: "/users",
    title: "Users",
    icon: <FaUserGroup />,
  },
  {
    to: "/orders",
    title: "Orders",
    icon: <FaFileAlt />,
  },
];

function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const currentSession = useAuthStore((state) => state.session);
  const logout = useAuthStore((state) => state.logout);
  useEffect(() => {
    if (!currentSession) {
      navigate("/login");
    } else if (pathname === "/") {
      navigate("/dashboard");
    }
  }, [currentSession, navigate, pathname]);

  return (
    <div className="flex h-screen overflow-y-hidden">
      <div className="flex h-full basis-72 flex-col gap-5 border-r border-slate-300 p-3">
        <h2 className="text-xl font-bold">Green Haven Admin</h2>
        <nav className="flex w-full grow flex-col gap-3">
          {links.map((link) => (
            <Link key={link.to} to={link.to}>
              <Button
                leftIcon={link.icon}
                variant="ghost"
                colorScheme="green"
                className="w-full justify-start"
                isActive={pathname.startsWith(link.to)}
              >
                <span className="w-full text-left">{link.title}</span>
              </Button>
            </Link>
          ))}
        </nav>
        <Button colorScheme="green" onClick={logout} rightIcon={<IoMdExit />}>
          {currentSession?.user.user_metadata.full_name}
        </Button>
      </div>
      <div className="h-full w-full overflow-auto p-10">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
