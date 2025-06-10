// Menú móvil accesible con soporte completo de teclado
export function initMobileMenu() {
  const toggleButton = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (toggleButton && mobileMenu) {
    // Función para abrir/cerrar menú
    function toggleMenu() {
      if (!toggleButton || !mobileMenu) return;

      const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";
      const newExpandedState = !isExpanded;

      // Actualizar estados ARIA
      toggleButton.setAttribute("aria-expanded", newExpandedState.toString());
      mobileMenu.setAttribute("aria-hidden", (!newExpandedState).toString());

      // Actualizar aria-label del botón
      toggleButton.setAttribute(
        "aria-label",
        newExpandedState
          ? "Cerrar menú de navegación"
          : "Abrir menú de navegación"
      );

      // Mostrar/ocultar menú
      if (newExpandedState) {
        mobileMenu.classList.remove("hidden");
        // Focus en el primer enlace del menú
        const firstLink = mobileMenu.querySelector("a");
        if (firstLink) {
          firstLink.focus();
        }
      } else {
        mobileMenu.classList.add("hidden");
        // Devolver focus al botón
        toggleButton.focus();
      }
    }

    // Event listener para click
    toggleButton.addEventListener("click", toggleMenu);

    // Event listener para teclas (Enter y Espacio)
    toggleButton.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleMenu();
      }
    });

    // Cerrar menú con Escape
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        mobileMenu &&
        !mobileMenu.classList.contains("hidden")
      ) {
        toggleMenu();
      }
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener("click", (event) => {
      const target = event.target;
      if (
        toggleButton &&
        mobileMenu &&
        target &&
        !toggleButton.contains(target) &&
        !mobileMenu.contains(target) &&
        !mobileMenu.classList.contains("hidden")
      ) {
        toggleMenu();
      }
    });
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", initMobileMenu);
