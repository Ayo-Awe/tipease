import { useQuery } from "react-query";
import { getTips } from "../services/api";

const useGetTips = () => {
  return useQuery({
    queryKey: ["tips"],
    queryFn: getTips,
  });
};

export default useGetTips;
