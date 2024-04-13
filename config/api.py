import json
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
@api.get("/calculators/{eq_name}/{orig}")
def calculator(request, eq_name, orig):
    theq = get_object_or_404(Equation, name=eq_name)

    resp_json = {
      "orig":           rf"{theq.parse_orig()}",
      "unknown":        rf"{theq.fetch_unknown()}",
      "relatex":        rf"{theq.build_relatex(orig.lower() == 'true')}",
      "value_mapping":  rf"{theq.build_num_mapping()}",
      "symbol_mapping": {
          "known":      rf"{theq.build_sym_mapping(True)}",
          "w_unknown":  rf"{theq.build_sym_mapping(False)}",
      },
      "symbol_lists": {
          "known":      rf"{theq.build_sym_list(True)}",
          "w_unknown":  rf"{theq.build_sym_list(False)}",
      },
      "symbol_strings": {
          "known":      rf"{theq.symbol_strgen(True)}",
          "w_unknown":  rf"{theq.symbol_strgen(False)}",
      },
      # "numeric_solution":  theq.numeric_solve(),
      "symbolic_solution": rf"{theq.sym_solve()}",
    }

    resp_json = json.dumps(resp_json)
    resp_json = json.loads(resp_json)
    return resp_json
