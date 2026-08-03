import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import TermsOfServiceModal from "./TermsOfServiceModal";
import { usePageTracker } from "@/hooks/usePageTracker";

const Layout = ({ children }: { children: ReactNode }) => {
  usePageTracker();
  return (
    <div className="min-h-screen flex flex-col">
      <TermsOfServiceModal />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
