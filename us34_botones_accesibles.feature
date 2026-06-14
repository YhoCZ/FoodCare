Feature: US34 - Botones accesibles

  Scenario: Área de toque óptima
    Given el usuario usa el celular con una mano
    When presiona un botón de acción (ej. "+" flotante)
    Then el tamaño es lo suficientemente grande para no fallar el toque

  Scenario: Accesibilidad visual
    Given un usuario tiene problemas de visión
    When usa el modo de lectura del celular
    Then los botones están correctamente etiquetados para el lector de pantalla