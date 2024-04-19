import json
from sympy import *
from dipole.users import models
from ninja import NinjaAPI, Schema
from dipole.calculators.models import Equation
from django.shortcuts import get_object_or_404

api = NinjaAPI()

class VariableSchema(Schema):
    val:  str
    name: str


class CalcNumericEndpoint(Schema):
    name:     str
    unknown:  str
    listVars: list[VariableSchema]

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
        "orig":           rf"{theq.LaTeX_repr}",
        "symbol_list":    rf"{theq.build_sym_list()}",
        "symbol_string":  rf"{theq.symbol_strgen()}",
        "html_mapping":   json.dumps(theq.build_html_mapping()),
        "symbol_mapping": json.dumps(theq.build_sym_mapping()),
    }

    resp_json = json.dumps(resp_json)
    resp_json = json.loads(resp_json)
    return resp_json


@api.get("/calculators/{eq_name}/{unknown}")
def calcunknown(request, eq_name, unknown):
    theeq = get_object_or_404(Equation, name=eq_name)

    resp_json = {
        "orig": rf"{theeq.LaTeX_repr}",
        "symbol_list": rf"{theeq.build_sym_list()}",
        "symbol_string": rf"{theeq.symbol_strgen()}",
        "unknown_var": rf"{theeq.fetch_unknown(unknown)}",
        "symbol_mapping": json.dumps(theeq.build_sym_mapping()),
        "simplified original": rf"{theeq.sym_solve(unknown)}",
        "html_mapping": json.dumps(theeq.build_html_mapping()),
        "nu_html_mapping": json.dumps(theeq.build_html_mapping(unknown)),
        "user_solution_relatex": rf"{theeq.build_relatex_soln_t(unknown)}"
    }

    resp_json = json.dumps(resp_json)
    resp_json = json.loads(resp_json)
    return resp_json


@api.post("/calculators/solve")
def calcnumeric(request, payload: CalcNumericEndpoint):
        eq_name    = payload.name
        eq_vars    = payload.listVars
        eq_unknown = payload.unknown

        theeq      = get_object_or_404(Equation, name=eq_name)
        f_mapping  = {prop.name: prop.val for prop in eq_vars}

        exps       = theeq.build_relatex(eq_unknown, False)
        solution   = theeq.numeric_solve(eq_unknown, f_mapping)

        response = {
          "frepr": rf"{exps}",
          "result": rf"{solution}",
          "orig": rf"{theeq.LaTeX_repr}",
          "symbol_list": rf"{theeq.build_sym_list()}",
          "symbol_string": rf"{theeq.symbol_strgen()}",
          "simplified original": rf"{theeq.sym_solve(eq_unknown)}",
          "html_mapping": json.dumps(theeq.build_html_mapping()),
          "nu_html_mapping": json.dumps(theeq.build_html_mapping(eq_unknown)),
          "user_solution_relatex": rf"{theeq.build_relatex_soln_t(eq_unknown, f_mapping)}"
        }

        response = json.dumps(response)
        response = json.loads(response)
        return response

