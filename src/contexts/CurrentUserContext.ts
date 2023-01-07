import React from "react";
import { User } from "../types";

const CurrentUserContext = React.createContext<User | undefined>(undefined);
export default CurrentUserContext;
