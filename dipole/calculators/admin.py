from django.contrib import admin
from .models import Calculator, Variable, Equation

admin.site.register(Calculator)
admin.site.register(Variable)
admin.site.register(Equation)
