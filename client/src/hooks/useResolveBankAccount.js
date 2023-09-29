import { useMutation } from "react-query";
import { resolveBankAccount } from "../services/api";

const useResolveBankAccount = () => {
  return useMutation({
    mutationKey: ["resolve-account"],
    mutationFn: resolveBankAccount,
  });
};

export default useResolveBankAccount;
