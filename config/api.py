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

@api.get("/yellow")
def hello(request):
    return "Yellow world"

@api.get("/strr")
def strr(request):
    theq = get_object_or_404(Equation, name="str test")

    nsoln = theq.numeric_solve()
    return f"{nsoln}"

# SEEME this one is approaching actual functionality
# TOCONSIDER use schemas?
@api.get("/calculators/{eq_name}")
def calculator(request, eq_name):
    theq = get_object_or_404(Equation, name=eq_name)

    soln = theq.sym_solve()
    return f"{soln}"
