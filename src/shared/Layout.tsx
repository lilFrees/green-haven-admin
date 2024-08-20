import { Button } from "@chakra-ui/react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { BsGrid1X2Fill } from "react-icons/bs";
import { FaShapes, FaUserGroup, FaCube } from "react-icons/fa6";
import { MdStars } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import { MdComment } from "react-icons/md";

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
  {
    to: "/reviews",
    title: "Reviews",
    icon: <MdComment />,
  },
];

function App() {
  const { pathname } = useLocation();
  return (
    <div className="flex h-screen gap-10 overflow-hidden">
      <div className="flex h-full basis-72 flex-col gap-5 border-r border-slate-300 p-3">
        <h2 className="text-xl font-bold">Green Haven</h2>
        <nav className="flex w-full grow flex-col gap-3">
          {links.map((link) => (
            <Link key={link.to} to={link.to}>
              <Button
                leftIcon={link.icon}
                variant="ghost"
                colorScheme="green"
                className="w-full justify-start"
              >
                <span className="w-full text-left">{link.title}</span>
              </Button>
            </Link>
          ))}
        </nav>
        <Button colorScheme="green">Iskandarov Bobomurod</Button>
      </div>
      <div className="h-full overflow-auto p-10">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
