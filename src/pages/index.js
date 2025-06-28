import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import LoginPage from "./login";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import { useRouter } from 'next/router';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return null;
}
