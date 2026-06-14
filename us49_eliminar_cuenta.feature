Feature: Eliminar cuenta de usuario
  Background:
    Given el usuario navega a la sección de privacidad y seguridad

  Scenario Outline: Borrado permanente (Derecho al Olvido)
    When presiona "Eliminar mi cuenta definitivamente"
    And confirma su identidad escribiendo la palabra "<palabra_confirmacion>"
    Then la base de datos aplica un "hard delete" borrando su "<informacion>"

    Examples:
      | palabra_confirmacion | informacion               |
      | ELIMINAR             | Perfil y correos          |
      | ELIMINAR             | Despensa e historial      |

  Scenario: Cancelación de la eliminación
    When presiona "Eliminar mi cuenta definitivamente"
    And aparece el cuadro de advertencia "Esta acción es irreversible"
    And el usuario presiona "Mejor no"
    Then el proceso se aborta y la cuenta se mantiene intacta