from functools import reduce
import numpy as np
from django.db import models
from django.db.models.functions import Lower
from django.db.models import UniqueConstraint

from sympy import *
from sympy.parsing.latex import parse_latex
# from sympy.printing.mathml import print_mathml, mathml

# [x] TODO convert equation string to MathML
#          >> not doing this anymore. MathJax
#             is more robust than I realized
#
# [x] TODO use MathJAX (ie, install and config)
#          to better render the math
#          >> MathJax is working as intended
#          >> as such:
#             SEEME ALL EQ'S SHOULD BE MADE WITH LaTeX NOW


class Variable(models.Model):
    name        = models.CharField(max_length=64, help_text="The variable's name")
    unit        = models.CharField(max_length=16, help_text="The variable's unit")
    value       = models.FloatField(null=True, blank=True, default=None, help_text="value")
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
  
    # TOCONSIDER I don't think the space delimited string approach 
    #            will be simple if in order to generate sympy Symbol
    #            objects symbols(...) is used. I am going to try it out
    #            with destructuring a new list with the return of 
    #            symbols(...)
    # 
    # SEEME      >> It's working actually. Though it's a bit unwieldy, to
    #               to say the least
    #
    # TOCONSIDER regarding the payload structure - I assume it is
    #            impossible or highly inconvenient to associate the
    #            Symbol variables with the similarly named properties
    #            in the payload mapping of variables to numeric values
    #
    # TOCONSIDER wrt to above 'toconsider': in POST, just assign the user
    #            values to the variable fields; maybe establish a shared
    #            ID
    #
    # TODO       not all of these functions are required anymore, so cut
    #            what is not needed
    #
    # TODO       on top of cutting unnecessary stuff, restructure so that 
    #            there aren't so many repetitive calls for the same api request
    #
    # TODO       Have solutions persist, perhaps symbolic solutions as well.
    #            I think this just needs a check on the response json during 
    #            a tab transition
    #
    # TODO       seriously dude, cut the cruft & redundancies
    #
    # TODO       Need to use the sig fig calc to get correct precision for 
    #            final computations
    #
    def symbol_reducer(self, symbol_list):
        return reduce(lambda x, y: x + ' ' + y, symbol_list)

    def symbol_strgen(self, exclude=False):
        field_list = self.variables.all()
        # field_list = self.variables.exclude(value=None) if exclude else self.variables.all()

        sym_list = [var.symbol for var in field_list]
        return self.symbol_reducer(sym_list)
    
    def build_sym_list(self, exclude=False):
        sym_str = self.symbol_strgen(exclude)

        symPy_sym_k = symbols(sym_str)
        return symPy_sym_k
        
    def build_sym_mapping(self, exclude=False):
        # f_mapping = {f"{Symbol(field.symbol)}": field.symbol_u for field in (self.variables.exclude(value=None) if exclude else self.variables.all())}
        f_mapping = {rf"{Symbol(field.symbol)}": rf"{field.symbol_u}" for field in self.variables.all()}
        return f_mapping
    
    def build_html_mapping(self, var=None):
        f_mapping = {f"{Symbol(field.symbol)}": field.html_symbol for field in (self.variables.exclude(symbol=f"{var}") if var is not None else self.variables.all())}
        return f_mapping
    
    def build_num_mapping(self):
        return {Symbol(field.symbol): field.value for field in (self.variables.exclude(value=None))}

    def parse_orig(self):
        return parse_latex(rf"{self.LaTeX_repr}")
    
    def parse_simple(self):
        return parse_latex(rf"{self.simple_repr}")
    
    def fetch_unknown(self, var):
        return Symbol(self.variables.get(symbol=f"{var}").symbol)
    
    def sym_solve(self, var):
        # SEEME reminder that ordering is initially
        #       nondeterministic as long as commutativity
        #       is not violated
        expl    = self.parse_simple()
        unknown = self.fetch_unknown(var)

        exps = solve(expl, unknown, dict=True)
        return exps
    
    def numeric_solve(self, var, input_map):
        exps    = self.sym_solve(var)
        unknown = self.fetch_unknown(var)

        smap = {}
        # TOCONSIDER comprehension?
        for k, v in input_map.items():
            syk = Symbol(k)
            smap[syk] = np.float64(v)
        
        nsoln = exps[0][unknown].evalf(subs=smap)
        return nsoln

    def build_relatex(self, var, original=True):
        exps        = self.parse_orig() if original else self.sym_solve(var)
        unknown     = self.fetch_unknown(var)
        sym_mapping = self.build_sym_mapping()
        fns_mapping = {Symbol(field.symbol): field.symbol_u for field in self.variables.all()}

        RHS = latex(exps if original else exps[0][unknown], symbol_names=fns_mapping, mul_symbol='dot')

        relatex = rf"{fns_mapping[unknown]} = " + rf"{RHS}"
        return relatex
    
    def build_relatex_soln(self, var, in_map=None):
        nsoln = self.numeric_solve(var, in_map)
        
        exps        = self.sym_solve(var)
        unknown     = self.fetch_unknown(var)
        fns_mapping = {Symbol(field.symbol): field.symbol_u for field in self.variables.all()}

        smap = {}
        for k, v in in_map.items():
            syk       = Symbol(k)
            smap[syk] = str(np.float64(v))

        RHS = latex(exps if in_map is None else exps[0][unknown], symbol_names=smap, mul_symbol='dot')

        relatex = rf"{fns_mapping[unknown]} = " + rf"{RHS} = {nsoln:.3f}"
        return relatex
    
    # SEEME state as of commit "slight streamline" working with 
    #       sort of streamlined version
    def build_relatex_soln_t(self, var, in_map=None):
        nmap = 0
        nsoln = 0

        exps        = self.sym_solve(var)
        unknown     = self.fetch_unknown(var)
        fns_mapping = {Symbol(field.symbol): field.symbol_u for field in self.variables.all()}

        if in_map is not None:
            nmap = {Symbol(k): str(np.float64(v)) for k, v in in_map.items()}
            nsoln = self.numeric_solve(var, in_map)

        RHS = latex(exps[0][unknown], symbol_names=(fns_mapping if in_map is None else nmap), mul_symbol='dot')
        relatex = rf"{fns_mapping[unknown]} = " + rf"{RHS}" + (r"" if in_map is None else rf" = {nsoln:.3f}")
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
