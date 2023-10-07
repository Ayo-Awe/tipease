import { useQuery } from "react-query";
import { getTipSummary } from "../services/api";

const useTipSummary = () => {
  return useQuery({
    queryKey: ["tip summary"],
    queryFn: getTipSummary,
  });
};

export default useTipSummary;
