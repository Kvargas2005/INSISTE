// src/utils/SwalUtils.ts
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const showSuccess = (message: string, title = '¡Éxito!') => {
  MySwal.fire({
    icon: 'success',
    title,
    text: message,
    confirmButtonColor: '#3085d6',
  });
};

export const showError = (message: string, title = 'Error') => {
  MySwal.fire({
    icon: 'error',
    title,
    text: message,
    confirmButtonColor: '#d33',
  });
};

export const showConfirm = async (
  message: string,
  title = '¿Estás seguro?',
): Promise<boolean> => {
  const result = await MySwal.fire({
    title,
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
  });
  return result.isConfirmed;
};
