Feature: Sugerencias de uso y conservación
  Background:
    Given el usuario abre el detalle de un alimento

  Scenario Outline: Mostrar tips basados en el tipo de producto
    When el producto pertenece a la categoría "<categoria>"
    Then la sección "Tips del Chef" muestra el consejo "<consejo_mostrado>"

    Examples:
      | categoria | consejo_mostrado                                     |
      | Vegetales | "Envuelve en papel toalla para absorber la humedad"  |
      | Panadería | "Puedes congelar el pan para que dure hasta 3 meses" |

  Scenario: Producto sin tips registrados
    When el producto no tiene tips específicos en la base de datos
    Then la sección de "Tips del Chef" se oculta en la interfaz para ahorrar espacio