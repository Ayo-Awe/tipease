import { Navigate, Outlet, useNavigate } from "react-router-dom";
import useUserPage from "../hooks/useUserPage";
import { Spinner } from "@nextui-org/react";

const RequireUserPage = () => {
  const { isSuccess, isLoading, error } = useUserPage();

  // Show loading state
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {isSuccess || error.response.status !== 404 ? (
        <Outlet />
      ) : (
        <Navigate to={"/complete-page"} />
      )}
    </>
  );
};

export default RequireUserPage;
