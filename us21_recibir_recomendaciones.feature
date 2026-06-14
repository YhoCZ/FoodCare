Feature: Recuperar contraseña
  Background:
    Given el usuario presiona "Olvidé mi contraseña" en el Login

  Scenario: Correo registrado correctamente
    When ingresa "test@savora.com" y presiona Enviar
    Then muestra "Revisa tu bandeja de entrada"
    And envía un enlace seguro de recuperación

  Scenario: Correo no existente
    When ingresa "falso@correo.com" (no registrado)
    Then por seguridad muestra el mismo mensaje genérico "Si el correo existe, enviaremos un enlace"
    And no revela si la cuenta existe en base de datos