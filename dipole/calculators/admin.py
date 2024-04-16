from django.contrib import admin
from .models import Calculator, Variable, Equation

@admin.register(Calculator)
class CalculatorAdmin(admin.ModelAdmin):
    list_display = ('calc_category', 'name')

@admin.register(Variable)
class VariableAdmin(admin.ModelAdmin):
    list_display = ('name', 'unit', 'symbol_u')

# TODO may need to reconsider model for variables
#      just foreign key?
@admin.register(Equation)
class EquationAdmin(admin.ModelAdmin):
    list_display = ('name', 'LaTeX_repr')
