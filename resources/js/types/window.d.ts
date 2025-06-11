// resources/js/types/window.d.ts

export {}; // asegúrate de que sea un módulo

declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
}
