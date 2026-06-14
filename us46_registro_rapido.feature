Feature: Registro rápido
  Background:
    Given el usuario selecciona "Registro Rápido"

  Scenario Outline: Estimación automática de fechas por categoría
    When ingresa "<producto>" y selecciona el atajo "<categoria>"
    Then el sistema guarda el producto
    And asigna automáticamente una vigencia estimada de "<dias>" días

    Examples:
      | producto | categoria | dias |
      | Fresas   | Frutas    | 5    |
      | Fideos   | Abarrotes | 180  |

  Scenario: Cancelación del registro rápido
    When ingresa datos pero presiona el botón "Cancelar"
    Then el formulario se limpia
    And regresa a la vista anterior sin afectar la base de datos