import { Link, Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import {
  HiCog,
  HiCog6Tooth,
  HiCurrencyDollar,
  HiEye,
  HiHome,
} from "react-icons/hi2";
import useUser from "../hooks/useUser";
import { getHostUrl } from "../utils";

const Dashboard = () => {
  const user = useUser();
  return (
    <>
      <NavBar />

      <div className="grid grid-cols-8 p-8 shadow-md">
        <nav className="col-span-2 h-full w-full">
          <ul className="ml-12">
            <div className="pb-4 align-baseline">
              <HiHome className="inline mr-2" />
              <Link to={"/dashboard"} className="p-0 m-0">
                Home
              </Link>
            </div>
            <div className="pb-4 align-baseline">
              <HiEye className="inline mr-2" />
              <Link
                className="p-0 m-0"
                to={`${getHostUrl()}/${user.data?.page.slug}`}
              >
                View Page
              </Link>
            </div>
            <div className="pb-4 align-baseline">
              <HiCurrencyDollar className="inline mr-2" />
              <Link to={"/dashboard/tips"} className="p-0 m-0">
                Tips
              </Link>
            </div>
            <div className="pb-4 align-baseline">
              <HiCog6Tooth className="inline mr-2" />
              <Link to={"/dashboard/settings"} className="p-0 m-0">
                Settings
              </Link>
            </div>
          </ul>
        </nav>
        <main className="col-span-6">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Dashboard;
