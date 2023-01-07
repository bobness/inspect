import { useContext } from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";

const useCurrentUserContext = () => {
  const currentUser = useContext(CurrentUserContext);

  return currentUser;
};

export default useCurrentUserContext;
