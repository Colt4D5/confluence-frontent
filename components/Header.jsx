'use client'
import { HiDocumentSearch } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";
import { TbTagsFilled } from "react-icons/tb";
import Link from "next/link";

const handleClick = () => {
  console.log("Button clicked!");
}

export default function Header() {
    return (
      <header className="container">
        <h1><HiDocumentSearch /> Search Docs</h1>
        <nav>
          <Link href="/search"><FaSearch /></Link>
          <Link href="/tags"><TbTagsFilled /></Link>
          <Link href="/home">Home</Link>
        </nav>
    </header>
  );
}