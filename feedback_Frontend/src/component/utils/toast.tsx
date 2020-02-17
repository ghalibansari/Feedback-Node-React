import {toast} from 'react-toastify'

//Css props for toast.
const toastConfig: any = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
};

//toast Successfull @param {message}
export const toastSuccess = (message: string) => {
    toast.success(message, toastConfig)
};

//toast Information @param {message}
export const toastInfo = (message: string) => {
    toast.info(message, toastConfig)
};

//toast Warning @param {message}
export const toastWarning = (message: string) => {
    toast.warn(message, toastConfig)
};

//toast Error @param {message}
export const toastError = (message: string) => {
    toast.error(message, toastConfig)
};

//toast Default @param {message}
export const toastDefault = (message: string) => {
    toast(message, toastConfig)
};