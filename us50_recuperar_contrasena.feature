Feature: Recuperar contraseña
  Como usuario, quiero restablecer mi acceso si olvido la clave.

  Background:
    Given el usuario está en la pantalla de Login y presiona "Olvidé mi contraseña"

  Scenario Outline: Envío de enlace de recuperación
    Given aparece el formulario de recuperación
    When ingresa el correo "<email_ingresado>"
    And el estado en la base de datos es "<estado_cuenta>"
    Then el sistema muestra el mensaje "<mensaje_UI>"

    Examples:
      | email_ingresado  | estado_cuenta | mensaje_UI                                    |
      | test@savora.com  | Existe        | Correo enviado, revisa tu bandeja.            |
      | nulo@savora.com  | No existe     | Si el correo existe, enviaremos un enlace.    |
      | inv@lido         | Error formato | Formato de correo inválido.                   |