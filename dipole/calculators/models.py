from functools import reduce
from django.db import models
from django.db.models.functions import Lower
from django.db.models import UniqueConstraint

from sympy import *
from sympy.parsing.latex import parse_latex
from sympy.printing.mathml import print_mathml, mathml

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
    name     = models.CharField(max_length=64, help_text="The variable's name")
    unit     = models.CharField(max_length=16, help_text="The variable's unit")
    value    = models.FloatField(null=True, blank=True, default=None, help_text="value")
    symbol   = models.CharField(max_length=16, help_text="The variable's symbol (internal)")
    symbol_u = models.CharField(max_length=32, help_text="The variable's symbol (user view)", null=True)

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
    name       = models.CharField(default="test", max_length=72, help_text="Calculator name")
    variables  = models.ManyToManyField(Variable, help_text="A known variable in this equation")
    LaTeX_repr = models.TextField(help_text="LaTeX representation of this equation; No variables", default="")
  
    # TOCONSIDER I don't think the space delimited string approach 
    #            will be simple if in order to generate sympy Symbol
    #            objects symbols(...) is used. I am going to try it out
    #            with destructuring a new list with the return of 
    #            symbols(...)
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

    def symbol_reducer(self, symbol_list):
        return reduce(lambda x, y: x + ' ' + y, symbol_list)

    def symbol_strgen(self, exclude=False):
        field_list = self.variables.exclude(value=None) if exclude else self.variables.all()

        sym_list = [var.symbol for var in field_list]
        return self.symbol_reducer(sym_list)
    
    def build_sym_list(self):
        sym_str = self.symbol_strgen()

        symPy_sym_k = symbols(sym_str)
        return symPy_sym_k
        
    def fetch_unknown(self):
        return Symbol(self.variables.filter(value=None)[0].symbol)
    
    def build_sym_mapping(self, exclude=False):
        f_mapping = {Symbol(field.symbol): field.symbol_u for field in (self.variables.exclude(value=None) if exclude else self.variables.all())}
        return f_mapping
    
    def build_num_mapping(self):
        return {Symbol(field.symbol): field.value for field in (self.variables.exclude(value=None))}

    def sym_solve(self):
        symPy_sym_u = self.fetch_unknown()

        # SEEME reminder that ordering is initially 
        #       nondeterministic as long as commutativity
        #       is not violated
        expr = rf"{self.LaTeX_repr}"
        expl = parse_latex(expr)

        exps = solve(expl, symPy_sym_u, dict=True)
        return exps[0][symPy_sym_u]
    
    def numeric_solve(self):
        exps    = self.sym_solve()
        val_map = self.build_num_mapping()

        nsoln = exps.evalf(subs=val_map)
        return nsoln
        
    def build_relatex(self):
        exps        = self.sym_solve()
        unknown     = self.fetch_unknown()
        sym_mapping = self.build_sym_mapping()
        
        relatex = latex(exps[0][unknown], symbol_names=sym_mapping, mul_symbol='dot')
        return f"{relatex}"
    
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
