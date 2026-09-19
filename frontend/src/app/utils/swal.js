import Swal from 'sweetalert2';

const toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

export const showAlert = (title, text, icon = 'info') => {
    return Swal.fire({
        title,
        text,
        icon,
        confirmButtonColor: '#d33',
    });
};

export const showSuccess = (title, text) => {
    return Swal.fire({
        title,
        text,
        icon: 'success',
        confirmButtonColor: '#d33',
    });
};

export const showError = (title, text) => {
    return Swal.fire({
        title,
        text,
        icon: 'error',
        confirmButtonColor: '#d33',
    });
};

export const showConfirm = (title, text, confirmButtonText = 'Yes, proceed!') => {
    return Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText
    });
};

export const showToast = (title, icon = 'success') => {
    toast.fire({
        icon,
        title
    });
};

export default Swal;
