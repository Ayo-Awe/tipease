import { useQuery } from "react-query";
import { getUser } from "../services/api";

const useUser = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: getUser,
  });
};

export default useUser;
