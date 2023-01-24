import React from "react";
import { AuthUser } from "../types";

const CurrentUserContext = React.createContext<AuthUser | undefined>(undefined);
export default CurrentUserContext;
