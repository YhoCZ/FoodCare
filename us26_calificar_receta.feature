Feature: Calificar una receta
  Background:
    Given el usuario terminó de revisar o preparar una receta del Smart-Chef

  Scenario Outline: Retroalimentación del motor de IA
    When selecciona una calificación de "<estrellas>" estrellas
    Then el sistema registra la puntuación en el perfil de la receta
    And adapta las recomendaciones futuras para mostrar "<tipo_ajuste>"

    Examples:
      | estrellas | tipo_ajuste                    |
      | 5         | Recetas similares más seguido  |
      | 1         | Menos recetas de este tipo     |

  Scenario: Intentar calificar dos veces
    Given el usuario ya calificó la "Sopa de Tomate" con 4 estrellas
    When intenta calificar de nuevo la misma receta
    Then el sistema actualiza la calificación anterior en lugar de crear una nueva