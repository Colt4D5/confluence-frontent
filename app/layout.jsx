import Header from "@/components/Header";
import { Montserrat } from "next/font/google";
import "./globals.css";
import '@picocss/pico';
import { ToastContainer } from 'react-toastify';
import Footer from "@/components/Footer";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata = {
  title: "Confluence doc thingy",
  description: "Maritz (Let's be real, CDS) Confluence doc app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${montserrat.variable}`}>
        <Header />
        {children}
        <Footer />
        <ToastContainer />
      </body>
    </html>
  );
}
