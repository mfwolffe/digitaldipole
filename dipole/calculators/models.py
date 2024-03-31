from django.db import models
from django.db.models.functions import Lower
from django.db.models import UniqueConstraint


class Variable(models.Model):
    val    = models.FloatField(null=True, help_text="The variable's value")
    name   = models.CharField(max_length=64, help_text="The variable's name")
    unit   = models.CharField(max_length=16, help_text="The variable's unit")
    symbol = models.CharField(max_length=16, help_text="The variable's symbol")

    class Meta:
        verbose_name        = "Variable"
        verbose_name_plural = "Variables"


class Equation(models.Model):
    name      = models.CharField(default="test", max_length=72, help_text="Calculator name")
    variables = models.ManyToManyField(Variable, help_text="A known variable in this equation")

    class Meta:
        verbose_name        = "Equation"
        verbose_name_plural = "Equations"


class Calculator(models.Model):
    CATEGORIES = [
        ("GSLW", "Gas Laws"),
        ("SOLN", "Solutions"),
        ("MISC", "Miscellaneous"),
        ("STCH", "Stoichiometry"),
        ("THRM", "Thermodynamics"),
        ("CNVR", "Unit Conversions"),
        ("ELCT", "Electrochemistry"),
        ("NCLR", "Nuclear Chemistry"),
    ]

    # TOCONSIDER path to component? - if so, maybe make the constraint that?
    name          = models.CharField(max_length=72, help_text="This calculator's name")
    equation      = models.OneToOneField(Equation, on_delete=models.SET_NULL, null=True)
    information   = models.TextField(help_text="The calculator reference the user may hide/show")
    calc_category = models.CharField(max_length=4, choices=CATEGORIES, default="MISC", help_text="Calculator Category")

    class Meta:
        verbose_name        = "Calculator"
        verbose_name_plural = "Calculators"
        constraints = [
            UniqueConstraint(
                Lower("name"),
                name="calc_name_case_insensitive_unique",
                violation_error_message="Calculator Already Exists",
            ),
        ]
        ordering = ['calc_category', 'name']
