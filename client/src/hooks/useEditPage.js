import { useMutation } from "react-query";
import { editPage } from "../services/api";

const useEditPage = (options) => {
  return useMutation({
    mutationKey: ["edit page"],
    mutationFn: editPage,
    ...options,
  });
};

export default useEditPage;
