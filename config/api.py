import json
from datetime import datetime

from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from ninja import NinjaAPI, Schema
from sympy import *

from dipole.calculators.models import Calculator, Equation, FavoriteEquation
from dipole.users import models

import environ
import nltk
import requests

nltk.download('punkt', "nltk/")
env = environ.Env()

GPKEY   = env('GPKEY')
GPHOST  = env('GPHOST')
IM_USER = env('IM_USER')
IM_PASS = env('IM_PASS')

api = NinjaAPI()


# ============================================
# User/Account API Endpoints
# ============================================

@api.get("/user/me")
def get_current_user(request):
    """Get current authenticated user's profile information."""
    if not request.user.is_authenticated:
        return {"authenticated": False}

    user = request.user
    return {
        "authenticated": True,
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "name": user.name,
        "date_joined": user.date_joined.isoformat(),
        "last_login": user.last_login.isoformat() if user.last_login else None,
    }


# ============================================
# Favorites API Endpoints
# ============================================

@api.get("/favorites/")
def get_favorites(request):
    """Get all favorite equations for the current user."""
    if not request.user.is_authenticated:
        return {"authenticated": False, "favorites": []}

    favorites = FavoriteEquation.objects.filter(user=request.user).select_related(
        'equation'
    )

    favorite_list = []
    for fav in favorites:
        # Try to get the calculator category for this equation
        try:
            calc = Calculator.objects.get(equation=fav.equation)
            category = calc.get_calc_category_display()
            calc_category = calc.calc_category
        except Calculator.DoesNotExist:
            category = "Uncategorized"
            calc_category = "MISC"

        # Build the path to the calculator
        category_paths = {
            "GSLW": "/calculators/gas-laws",
            "THRM": "/calculators/thermo",
            "SOLN": "/calculators/solutions",
            "ELCT": "/calculators/electrochemistry",
            "MISC": "/calculators/gas-laws",
        }
        base_path = category_paths.get(calc_category, "/calculators/gas-laws")

        favorite_list.append({
            "id": fav.id,
            "equation_id": fav.equation.id,
            "name": fav.equation.name,
            "equation": fav.equation.LaTeX_repr,
            "category": category,
            "path": f"{base_path}/{fav.equation.name}",
            "created_at": fav.created_at.isoformat(),
        })

    return {"authenticated": True, "favorites": favorite_list}


@api.post("/favorites/{equation_name}")
def toggle_favorite(request, equation_name: str):
    """Toggle favorite status for an equation. Returns new status."""
    if not request.user.is_authenticated:
        return {"success": False, "error": "Authentication required"}

    equation = get_object_or_404(Equation, name=equation_name)

    # Check if already favorited
    existing = FavoriteEquation.objects.filter(
        user=request.user,
        equation=equation,
    ).first()

    if existing:
        # Remove from favorites
        existing.delete()
        return {
            "success": True,
            "is_favorite": False,
            "message": f"Removed '{equation_name}' from favorites",
        }
    else:
        # Add to favorites
        FavoriteEquation.objects.create(user=request.user, equation=equation)
        return {
            "success": True,
            "is_favorite": True,
            "message": f"Added '{equation_name}' to favorites",
        }


@api.get("/favorites/check/{equation_name}")
def check_favorite(request, equation_name: str):
    """Check if an equation is favorited by the current user."""
    if not request.user.is_authenticated:
        return {"authenticated": False, "is_favorite": False}

    equation = get_object_or_404(Equation, name=equation_name)
    is_favorite = FavoriteEquation.objects.filter(
        user=request.user,
        equation=equation,
    ).exists()

    return {"authenticated": True, "is_favorite": is_favorite}

class VariableSchema(Schema):
    val:  str
    name: str

class CalcNumericEndpoint(Schema):
    name:     str
    unknown:  str
    listVars: list[VariableSchema]


# ============================================
# Equation Balancer API Endpoints
# ============================================

class ElementSchema(Schema):
    symbol: str
    count: int


class CompoundSchema(Schema):
    formula: str
    elements: list[ElementSchema]
    charge: int = 0
    coefficient: int = 1


class BalanceRequestSchema(Schema):
    reactants: list[CompoundSchema]
    products: list[CompoundSchema]
    mode: str = "molecular"


