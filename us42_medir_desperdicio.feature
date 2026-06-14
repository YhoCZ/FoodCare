Feature: Medir desperdicio
  Background:
    Given el usuario ingresa a "Reportes y Estadísticas"

  Scenario Outline: Cálculo del impacto económico
    Given el usuario desechó "<cantidad>" unidades de "<producto>" este mes
    When el sistema procesa el precio promedio de "<precio>"
    Then la gráfica muestra una pérdida económica de "<perdida>"

    Examples:
      | cantidad | producto | precio | perdida |
      | 2        | Yogurts  | 3.00   | 6.00    |
      | 1        | Carne    | 15.00  | 15.00   |

  Scenario: Mes perfecto sin desperdicios
    Given el usuario no marcó ningún alimento como desechado
    Then el dashboard muestra un porcentaje de merma de 0%
    And muestra la medalla de "Cero Desperdicios"