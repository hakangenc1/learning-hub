import { Navbar } from "./_components/navbar";
import { SideBar } from "./_components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="fixed inset-y-0 z-50 flex-col hidden w-56 h-full md:flex">
        <SideBar />
      </div>
      <main className="h-full md:pl-56 pt-[80px]">{children}</main>
    </div>
  );
};

export default DashboardLayout;
