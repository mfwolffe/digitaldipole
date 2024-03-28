from django.contrib import admin
from .models import Unit, Measure, Atom

#TOASK in CPR you use @reversion.register - cut down on code length?

# Register your models here.

# admin.site.register(Unit)
# admin.site.register(Measure)
# admin.site.register(Atom)


@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_SI', 'symbol')

@admin.register(Measure)
class MeasureAdmin(admin.ModelAdmin):
    list_display = ('value', 'unit')
    

@admin.register(Atom)
class AtomAdmin(admin.ModelAdmin):
    list_display = ('name', 'atomic_number', 'atomic_mass', 'ionization_energy', 'group_block', 'symbol')