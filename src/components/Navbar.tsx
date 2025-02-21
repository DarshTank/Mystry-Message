"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();

  const user = session?.user;

  return (
    <nav className="p-4 md:p-6 bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a className="text-2xl font-bold mb-4 md:mb-0 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600" href="#">
          Mystry Message
        </a>
        {session ? (
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline">
              <b>Welcome,</b> {user?.name || user?.email}
            </span>
            <Button className="w-full md:w-auto bg-pink-500 hover:bg-pink-600 text-white" onClick={() => signOut()}>
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto bg-pink-500 hover:bg-pink-600 text-white">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
