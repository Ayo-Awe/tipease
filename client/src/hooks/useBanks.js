import { useQuery } from "react-query";
import { fetchBanksByCountry } from "../services/api";

const useBanks = (country) => {
  return useQuery({
    queryKey: ["banks", country],
    queryFn: () => fetchBanksByCountry(country),
    enabled: !!country,
  });
};

export default useBanks;
