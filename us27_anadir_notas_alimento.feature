Feature: Añadir notas al alimento
  Background:
    Given el usuario se encuentra en la vista detallada de un alimento

  Scenario Outline: Guardado de apuntes personalizados
    When escribe "<texto_nota>" en el campo de Notas Extra
    And guarda el alimento
    Then el detalle del alimento muestra el apunte "<texto_nota>"

    Examples:
      | texto_nota                          |
      | Guardado en el cajón de abajo       |
      | Usar solo la mitad para el desayuno |

  Scenario: Límite de caracteres excedido
    When ingresa una nota que supera los 200 caracteres
    Then el cuadro de texto bloquea la entrada adicional
    And muestra el contador "200/200" en color rojo