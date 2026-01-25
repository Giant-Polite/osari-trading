import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();

  // Define paths where you don't want the footer to appear
  const hideFooterPaths = ["/login"];
  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default Layout;