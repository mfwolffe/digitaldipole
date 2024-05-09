import json
from sympy import *
from dipole.users import models
from ninja import NinjaAPI, Schema
from dipole.calculators.models import Equation
from django.shortcuts import get_object_or_404
import requests
import environ
import re
import nltk

nltk.download('punkt', "nltk/")



env = environ.Env()

GPKEY   = env('GPKEY')
GPHOST  = env('GPHOST')
IM_USER = env('IM_USER')
IM_PASS = env('IM_PASS')

api = NinjaAPI()


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
    url = "https://chatgpt-42.p.rapidapi.com/conversationgpt4-2"

    payload = {
      "messages": [
        {
          "role": "user",
          "content": f"Make a single funny, short meme text from this input: {queryString}. Do not include hashtags, wrap it in double quotes, and it must be less than 64 characters",
        }
      ],
      "system_prompt": "",
      "temperature": 0.9,
      "top_k": 8,
      "top_p": 0.9,
      "max_tokens": 256,
      "web_access": False
    }
    headers = {
      "content-type": "application/json",
      "X-RapidAPI-Key": GPKEY,
      "X-RapidAPI-Host": GPHOST
    }

    response = requests.post(url, json=payload, headers=headers)
    raw_meme = response.json()['result']
    print(raw_meme)

    re_meme = re.findall(r'".*"', raw_meme)
    match_meme = re_meme[0]
    print(match_meme)
    strip_meme = match_meme.replace('"', '')
    print(strip_meme)

    response = requests.post(
        "https://api.imgflip.com/ai_meme",
        data={
            "username": IM_USER,
            "password": IM_PASS,
            "prefix_text": strip_meme,
        },
    )

    count = 1
    while not (response.json()['success']) and count <= 10:
        payload['messages'][0]['content'] = f"Can you make this meme text funnier: {strip_meme}, but it must be less than 64 characters and wrap the text in double quotes"
        response = requests.post(url, json=payload, headers=headers)

        raw_meme = response.json()['result']
        re_meme = re.findall(r'".*"', raw_meme)
        match_meme = re_meme[0]
        print(match_meme)
        strip_meme = match_meme.replace('"', '')
        print(strip_meme)

        if (strip_meme.lower().find("char") != -1):
            # nltk.download('punkt')
            print("tokenizing...")
            # tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')
            strip_list = nltk.sent_tokenize(strip_meme)
            print(strip_list)
            strip_meme = strip_list[0]

        response = requests.post(
          "https://api.imgflip.com/ai_meme",
          data={
              "username": IM_USER,
              "password": IM_PASS,
              "prefix_text": strip_meme,
          },
        )
        count += 1

    print(f"{count} request(s) attempted")

    # response = requests.post(
    #     "https://api.imgflip.com/automeme",
    #     data={
    #         "username": IM_USER,
    #         "password": IM_PASS,
    #         "text": "look at me I am so good",
    #         "no_watermark": "true",
    #     },
    # )

    return response.json()
