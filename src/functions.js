import Swal from 'sweetalert2'

export const show_alert = (mensaje, tipo) => {
    Swal.fire({
        icon: tipo, // 'success', 'error', 'warning', etc.
        title: mensaje,
        showConfirmButton: false,
        timer: 1500 // El mensaje desaparecerá automáticamente después de 1.5 segundos
    });
}

