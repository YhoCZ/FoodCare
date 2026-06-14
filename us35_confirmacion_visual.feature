Feature: US35 - Confirmación visual

  Scenario: Feedback de éxito
    Given el usuario guarda un alimento
    When se completa el proceso
    Then aparece un pequeño check verde o mensaje flotante (toast) confirmando la acción

  Scenario: Estado de carga
    Given la app está sincronizando datos
    When hay demora
    Then se muestra un spinner (rueda de carga) para que el usuario sepa que el sistema está trabajando