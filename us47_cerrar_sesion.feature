Feature: Cerrar sesión
  Background:
    Given el usuario ha iniciado sesión y navega a su Perfil

  Scenario Outline: Limpieza de tokens de seguridad
    When presiona el botón "Cerrar sesión"
    Then el sistema invalida el token JWT activo
    And limpia la caché local del dispositivo de tipo "<dato_sensible>"

    Examples:
      | dato_sensible       |
      | Preferencias de app |
      | Historial reciente  |

  Scenario: Cierre de sesión sin conexión
    Given el usuario no tiene internet
    When presiona "Cerrar sesión"
    Then la app limpia la sesión de manera local y redirige al Login
    And invalidará el token en el servidor cuando recupere conexión