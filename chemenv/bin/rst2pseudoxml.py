#!/Users/matthewwolffe/Desktop/Spring 2024/CS 347/FinalProject/digitaldipole/chemenv/bin/python

# $Id: rst2pseudoxml.py 9115 2022-07-28 17:06:24Z milde $
# Author: David Goodger <goodger@python.org>
# Copyright: This module has been placed in the public domain.

"""
A minimal front end to the Docutils Publisher, producing pseudo-XML.
"""

try:
    import locale

    locale.setlocale(locale.LC_ALL, "")
except Exception:
    pass

from docutils.core import default_description
from docutils.core import publish_cmdline

description = (
    "Generates pseudo-XML from standalone reStructuredText "
    "sources (for testing purposes).  " + default_description
)

publish_cmdline(description=description)
