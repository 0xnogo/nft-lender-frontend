import React, { ReactNode } from "react";
import { IAlert } from "../utils/interfaces";

const AlertContext = React.createContext({
  onAlertHandler: (message: IAlert) => {},
})

export default AlertContext;