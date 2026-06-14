Feature: US32 - Navegación intuitiva

  Scenario: Uso de Bottom Navigation
    Given el usuario está en una subpantalla
    When usa la barra inferior de navegación
    Then puede saltar directamente a otra sección principal

  Scenario: Retroceder
    Given el usuario entró al detalle de un producto
    When hace el gesto de "Atrás" (Swipe back)
    Then regresa al inventario sin perder su posición en la lista