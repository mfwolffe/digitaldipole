from django.apps import AppConfig

from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _

class CalculatorsConfig(AppConfig):
    name = 'dipole.calculators'
    verbose_name = _("Calculators")
