import { toast } from 'react-toastify';

const success = (message) => {
    toast.success(message, {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        pauseOnFocusLoss: false,
        draggable: false,
        progress: undefined,
        toastId: 1,
        });
}

const error = (message) => {
    toast.error(message, {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: false,
        progress: undefined,
        toastId: 2,
        });
}

const warning = (message) => {
    toast.warning(message, {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: false,
        progress: undefined,
        toastId: 3,
    });
}

const info = (message) => {
    toast.info(message, {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
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
        closeOnClick: true,
        draggable: false,
        toastId: 5,
    });
    return id
}

const updateSuccess = (id, message) => {
    toast.update(id, {
        render: message,
        type: "success",
        isLoading: false,
        position: "top-center",
        closeOnClick: true,
        draggable: false,
        toastId: 5,
    })
}

const updateError = (id, message) => {
    toast.update(id, {
        render: message,
        type: "error",
        isLoading: false,
        position: "top-center",
        closeOnClick: true,
        draggable: false,
        toastId: 5,
    })
}

const alerts = {success, error, warning, info, loading, updateSuccess, updateError};

export default alerts;