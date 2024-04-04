# Building The Django Calculator Models with SymPy

#### TODO:
* finish example with interpolation of numeric values into solution expression
* Show how to insert into model
* Figure out MathJAX steps to render

<hr>

In `dipole/frontend/calculators/models.py`


Say you want to build and render the equation for the heat change of a system, $q=m \cdot C_{sp} \cdot \Delta T$, for one of our calculators. 

Seems like you've got your work cut out for you...
_...or not?_

Enter `sympy` 

Before we get started, here are some links:
* [sympy printing (full ref)](https://docs.sympy.org/latest/modules/printing.html)
* [sympy parsing (full ref)](https://docs.sympy.org/latest/modules/parsing.html)
* [Solving](https://docs.sympy.org/latest/guides/solving/index.html) and [solve() guidance](https://docs.sympy.org/latest/guides/solving/solving-guidance.html)
* [Gotchas](https://docs.sympy.org/dev/explanation/gotchas.html)

Natürlich, make sure you've imported what you're trying to use, or just `from sympy import *` and hope for the best
**(this probably won't include everything you may need)**

We need some variables in our model first, namely $q$, $m$ and, for now, we'll assume the user has calculated $\Delta T$ themselves with their $T_f$ and $T_i$

First let's run a few tests to make sure things are 'working':

```
>>> python
>>> from sympy import *
>>> init_session()

# assign variables to the symbols
>>> q, m, C, D = symbols('q m C_sp Delta')
>>> D
Δ
>>> C
Cₛₚ

```
If you don't get the greek letter delta, or the subscripted C 
something has gone wrong, likely you did not init_session()

### General Steps

We're gonna have to keep track of a few things, namely, a simplified symbolic representation for the CAS, human readable versions, and a numerical solution.


```
# example will be shown in the command line python interpreter so you can easily verify as you go
>>> python
>>> from sympy import *
>>> init_session()
>>> from sympy.parsing.latex import *

# associate variables with Symbols, sans subscripts, greek letters, etc
>>> q, m, C, D = symbols('q m C D')

# Make a simplified version of the desired equation to match the symbols used above:
>>> expr = r"q=m \cdot C \cdot D"

# parse the LaTeX to make it solveable
# note: your output for `expl` may have different orderings of variables when commutativity applies
>>> expl = parse_latex(expr)
>>> expl
q = D⋅C⋅m


# to solve for a particular Symbol, e.g., for m, use the solve() function:
# NOTE: make sure kwarg dict=True
>>> exps = solve(expl, m, dict=True)
>>> exps
⎡⎧    q ⎫⎤
⎢⎨m: ───⎬⎥
⎣⎩   C⋅D⎭⎦

# the above output does look strange yes, but it's better than the alternative, 
# also users won't be seeing that


# Now to actually get a numeric solution, we can access the expression with key m 
# (note that is not the char m, it is the Symbol m) in the dict at index 0 above
# and call evalf() on it, using kwarg subs to assign the known symbols
>>> soln = exps[0][m].evalf(subs={q: 137, D: 42, C: 0.08815})
>>> soln
37.0040245252951

# IMPORTANT NOTE
# if we assume that all Symbols other than C are exact and therefore infinite in precision, we have 
# violated some rules wrt significant figures. Thankfully, we don't need to worry
# sig figs (we do need to determine the value that is limiting however, but that's for another day)
#
# we have 4 sig figs available from C, so limit the precision with evalf()
>>> solnf = soln.evalf(4)
>>> solnf
37.00

# alternatively, just:
>>> soln = exps[0][m].evalf(4, subs={q: 137, D: 42, C: 0.08815})
>>> soln
37.00

# For displaying steps to users, we would like to reintroduce the subscripts, greek letters etc.
# to do that we need to substitute LaTeX strings for the Symbols
# and also specify that multiplication will be represented with dots 
# rather than 'x' or '*' (\cdot in LaTeX)
>>> relatex = latex(exps[0][m], symbol_names={C: "C_{sp}", D: "\Delta T", m: "m"}, mul_symbol="dot")
>>> relatex
\frac{q}{C_{sp} \cdot \Delta T}

# we're almost there, we do need to specify what that is equal to of course. Presumably we've stored
# the unknown much earlier, otherwise we wouldn't have gotten to this point.
# To do so, we'll just concatenate raw string with unknown and latex string above:
>>> intrmd = r"m = " + relatex
>>> intrmd
m = \frac{q}{C_{sp} \cdot \Delta T}


# It is likely not useful to us in that form in terms of rendering
# TODO verify MathJAX will accept dollar delimited LaTeX
# This can be accomplished by enclosing the LaTeX with '$' by specifying 'inline' mode
# OR, not sure if this is fine, but does render nicely in terminal even, just "re"-parse 
# that LaTeX string
>>> finexp = parse_latex(str)
>>> finexp
         q     
m = ───────────
    C_{p*s}⋅Δ⋅T

```

### More Complex Equations
#### You Try: Henderson-Hasselbalch Equation

Try your hand at the above process with a more complicated expression (formatting-wise)


$\text{pH}=\text{p}K_a+\log{\frac{[\text{A}^-]}{[\text{HA}]}}$

Hint: here's the LaTeX
`expr_str = r"\text{pH}=\text{p}K_{a}+log{\frac{[\text{A}^-]}{[\text{HA}]}}"`



In case reverting to MathML:
Whenever generating MathML using any of the following methods, make sure to pass `printer=presentation`,
* `mathml(exp)`
* `print_mathml(exp)`


Matt Wolffe