from dipole.users import models
from dipole.calculators.models import Equation
from ninja import NinjaAPI, Schema
from django.shortcuts import get_object_or_404

api = NinjaAPI()

class EqOut(Schema):
    name: str
    latex: str

@api.get("/yellow")
def hello(request):
    return "Yellow world"

@api.get("/eq")
def eq(request):
    eq = get_object_or_404(Equation)
    return eq.LaTeX_repr
