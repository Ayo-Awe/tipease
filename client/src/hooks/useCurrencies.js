import { useQuery } from "react-query";
import { fetchCurrencies } from "../services/api";

const useCurrencies = () => {
  return useQuery({
    queryKey: `currencies`,
    queryFn: fetchCurrencies,
  });
};

export default useCurrencies;
