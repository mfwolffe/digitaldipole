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
# SEEME this one is approaching actual functionality
#
# TOCONSIDER use schemas?
@api.get("/calculators/{eq_name}/ini")
def calculator(request, eq_name):
    theq = get_object_or_404(Equation, name=eq_name)

    resp_json = {
        "orig": rf"{theq.LaTeX_repr}",
        "symbol_list": rf"{theq.build_sym_list()}",
        "symbol_string": rf"{theq.symbol_strgen()}",
        "html_mapping": json.dumps(theq.build_html_mapping()),
        "symbol_mapping": json.dumps(theq.build_sym_mapping()),
    }

    resp_json = json.dumps(resp_json)
    resp_json = json.loads(resp_json)
    return resp_json

@api.get("/calculators/{eq_name}/{unknown}")
def calcunknown(request, eq_name, unknown):
    theq = get_object_or_404(Equation, name=eq_name)

    resp_json = {
        "orig": rf"{theq.LaTeX_repr}",
        "symbol_list": rf"{theq.build_sym_list()}",
        "symbol_string": rf"{theq.symbol_strgen()}",
        "unknown_var": rf"{theq.fetch_unknown(unknown)}",
        "html_mapping": json.dumps(theq.build_html_mapping()),
        "symbol_mapping": json.dumps(theq.build_sym_mapping()),
        "simplified original": rf"{theq.sym_solve(unknown)}",
        "user_solution_relatex": rf"{theq.build_relatex(unknown, False)}"
    }

    resp_json = json.dumps(resp_json)
    resp_json = json.loads(resp_json)
    return resp_json
