import { toast } from 'react-toastify';

const success = (message, autoClose = true) => {
    toast.success(message, {
        position: "top-center",
        autoClose: autoClose ? 2500 : false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        pauseOnFocusLoss: false,
        draggable: false,
        progress: undefined,
        toastId: 1,
        });
}

const error = (message, autoClose = true) => {
    toast.error(message, {
        position: "top-center",
        autoClose: autoClose ? 2500 : false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        pauseOnFocusLoss: false,
        draggable: false,
        progress: undefined,
        toastId: 2,
        });
}

const warning = (message, autoClose = true) => {
    toast.warning(message, {
        position: "top-center",
        autoClose: autoClose ? 2500 : false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        pauseOnFocusLoss: false,
        draggable: false,
        progress: undefined,
        toastId: 3,
    });
}

const info = (message, autoClose = true) => {
    toast.info(message, {
        position: "top-center",
        autoClose: autoClose ? 2500 : false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        pauseOnFocusLoss: false,
        draggable: false,
        progress: undefined,
        toastId: 4,
    });
}

const loading = () => {
    const id = toast.loading(
        "Por favor, espere.", {
        position: "top-center",
        closeOnClick: false,
        draggable: false,
        toastId: 5,
    });
    return id
}

const updateSuccess = (id, message, autoClose = true) => {
    toast.update(id, {
        render: message,
        type: "success",
        autoClose: autoClose ? 3000 : false,
        isLoading: false,
        pauseOnHover: true,
        pauseOnFocusLoss: false,
        position: "top-center",
        closeOnClick: true,
        draggable: false,
        progress: undefined,
        toastId: 5,
    })
}

const updateError = (id, message, autoClose = true) => {
    toast.update(id, {
        render: message,
        type: "error",
        autoClose: autoClose ? 3000 : false,
        isLoading: false,
        pauseOnHover: true,
        pauseOnFocusLoss: false,
        position: "top-center",
        closeOnClick: true,
        draggable: false,
        progress: undefined,
        toastId: 5,
    })
}

const alerts = {success, error, warning, info, loading, updateSuccess, updateError};

export default alerts;