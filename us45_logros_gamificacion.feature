Feature: Gamificación y logros
  Background:
    Given el sistema de progreso gamificado está activo

  Scenario: Desbloquear medalla de racha
    Given el usuario cumple 7 días seguidos registrando consumo
    When inicia sesión en el día 7
    Then salta una alerta "¡Desbloqueaste: Racha Semanal!"
    And el ícono se ilumina en su perfil

  Scenario: Racha interrumpida
    Given el usuario tenía 6 días seguidos pero no abrió la app el día 7
    When inicia sesión el día 8
    Then el contador de racha semanal se reinicia a 1