import { useGlobalState } from "../../context/GlobalStateProvider";
import {
  MoonIcon,
  SunIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import Logo from "./Logo";
import NavItem from "./NavItem";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Search from "./Search";
import MobileMenu from "./MobileMenu";

const variants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0 },
};

export default function Header() {
  const { state, setState } = useGlobalState();

  const [mode, setMode] = useState("");
  useEffect(() => {
    setMode(state.mode as string);
  }, [state.mode]);

  const handleModeSwitchClick = (): void => {
    if ("theme" in localStorage) {
      setState({
        mode: localStorage.theme === "dark" ? "light" : "dark",
      });
      localStorage.theme = localStorage.theme === "dark" ? "light" : "dark";

      if (localStorage.theme === "dark") {
        document.documentElement.classList.add("dark");
        return;
      }
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <motion.div variants={variants} initial="hidden" animate="visible">
      <header className="relative">
        <div className="mx-auto max-w-6xl px-5 py-0 md:py-4 lg:py-8 xl:px-0 xl:py-14">
          <div className="flex items-center justify-between py-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link href="/" scroll={false}>
                <span className="sr-only">Doğukan Öksüz</span>
                <Logo mode={mode} />
              </Link>
            </div>

            <nav className="hidden space-x-10 md:flex">
              <NavItem url="/page/ben-kimim">Hakkımda</NavItem>
              <NavItem url="/page/referanslar">İşler</NavItem>
              <NavItem url="/page/iletisim">İletişim</NavItem>
            </nav>

            <div className="items-center justify-end md:flex md:flex-1 lg:w-0">
              <a
                id="search"
                className="float-left whitespace-nowrap p-2 text-base font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
              >
                <Search>
                  <MagnifyingGlassIcon className="h-6 w-6" />
                </Search>
              </a>

              <a
                onClick={() => handleModeSwitchClick()}
                id="mode-switch"
                className="float-left whitespace-nowrap p-2 text-base font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
              >
                {mode == "dark" ? (
                  <SunIcon className="h-6 w-6" />
                ) : (
                  <MoonIcon className="h-6 w-6" />
                )}
              </a>

              <a
                id="mobile-menu"
                className="md:hidden float-left whitespace-nowrap p-2 text-base font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
              >
                <MobileMenu mode={mode}>
                  <Bars3Icon className="h-6 w-6" />
                </MobileMenu>
              </a>
            </div>
          </div>
        </div>
      </header>
    </motion.div>
  );
}
