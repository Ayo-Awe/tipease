import { useQuery } from "react-query";
import { getUserPage } from "../services/api";

const useUserPage = () => {
  return useQuery({
    queryKey: ["pages", "me"],
    queryFn: getUserPage,
    retry: false,
  });
};

export default useUserPage;
