import AlertContext from "./alert-context"
import { Toast } from 'flowbite-react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { AlertType, IAlert } from "../utils/interfaces";
import { useEffect, useState } from "react";

const successStyle = "bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200"
const failStyle = "bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200"

const AlertProvider = (props: any) => {

  const [text, setText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>("success");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setShowAlert(false);
    }, 5000)
  }, [showAlert, text, alertType])

  const isSuccess = (_alertType: AlertType = alertType):boolean => {
    return _alertType === "success";
  }

  const onAlertHandler = (alert: IAlert) => {    
    setShowAlert(true);
    setText(alert.message);
    setAlertType(alert.alertType);
  }

  return (
    <AlertContext.Provider value={{onAlertHandler}}>
      {showAlert && <div className="flex justify-center">
          <Toast>
            <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isSuccess()? successStyle : failStyle}`}>
              {isSuccess()? <CheckIcon className="h-5 w-5" /> : <XMarkIcon className="h-5 w-5" />}
            </div>
            <div className="ml-3 text-sm font-normal">
              <div dangerouslySetInnerHTML={{__html: text}}></div>
            </div>
          </Toast>
        </div>}
      {props.children}
    </AlertContext.Provider>
  )
}

export default AlertProvider;