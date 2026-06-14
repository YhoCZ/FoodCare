Feature: Buscar receta por ingredientes específicos
  Background:
    Given el usuario utiliza la barra de búsqueda del Smart-Chef

  Scenario Outline: Filtrado cruzado de múltiples ingredientes
    When ingresa los ingredientes "<lista_ingredientes>" separados por coma
    Then el sistema busca recetas que contengan al menos una coincidencia
    And prioriza las recetas que incluyen "<prioridad_alta>"

    Examples:
      | lista_ingredientes | prioridad_alta             |
      | Pollo, Arroz       | Ambos ingredientes a la vez|
      | Lentejas, Cebolla  | Ambos ingredientes a la vez|

  Scenario: Ingrediente no apto para recetas
    When ingresa un texto no relacionado a comida como "Servilletas"
    Then el motor de búsqueda no devuelve resultados
    And muestra "Por favor ingresa nombres de ingredientes válidos"