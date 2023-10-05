import { useMutation } from "react-query";
import { createTip } from "../services/api";

const useTip = (slug, options) => {
  return useMutation({
    mutationFn: (payload) => createTip(slug, payload),
    ...options,
  });
};

export default useTip;
