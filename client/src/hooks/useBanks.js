import { useQuery } from "react-query";
import { fetchBanksByCountry } from "../services/api";

const useBanks = (options) => {
  return useQuery({
    queryKey: ["banks", options],
    queryFn: () => fetchBanksByCountry(options),
    enabled: !!options,
  });
};

export default useBanks;
