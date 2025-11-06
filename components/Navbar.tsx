import Link from "next/link";
import { CgMenuGridR } from "react-icons/cg";
import { IoDiceOutline } from "react-icons/io5";
import { SiStreamlabs } from "react-icons/si";

export default function Navbar() {
  return (
    <div className="sticky top-0 z-50 left-0 w-full h-20 flex items-center justify-between px-5 md:px-10 lg:px-20 backdrop-blur-2xl">
      {/* LOGO */}
      <div className="flex items-center gap-3 md:gap-4 lg:gap-5">
        <CgMenuGridR className="size-6 md:size-7 text-purple-400" />
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold bg-linear-to-r from-purple-500 via-violet-500 to-indigo-500 bg-clip-text text-transparent font-mono">
          ANIMI.
        </h1>
      </div>

      {/* NAV ITEMS */}
      <NavItems />

      <div></div>
    </div>
  );
}

const NavItems = () => {
  const NAV_ITEMS: { title: string; href: string; icon: any }[] = [
    {
      title: "Anime Genre",
      href: "/watch-together",
      icon: <SiStreamlabs className="text-indigo-500" />,
    },
    {
      title: "Popular Anime",
      href: "/popular",
      icon: <SiStreamlabs className="text-indigo-500" />,
    },
    {
      title: "Random",
      href: "/random",
      icon: <IoDiceOutline className="text-emerald-500" />,
    },
  ];
  return (
    <ul className="flex items-center gap-5 md:gap-10">
      {NAV_ITEMS.map((item) => (
        <li key={item.title}>
          <Link
            href={item.href}
            className="text-gray-200 hover:brightness-110  font-semibold tracking-tight flex items-center gap-2 "
          >
            {item.icon}
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );
};
