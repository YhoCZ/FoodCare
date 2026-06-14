Feature: Compartir inventario con familia
  Background:
    Given el usuario se encuentra en la sección "Grupo Familiar"

  Scenario Outline: Generación de código de invitación
    When genera un enlace con el rol de "<rol_asignado>"
    And lo envía a un familiar
    Then el familiar tendrá permisos de "<permisos_sistema>" en la despensa

    Examples:
      | rol_asignado | permisos_sistema                   |
      | Editor       | Agregar, editar y borrar alimentos |
      | Lector       | Solo ver la lista y recetas        |

  Scenario: Límite de miembros del grupo
    Given el usuario ya tiene 5 miembros en su grupo familiar (límite del plan free)
    When intenta invitar a un sexto miembro
    Then el sistema bloquea la acción
    And sugiere un upgrade a un plan Premium