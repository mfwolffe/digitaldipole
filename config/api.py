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

# Category code to URL path mapping
CATEGORY_PATHS = {
    'GSLW': '/calculators/gas-laws',
    'THRM': '/calculators/thermo',
    'KNTC': '/calculators/kinetics',
    'SOLN': '/calculators/solutions',
    'ELEC': '/calculators/electrochemistry',
    'MISC': '/calculators',
}


@api.get("/favorites/")
def get_favorites(request):
    """Get all favorite equations for the current user."""
    if not request.user.is_authenticated:
        return {"authenticated": False, "favorites": []}

    favorites = FavoriteEquation.objects.select_related('calculator').filter(user=request.user)

    favorite_list = []
    for fav in favorites:
        calc = fav.calculator
        base_path = CATEGORY_PATHS.get(calc.calc_category, '/calculators')
        category_display = calc.get_calc_category_display()

        favorite_list.append({
            "id": fav.id,
            "equation_id": calc.registry_id,
            "name": calc.name,
            "category": category_display,
            "path": f"{base_path}/{calc.registry_id}",
            "created_at": fav.created_at.isoformat(),
        })

    return {"authenticated": True, "favorites": favorite_list}


@api.post("/favorites/{registry_id}")
def toggle_favorite(request, registry_id: str):
    """Toggle favorite status for a calculator. Returns new status."""
    if not request.user.is_authenticated:
        return {"success": False, "error": "Authentication required"}

    # Look up the calculator by registry_id
    calculator = Calculator.objects.filter(registry_id=registry_id).first()
    if not calculator:
        return {"success": False, "error": f"Calculator '{registry_id}' not found"}

    # Check if already favorited
    existing = FavoriteEquation.objects.filter(
        user=request.user,
        calculator=calculator,
    ).first()

    if existing:
        # Remove from favorites
        existing.delete()
        return {
            "success": True,
            "is_favorite": False,
            "message": f"Removed '{calculator.name}' from favorites",
        }
    else:
        # Add to favorites
        FavoriteEquation.objects.create(user=request.user, calculator=calculator)
        return {
            "success": True,
            "is_favorite": True,
            "message": f"Added '{calculator.name}' to favorites",
        }


@api.get("/favorites/check/{registry_id}")
def check_favorite(request, registry_id: str):
    """Check if a calculator is favorited by the current user."""
    if not request.user.is_authenticated:
        return {"authenticated": False, "is_favorite": False}

    is_favorite = FavoriteEquation.objects.filter(
        user=request.user,
        calculator__registry_id=registry_id,
    ).exists()

    return {"authenticated": True, "is_favorite": is_favorite}

class VariableSchema(Schema):
    val:  str
    name: str

class CalcNumericEndpoint(Schema):
    name:     str
    unknown:  str
    listVars: list[VariableSchema]

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
