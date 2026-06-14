Feature: Filtrar recetas por dificultad
  Background:
    Given el usuario está revisando opciones en el Smart-Chef

  Scenario Outline: Adecuación a las habilidades culinarias
    When selecciona el filtro de dificultad "<nivel>"
    Then las recetas mostradas requieren habilidades "<tipo_habilidad>"

    Examples:
      | nivel       | tipo_habilidad             |
      | Principiante| Básicas (Mezclar, Hervir)  |
      | Avanzado    | Complejas (Hornear, Salsas)|

  Scenario: Filtro sin resultados
    Given selecciona "Avanzado"
    When los ingredientes disponibles solo sirven para recetas básicas
    Then muestra un mensaje "No hay recetas avanzadas. Prueba quitando el filtro"