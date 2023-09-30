import { useMutation } from "react-query";
import { connectWithdrawalAccount } from "../services/api";
import { useNavigate } from "react-router-dom";

const useConnectAccount = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ["connect-withdrawal-account"],
    mutationFn: connectWithdrawalAccount,
    onSuccess: () => {
      navigate("/dashboard");
    },
  });
};

export default useConnectAccount;
