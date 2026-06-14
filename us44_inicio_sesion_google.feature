Feature: Iniciar sesión con Google
  Background:
    Given el usuario se encuentra en la pantalla de Bienvenida (Login)

  Scenario Outline: Login federado OAuth2
    When presiona el botón "Continuar con Google"
    And selecciona su cuenta de Google válida "<estado_cuenta>"
    Then la API de autenticación aprueba el acceso
    And el sistema redirige al usuario al "<destino>"

    Examples:
      | estado_cuenta | destino             |
      | Nueva cuenta  | Tutorial de inicio  |
      | Cuenta antigua| Dashboard de despensa|

  Scenario: Cancelación del Login en la ventana de Google
    When presiona "Continuar con Google"
    And cierra la ventana emergente de Google sin seleccionar cuenta
    Then el sistema no inicia sesión
    And se mantiene en la pantalla de Bienvenida