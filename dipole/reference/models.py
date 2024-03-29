from django.db import models
from django.db.models import UniqueConstraint
from django.db.models.functions import Lower

class Unit(models.Model):
    name        = models.CharField(max_length=128, unique=False, help_text="Enter unit name")
    symbol      = models.CharField(max_length=32, unique=False, help_text="Enter unit symbol")
    is_SI       = models.BooleanField(default=False, help_text="Is this an SI unit?")
    is_Metric   = models.BooleanField(default=True, help_text="Does this unit use metric prefixes?")

    # Conversion factors here ???


class Measure(models.Model):
    value     = models.FloatField(help_text="Enter numerical value of measurement")
    unit      = models.ForeignKey('Unit', related_name="+", help_text="Choose a unit for this measurement", on_delete=models.SET_NULL, null=True)
    precision = models.FloatField(help_text="Enter Number of significant figures")  # Maybe calculate for user? idk, b/c algo
                                                                                    # would need to know for every number involved
                                                                                    # in a calculation, if it is an 'exact' number
                                                                                    # ie, infinite sig figs which do not contribute to 
                                                                                    # final precision


# Should the quantitative fields be Measure objects, or is implied/understood unit okay?
# what if you have to use the measure later? 
# (You're definitely going to have to even for basic operations like converting g -> mol)
    # so probably want a measure
class Atom(models.Model):

    # Identifying Data
    name   = models.CharField(max_length=15, unique=True, help_text="Enter element name")
    symbol = models.CharField(max_length=3, unique=True, help_text="Enter chemical symbol")
    std_state = models.CharField(unique=False, help_text="Enter this element's standard state")
    cpk_hexcolor  = models.CharField(max_length=7, unique=False, help_text="Enter element CPK Hex Color Code")
    atomic_number = models.PositiveIntegerField(unique=True, help_text="Enter element atomic number", primary_key=True)


    ###### ~~~Experimentally Measured Properties~~~ ######

    # [x] TOASK Considering using Measure fields
    #           see notebook; try to find precompiled lib of chemical data
    
    # TOASK Validation ? some forum posts say has to be done on FE? 
    e_config = models.CharField(
        max_length=256,
        unique=False,
        help_text="Enter neutral atom electron configuration",
    )

    atomic_radius     = models.FloatField(unique=False, help_text="Enter this element's atomic radius in picometers") # TODO verify PubChem reports radii in pm and not µm
    ionization_energy = models.FloatField(unique=False, help_text="Enter this element's first ionization energy")
    atomic_mass       = models.FloatField(unique=False, help_text="Enter this element's atomic mass, in amu")
    electronegativity = models.FloatField(unique=False, help_text="Enter this element's electronegativity")
    electron_affinity = models.FloatField(unique=False, help_text="Enter this element's electron affinity")
    melting_point     = models.FloatField(unique=False, help_text="Enter this element's melting point")
    boiling_point     = models.FloatField(unique=False, help_text="Enter this element's boiling point")
    density           = models.FloatField(unique=False, help_text="Enter this element's density") # TODO check PubChem for what state - I assume standard state

    oxidation_states  = models.CharField(unique=False, help_text="Enter a comma separated list of this element's common oxidation states")

    # Other
    year_discovered   = models.PositiveIntegerField(help_text="Enter the discovery year")
    group_block       = models.CharField(unique=False, help_text="Enter element classification (ie, group name)") # TODO check PubChem's valid group_blocks - how granular?

    class Meta:
        constraints = [
            UniqueConstraint(
                Lower("name"),
                name="genre_name_case_insensitive_unique",
                violation_error_message="Element already in table",
            ),
        ]
        ordering = ["atomic_number"]
