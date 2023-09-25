import { useQuery } from "react-query";
import { fetchBanksByCountry } from "../services/api";
import axios from "axios";

const useBanks = (country) => {
  return useQuery({
    queryKey: `banks:${country}`,
    queryFn: () => fetchBanksByCountry(country),
  });
};

export default useBanks;
