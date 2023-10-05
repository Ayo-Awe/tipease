import { useQuery } from "react-query";
import { getPageBySlug } from "../services/api";

const usePage = (slug) => {
  return useQuery({
    queryKey: ["page", slug],
    queryFn: () => getPageBySlug(slug),
    enabled: !!slug,
  });
};

export default usePage;
