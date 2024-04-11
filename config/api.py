from dipole.users import models
from dipole.calculators.models import Equation
from ninja import NinjaAPI, Schema
from django.shortcuts import get_object_or_404

api = NinjaAPI()

# SEEME these API requests are really just to
#       verify that the cursed process for 
#       SymPy CAS is working as "intended"
# TODO  Finish request eq member methods &
#       the requests here proper

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

@api.get("/strr")
def strr(request):
    theq = get_object_or_404(Equation, name="str test")
    # rstr = theq.symbol_strgen() this works
    # return rstr

    exps = theq.prep_latex()
    return exps
