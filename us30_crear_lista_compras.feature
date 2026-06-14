Feature: Crear lista de compras
  Background:
    Given el usuario se encuentra en la pestaña "Lista de Compras"

  Scenario: Agregar ítem nuevo
    When escribe "Arroz" y presiona enter o "+"
    Then "Arroz" aparece en la lista con un checkbox en blanco

  Scenario: Marcar ítem como comprado
    Given "Arroz" está pendiente en la lista
    When el usuario toca el checkbox
    Then "Arroz" se tacha visualmente
    And pasa a la sección de ítems completados