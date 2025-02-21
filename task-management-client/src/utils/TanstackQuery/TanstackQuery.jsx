import { useQuery } from "@tanstack/react-query";
import { useSecureAxios } from "../AxiosInstance/SecureAxiosInstance";
export const useUsers = () => {
  const axios = useSecureAxios();
  return useQuery({
    queryKey: ["loggedUser"],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/user/authUser`);
        return response?.data?.user;
      } catch (error) {
        return error?.response?.data?.user;
      }
    },
  });
};