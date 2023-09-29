import { useQuery } from "react-query";
import { checkSlugAvailability } from "../services/api";

const useSlug = (slug) => {
  return useQuery({
    queryKey: ["slug", slug],
    queryFn: () => checkSlugAvailability(slug),
    enabled: !!slug,
    retry: false,
  });
};

export default useSlug;
