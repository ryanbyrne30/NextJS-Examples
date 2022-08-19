import Link from "next/link";
import { useSession } from "next-auth/react";
import { BiMenuAltRight } from "react-icons/bi";
import { AiFillHome } from "react-icons/ai";
import { useEffect, useState } from "react";

const links = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "AWS",
    href: "/aws",
  },
];

const authLinks: { label: string; href: string }[] = [];

export default function Navbar() {
  const [navLinks, setNavLinks] = useState(links);
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(isOpen ? false : true);

  useEffect(() => {
    if (session?.user !== undefined) {
      setNavLinks(links.concat(authLinks));
    }
  }, [session]);

  return (
    <div className="w-screen px-4 py-1 z-50 bg-main-d border-b-2 border-tertiary">
      <div className="flex flex-row items-center justify-between">
        <Link href="/">
          <div>
            <AiFillHome className="w-6 h-6 text-title" />
          </div>
        </Link>
        <BiMenuAltRight
          onClick={toggleMenu}
          className="w-8 h-8 cursor-pointer text-title"
        />
      </div>
      <ul
        className={`flex flex-col items-center justify-center overflow-hidden transition-all ${
          isOpen ? "h-screen" : "h-0"
        }`}
      >
        {navLinks.map((l) => (
          <li key={l.href} className="p-2" onClick={toggleMenu}>
            <Link href={l.href}>{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
