from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import CharField
from django.urls import reverse
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """
    Default custom user model for Digital dipole.
    If adding fields that need to be filled at user signup,
    check forms.SignupForm and forms.SocialSignupForms accordingly.
    """

    # First and last name do not cover name patterns around the globe
    name = CharField(_("Name of User"), blank=True, max_length=255)
    first_name = None  # type: ignore[assignment]
    last_name = None  # type: ignore[assignment]

    def get_absolute_url(self) -> str:
        """Get URL for user's detail view.

        Returns:
            str: URL for user detail.

        """
        return reverse("users:detail", kwargs={"username": self.username})


class UnitPreferences(models.Model):
    """
    Stores user's preferred units per dimension.

    The preferred_units field is a JSON object mapping dimension names
    to unit IDs, e.g.:
    {
        "pressure": "atm",
        "volume": "L",
        "temperature": "K",
        "energy": "kJ"
    }
    """

    class UnitSystem(models.TextChoices):
        SI = 'SI', 'SI (International System)'
        IMPERIAL = 'imperial', 'Imperial/US'
        CUSTOM = 'custom', 'Custom'

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='unit_preferences'
    )

    # Quick preset selector
    system = models.CharField(
        max_length=10,
        choices=UnitSystem.choices,
        default=UnitSystem.SI,
        help_text="Unit system preset"
    )

    # Detailed per-dimension preferences (JSON field)
    # e.g., {"pressure": "atm", "temperature": "degC", "volume": "L"}
    preferred_units = models.JSONField(
        default=dict,
        blank=True,
        help_text="Map of dimension to preferred unit ID"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Unit Preferences"
        verbose_name_plural = "Unit Preferences"

    def __str__(self):
        return f"Unit preferences for {self.user.username}"

    def get_preferred_unit(self, dimension: str) -> str | None:
        """Get the user's preferred unit for a dimension."""
        return self.preferred_units.get(dimension)

    def set_preferred_unit(self, dimension: str, unit_id: str):
        """Set the user's preferred unit for a dimension."""
        self.preferred_units[dimension] = unit_id
        self.system = self.UnitSystem.CUSTOM  # Auto-switch to custom when manually set
        self.save()
