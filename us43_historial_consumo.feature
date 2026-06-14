Feature: Ver historial de consumo
  Background:
    Given el usuario entra a la pestaña "Historial"

  Scenario: Visualizar acciones pasadas
    Given existen registros de la semana anterior
    Then muestra un log cronológico ("Consumiste Manzana hace 2 días")

  Scenario: Usuario nuevo sin historial
    Given la cuenta fue recién creada
    Then la vista muestra el mensaje "Aún no hay actividad. ¡Empieza a registrar!"