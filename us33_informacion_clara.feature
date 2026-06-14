Feature: US33 - Información clara

  Scenario: Lectura rápida
    Given el usuario revisa la lista
    When lee los datos
    Then la tipografía y contrastes permiten entender rápidamente qué es cada ítem

  Scenario: Truncamiento de textos
    Given un alimento tiene un nombre muy largo
    When se muestra en la tarjeta
    Then el texto se recorta con puntos suspensivos para no romper el diseño