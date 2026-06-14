Feature: US31 - Interfaz simple

  Scenario: Pantalla despejada
    Given el usuario entra a la app
    When navega
    Then la pantalla muestra solo la información esencial sin saturación visual

  Scenario: Modo oscuro
    Given el usuario prefiere entornos oscuros
    When activa el "Modo Oscuro" en su teléfono
    Then la interfaz de la app se adapta manteniendo la legibilidad