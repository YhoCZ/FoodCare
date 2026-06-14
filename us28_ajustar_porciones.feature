Feature: Ajustar porciones de receta
  Background:
    Given la receta original muestra cantidades para 2 porciones

  Scenario: Escalar ingredientes (Aumentar)
    When el usuario sube las porciones a 4
    Then todas las cantidades de ingredientes se multiplican por 2

  Scenario: Limitar porciones a cero o negativo
    When el usuario intenta bajar las porciones a 0
    Then el sistema bloquea el control en mínimo 1 porción
    And muestra "La receta debe ser para al menos 1 persona"