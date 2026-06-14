Feature: Marcar alimento como desperdiciado
  Background:
    Given el usuario visualiza un alimento en estado rojo (Vencido)

  Scenario: Registro de merma
    When selecciona la opción "Desechar a la basura"
    Then el alimento se quita de la lista
    And suma una unidad a las estadísticas de desperdicio mensual

  Scenario: Cancelación del desecho
    When presiona "Desechar a la basura"
    And el sistema pide confirmación "¿Seguro que deseas botarlo?"
    And el usuario presiona "Cancelar"
    Then el alimento permanece en la lista en estado vencido