@api.post("/balance")
def balance_equation(request, payload: BalanceRequestSchema):
    """
    Balance a chemical equation using SymPy's matrix solver.
    Used as fallback when frontend balancer fails.
    """
    try:
        from sympy import Matrix, Rational
        from math import gcd
        from functools import reduce

        all_compounds = payload.reactants + payload.products
        num_reactants = len(payload.reactants)

        # Get all unique elements
        elements = set()
        for compound in all_compounds:
            for elem in compound.elements:
                elements.add(elem.symbol)
        elements = sorted(list(elements))

        if not elements:
            return {"success": False, "error": "No elements found"}

        # Build coefficient matrix
        matrix_data = []
        for element in elements:
            row = []
            for i, compound in enumerate(all_compounds):
                count = 0
                for elem in compound.elements:
                    if elem.symbol == element:
                        count = elem.count
                        break
                # Products get negative sign
                sign = -1 if i >= num_reactants else 1
                row.append(sign * count)
            matrix_data.append(row)

        # Add charge row for ionic mode
        if payload.mode in ["ionic", "net-ionic"]:
            charge_row = []
            for i, compound in enumerate(all_compounds):
                sign = -1 if i >= num_reactants else 1
                charge_row.append(sign * compound.charge)
            if any(c != 0 for c in charge_row):
                matrix_data.append(charge_row)

        # Solve using SymPy
        M = Matrix(matrix_data)
        null_space = M.nullspace()

        if not null_space:
            return {"success": False, "error": "Equation cannot be balanced"}

        # Get solution and convert to integers
        solution = null_space[0]

        # Convert to positive rationals
        coefficients = [abs(Rational(x).limit_denominator(1000)) for x in solution]

        # Find LCM of denominators
        denoms = [c.q for c in coefficients]
        lcm_val = denoms[0]
        for d in denoms[1:]:
            lcm_val = lcm_val * d // gcd(lcm_val, d)

        # Multiply to get integers
        int_coeffs = [int(c * lcm_val) for c in coefficients]

        # Divide by GCD
        coeff_gcd = reduce(gcd, int_coeffs)
        if coeff_gcd > 1:
            int_coeffs = [c // coeff_gcd for c in int_coeffs]

        # Build result map
        coeff_map = {}
        for i, compound in enumerate(all_compounds):
            coeff_map[compound.formula] = max(1, int_coeffs[i])

        # Build balanced equation string
        def format_side(compounds, start_idx):
            parts = []
            for i, c in enumerate(compounds):
                coeff = coeff_map.get(c.formula, 1)
                coeff_str = str(coeff) if coeff > 1 else ""
                parts.append(f"{coeff_str}{c.formula}")
            return " + ".join(parts)

        reactant_str = format_side(payload.reactants, 0)
        product_str = format_side(payload.products, num_reactants)
        balanced_str = f"{reactant_str} -> {product_str}"

        return {
            "success": True,
            "coefficients": coeff_map,
            "balanced_equation": balanced_str,
            "steps": [
                {"description": "Built element matrix", "detail": f"{len(elements)} elements, {len(all_compounds)} compounds"},
                {"description": "Found null space solution", "detail": "Using Gaussian elimination"},
                {"description": "Converted to integers", "detail": f"Coefficients: {int_coeffs}"},
            ],
        }

    except Exception as e:
        return {"success": False, "error": str(e)}


@api.get("/polyatomic-ions")
def get_polyatomic_ions(request):
    """Return list of common polyatomic ions for autocomplete."""
    return {
        "ions": [
            {"formula": "SO4", "charge": -2, "name": "Sulfate"},
            {"formula": "NO3", "charge": -1, "name": "Nitrate"},
            {"formula": "NH4", "charge": 1, "name": "Ammonium"},
            {"formula": "OH", "charge": -1, "name": "Hydroxide"},
            {"formula": "CO3", "charge": -2, "name": "Carbonate"},
            {"formula": "PO4", "charge": -3, "name": "Phosphate"},
            {"formula": "HCO3", "charge": -1, "name": "Bicarbonate"},
            {"formula": "ClO3", "charge": -1, "name": "Chlorate"},
            {"formula": "ClO4", "charge": -1, "name": "Perchlorate"},
            {"formula": "MnO4", "charge": -1, "name": "Permanganate"},
            {"formula": "CrO4", "charge": -2, "name": "Chromate"},
            {"formula": "Cr2O7", "charge": -2, "name": "Dichromate"},
            {"formula": "C2H3O2", "charge": -1, "name": "Acetate"},
            {"formula": "CN", "charge": -1, "name": "Cyanide"},
            {"formula": "SCN", "charge": -1, "name": "Thiocyanate"},
        ]
    }

# DONE these API requests are really just to
#       verify that the cursed process for
#       SymPy CAS is working as "intended"
#
# DONE  Finish request eq member methods &
#       the requests here proper
#
# DONE  use schemas?
@api.get("/calculators/{eq_name}/ini")
def calculator(request, eq_name):
    theq = get_object_or_404(Equation, name=eq_name)

    # SEEME Removed:
    #         "symbol_list":    rf"{theq.build_sym_list()}",
    #         "symbol_string":  rf"{theq.symbol_strgen()}",
    #         "symbol_mapping": json.dumps(theq.build_sym_mapping()),
    resp_json = {
        "orig":           rf"{theq.LaTeX_repr}",
        "html_mapping":   json.dumps(theq.build_html_mapping()),
    }

    resp_json = json.dumps(resp_json)
    resp_json = json.loads(resp_json)
    return resp_json


@api.get("/calculators/{eq_name}/{unknown}")
def calcunknown(request, eq_name, unknown):
    theeq = get_object_or_404(Equation, name=eq_name)

    # SEEME
    #   "symbol_list": rf"{theeq.build_sym_list()}",
    #   "symbol_string": rf"{theeq.symbol_strgen()}",
    #   "unknown_var": rf"{theeq.fetch_unknown(unknown)}",
    #   "symbol_mapping": json.dumps(theeq.build_sym_mapping()),
    #   "simplified original": rf"{theeq.sym_solve(unknown)}",
    resp_json = {
        "orig": rf"{theeq.LaTeX_repr}",
        "html_mapping": json.dumps(theeq.build_html_mapping()),
        "nu_html_mapping": json.dumps(theeq.build_html_mapping(unknown)),
        "user_solution_relatex": rf"{theeq.build_relatex(unknown)}"
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

        # SEEME 
        #   exps       = theeq.build_relatex(eq_unknown, False)
        #   solution   = theeq.numeric_solve(eq_unknown, f_mapping)

        # SEEME
        #   "symbol_list": rf"{theeq.build_sym_list()}",
        #   "symbol_string": rf"{theeq.symbol_strgen()}",
        #   "frepr": rf"{exps}",
        #   "result": rf"{solution}",
        #   "simplified original": rf"{theeq.sym_solve(eq_unknown)}",
        response = {
          "orig": rf"{theeq.LaTeX_repr}",
          "html_mapping": json.dumps(theeq.build_html_mapping()),
          "nu_html_mapping": json.dumps(theeq.build_html_mapping(eq_unknown)),
          "user_solution_relatex": rf"{theeq.build_relatex(eq_unknown, f_mapping)}"
        }

        response = json.dumps(response)
        response = json.loads(response)
        return response

@api.get("/memegen/{queryString}")
def memegen(request, queryString):
    """
    Generate an AI meme using imgflip's built-in OpenAI model.

    This simplified flow uses imgflip's ai_meme endpoint with model="openai",
    eliminating the need for a separate ChatGPT API call.

    Returns JSON with success status and either meme URL or error details.
    """
    print(f"[MemeGen] === Starting meme generation ===")
    print(f"[MemeGen] Input prompt: {queryString}")

    # Truncate prefix_text to 64 chars (imgflip limit)
    prefix_text = queryString[:64] if len(queryString) > 64 else queryString
    print(f"[MemeGen] Prefix text (truncated): {prefix_text}")

    # Try with imgflip's OpenAI model first
    try:
        print(f"[MemeGen] Calling imgflip ai_meme with model=openai...")

        response = requests.post(
            "https://api.imgflip.com/ai_meme",
            data={
                "username": IM_USER,
                "password": IM_PASS,
                "model": "openai",
                "prefix_text": prefix_text,
            },
            timeout=45
        )

        result = response.json()
        print(f"[MemeGen] imgflip response: {result}")

        if result.get('success'):
            print(f"[MemeGen] Success! URL: {result.get('data', {}).get('url', 'N/A')}")
            return result

        # If OpenAI model fails, try classic model as fallback
        error_msg = result.get('error_message', 'Unknown error')
        print(f"[MemeGen] OpenAI model failed: {error_msg}")
        print(f"[MemeGen] Trying classic model as fallback...")

        response = requests.post(
            "https://api.imgflip.com/ai_meme",
            data={
                "username": IM_USER,
                "password": IM_PASS,
                "model": "classic",
                "prefix_text": prefix_text,
            },
            timeout=45
        )

        result = response.json()
        print(f"[MemeGen] Classic model response: {result}")

        if result.get('success'):
            print(f"[MemeGen] Success with classic! URL: {result.get('data', {}).get('url', 'N/A')}")
            return result

        # Both models failed
        error_msg = result.get('error_message', 'Both AI models failed')
        print(f"[MemeGen] Both models failed: {error_msg}")
        return {
            "success": False,
            "error_message": error_msg,
            "prompt_used": prefix_text
        }

    except requests.exceptions.Timeout:
        print("[MemeGen] Request timed out")
        return {
            "success": False,
            "error_message": "imgflip API timed out (45s limit)"
        }
    except requests.exceptions.RequestException as e:
        print(f"[MemeGen] Request error: {e}")
        return {
            "success": False,
            "error_message": f"Network error: {str(e)}"
        }
    except Exception as e:
        print(f"[MemeGen] Unexpected error: {e}")
        return {
            "success": False,
            "error_message": f"Unexpected error: {str(e)}"
        }
