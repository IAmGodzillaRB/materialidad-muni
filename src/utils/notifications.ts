import { notification } from 'antd';

/**
 * Muestra una notificación de éxito.
 * @param message - El mensaje principal de la notificación.
 * @param description - La descripción detallada del éxito (opcional).
 */
export const mostrarExito = (message: string, description?: string) => {
  notification.success({
    message,
    description,
    duration: 4.5, // Duración en segundos
    placement: 'topRight', // Posición de la notificación
  });
};

/**
 * Muestra una notificación de error.
 * @param message - El mensaje principal de la notificación.
 * @param description - La descripción detallada del error (opcional).
 */
export const mostrarError = (message: string, description?: string) => {
  notification.error({
    message,
    description,
    duration: 4.5, // Duración en segundos
    placement: 'topRight', // Posición de la notificación
  });
};