import {toast} from 'react-toastify'

const toastConfig: any = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    }
    
    export const toastSuccess = (message: string) => {
    toast.success(message, toastConfig)
    }
    
    export const toastInfo = (message: string) => {
    toast.info(message, toastConfig)
    }
    
    export const toastWarning = (message: string) => {
    toast.warn(message, toastConfig)
    }
    
    export const toastError = (message: string) => {
    toast.error(message, toastConfig)
    }
    
    export const toastDefault = (message: string) => {
    toast(message, toastConfig)
    }