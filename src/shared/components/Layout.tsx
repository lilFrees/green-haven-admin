import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BsGrid1X2Fill } from "react-icons/bs";
import {
  FaCube,
  FaMoneyBillWave,
  FaShapes,
  FaUserGroup,
} from "react-icons/fa6";
import { IoMdExit } from "react-icons/io";
import { MdStars } from "react-icons/md";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuthStore } from "../../features/auth/hooks/useAuthStore";
import { supabase } from "../supabase/client";
import { motion } from "framer-motion";
const links = [
  {
    to: "/dashboard",
    title: "Dashboard",
    icon: BsGrid1X2Fill,
  },
  {
    to: "/products",
    title: "Products",
    icon: FaCube,
  },
  {
    to: "/categories",
    title: "Categories",
    icon: FaShapes,
  },
  {
    to: "/brands",
    title: "Brands",
    icon: MdStars,
  },
  {
    to: "/users",
    title: "Users",
    icon: FaUserGroup,
  },
  {
    to: "/orders",
    title: "Orders",
    icon: FaMoneyBillWave,
  },
];

function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, session } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        logout();
        navigate("/login");
      }
    }

    if (!session) {
      navigate("/login");
    } else if (pathname === "/") {
      navigate("/dashboard");
    }

    checkSession();
  }, [session, navigate, pathname, logout]);

  return (
    <div className="relative flex h-screen overflow-y-hidden">
      <motion.div
        initial={{
          width: "4rem",
        }}
        animate={{
          width: isExpanded ? "16rem" : "4.5rem",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        className="absolute z-10 flex h-full flex-col gap-5 border-r border-slate-300 bg-white/20 p-3 backdrop-blur-sm"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="h-12 w-12 rounded-lg p-1">
          <img
            src={logo}
            alt="Logo"
            className="h-full w-full object-contain text-left"
          />
        </div>
        <nav className="flex grow flex-col gap-3">
          {links.map((link) => (
            <Link key={link.to} to={link.to}>
              <Button
                variant="ghost"
                colorScheme="green"
                className="flex w-full items-center"
                isActive={pathname.startsWith(link.to)}
              >
                <link.icon fontSize={16} className="shrink-0" />
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: isExpanded ? 1 : 0,
                    x: isExpanded ? 10 : -20,
                  }}
                  transition={{ duration: 0.3, delay: isExpanded ? 0.1 : 0 }}
                  style={{
                    width: isExpanded ? "max-content" : "0",
                    overflow: "hidden",
                  }}
                  className="w-0 grow whitespace-nowrap text-left"
                >
                  {link.title}
                </motion.span>
              </Button>
            </Link>
          ))}
        </nav>

        <Button
          colorScheme="green"
          iconSpacing={0}
          onClick={logout}
          rightIcon={<IoMdExit />}
          className="absolute bottom-5 w-full"
        >
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: isExpanded ? 1 : 0,
              x: isExpanded ? 0 : -20,
            }}
            transition={{ duration: 0.3 }}
          >
            {session?.user.user_metadata.full_name}
          </motion.span>
        </Button>
      </motion.div>
      <div className="ml-16 h-full w-full overflow-auto p-10">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
