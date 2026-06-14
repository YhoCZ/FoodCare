Feature: Sincronización
  Background:
    Given el usuario realizó un cambio en su inventario

  Scenario Outline: Respaldo según conexión
    Given el dispositivo tiene el estado de red "<estado_red>"
    When finaliza la acción
    Then los datos pasan al estado "<resultado_nube>"

    Examples:
      | estado_red | resultado_nube                |
      | Wi-Fi      | Guardado en la nube al instante|
      | Modo Avión | Guardado local (Pendiente)     |

  Scenario: Recuperación de conexión
    Given existen datos locales pendientes de sincronizar
    When el dispositivo recupera acceso a internet
    Then el sistema vacía la cola enviando los datos a la nube