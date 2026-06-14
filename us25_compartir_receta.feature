Feature: Compartir receta
  Background:
    Given el usuario abre una receta que le gusta

  Scenario: Compartir a través de red social
    When presiona el ícono de "Compartir"
    And selecciona WhatsApp en el menú del celular
    Then genera un texto "Mira esta receta en FoodCare: [URL]"

  Scenario: Fallo de conexión al compartir
    Given el usuario no tiene internet
    When presiona el ícono de "Compartir"
    Then muestra "No se puede generar el enlace sin conexión"