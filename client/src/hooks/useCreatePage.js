import { useMutation } from "react-query";
import { createPage } from "../services/api";
import { useNavigate } from "react-router-dom";

const useCreatePage = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["create-page"],
    mutationFn: createPage,
    onSuccess: () => {
      navigate("/connect-withdrawal-account");
    },
    onError: (error) => {
      if (error.response.status === 409) {
        navigate("/dashboard");
      }
    },
  });
};

export default useCreatePage;
