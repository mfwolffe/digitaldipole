from functools import reduce
import numpy as np
from django.db import models
from django.db.models.functions import Lower
from django.db.models import UniqueConstraint

from sympy import *
from sympy.parsing.latex import parse_latex
# from sympy.printing.mathml import print_mathml, mathml

# DONE convert equation string to MathML
#         >> not doing this anymore. MathJax
#            is more robust than I realized
#
# DONE use MathJAX (ie, install and config)
#      to better render the math
#         >> MathJax is working as intended
#         >> as such:
#
# SEEME ALL EQ'S SHOULD BE MADE WITH LaTeX NOW
class Variable(models.Model):
    name        = models.CharField(max_length=64, help_text="The variable's name")
    unit        = models.CharField(max_length=16, help_text="The variable's unit")
    symbol      = models.CharField(max_length=16, help_text="The variable's symbol (internal)")
    symbol_u    = models.CharField(max_length=32, help_text="The variable's symbol (user view)", null=True)
    html_symbol = models.CharField(max_length=64, help_text="The html symbol corresponding to this variable", default="")

    def __str__(self):
        return rf"[{self.name}] {self.symbol} : {self.symbol_u}"

    class Meta:
        verbose_name        = "Variable"
        verbose_name_plural = "Variables"

# SEEME When creating equation models, ENSURE
#       symbols and LaTeX do not disagree
# SEEME I made a markdown file with steps on
#       how to make a solveable algebraic
#       expression w/ sympy, then reconstruct
#       into user readable LaTeX representation
class Equation(models.Model):
    name        = models.CharField(default="test", max_length=72, help_text="Calculator name")
    variables   = models.ManyToManyField(Variable, help_text="A known variable in this equation")
    LaTeX_repr  = models.TextField(help_text="LaTeX representation of this equation; No variables", default="")
    simple_repr = models.TextField(help_text="SymPy representation of this equation with simple variables", default="")
  
    # DONE       I don't think the space delimited string approach 
    #            will be simple if in order to generate sympy Symbol
    #            objects symbols(...) is used. I am going to try it out
    #            with destructuring a new list with the return of 
    #            symbols(...)
    #
    # DONE       regarding the payload structure - I assume it is
    #            impossible or highly inconvenient to associate the
    #            Symbol variables with the similarly named properties
    #            in the payload mapping of variables to numeric values
    #
    # DONE       not all of these functions are required anymore, so cut
    #            what is not needed
    #
    # DONE       on top of cutting unnecessary stuff, restructure so that 
    #            there aren't so many repetitive calls for the same api request
    #
    # TODO       Have solutions persist, perhaps symbolic solutions as well.
    #            I think this just needs a check on the response json during
    #            a tab transition
    #
    # TODO       Need to use the sig fig calc to get correct precision for
    #            final computations

    # call direct
    def build_html_mapping(self, var=None):
        novar = var is None
        maph  = {f"{Symbol(f.symbol)}": f.html_symbol for f in (self.variables.exclude(symbol=f"{var}") if not (novar) else self.variables.all())}
        return maph
            
    # call indirect
    def fetch_unknown(self, var):
        return Symbol(self.variables.get(symbol=f"{var}").symbol)
    
    # call indirect
    def sym_solve(self, unknown):
        # SEEME reminder that ordering is initially
        #       nondeterministic as long as commutativity
        #       is not violated
        expl = parse_latex(rf"{self.simple_repr}")
        exps = solve(expl, unknown, dict=True)
        return exps
    
    # call indirect
    def numeric_solve(self, exps, inmap):
        smap = {Symbol(k): str(np.float64(v)) for k, v in inmap.items()}
        nsoln = exps.evalf(subs=smap)
        return nsoln

    # call direct
    def build_relatex(self, var, inmap=None):
        nmap  = 0
        nsoln = 0

        nomap       = (inmap is None)
        unknown     = self.fetch_unknown(var)
        expsf       = self.sym_solve(unknown)
        fns_mapping = {Symbol(f.symbol): f.symbol_u for f in self.variables.all()}

        exps = expsf[0][unknown]

        if not (nomap):
            nmap  = {Symbol(k): str(np.float64(v)) for k, v in inmap.items()}
            nsoln = self.numeric_solve(exps, inmap)

        RHS     = latex(exps, symbol_names=(fns_mapping if nomap else nmap), mul_symbol='dot')
        relatex = rf"{fns_mapping[unknown]} = " + rf"{RHS}" + (r"" if nomap else rf" = {nsoln:.3f}")
        return relatex


    class Meta:
        verbose_name        = "Equation"
        verbose_name_plural = "Equations"


class Calculator(models.Model):
    CATEGORIES = [
        ("GSLW", "Gas Laws"),
        ("SOLN", "Solutions"),
        ("MISC", "Miscellaneous"),
        ("STCH", "Stoichiometry"),
        ("THRM", "Thermodynamics"),
        ("CNVR", "Unit Conversions"),
        ("ELCT", "Electrochemistry"),
        ("NCLR", "Nuclear Chemistry"),
    ]

    # TOCONSIDER path to component? - if so, maybe make the constraint that?
    name          = models.CharField(max_length=72, help_text="This calculator's name")
    equation      = models.OneToOneField(Equation, on_delete=models.SET_NULL, null=True)
    information   = models.TextField(help_text="The calculator reference the user may hide/show")
    calc_category = models.CharField(max_length=4, choices=CATEGORIES, default="MISC", help_text="Calculator Category")

    class Meta:
        verbose_name        = "Calculator"
        verbose_name_plural = "Calculators"
        constraints = [
            UniqueConstraint(
                Lower("name"),
                name="calc_name_case_insensitive_unique",
                violation_error_message="Calculator Already Exists",
            ),
        ]
        ordering = ['calc_category', 'name']
