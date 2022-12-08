import { useEffect, useState } from "react";
import { getAuthUser } from "../store/auth";
import { User } from "../types";

interface Props {
  loadOnInit?: boolean;
}

const useCurrentUser = ({ loadOnInit = true }: Props) => {
  const [currentUser, setCurrentUser] = useState<User | undefined>();

  const refreshCurrentUser = () =>
    getAuthUser().then((authUser) => {
      setCurrentUser(authUser);
      return authUser;
    });

  useEffect(() => {
    if (loadOnInit) {
      refreshCurrentUser();
    }
  }, []);

  return { currentUser, refreshCurrentUser };
};

export default useCurrentUser;
