#!/Users/matthewwolffe/Desktop/Spring 2024/CS 347/FinalProject/digitaldipole/chemenv/bin/python

# $Id: rst2odt.py 9115 2022-07-28 17:06:24Z milde $
# Author: Dave Kuhlman <dkuhlman@rexx.com>
# Copyright: This module has been placed in the public domain.

"""
A front end to the Docutils Publisher, producing OpenOffice documents.
"""

try:
    import locale

    locale.setlocale(locale.LC_ALL, "")
except Exception:
    pass

from docutils.core import default_description
from docutils.core import publish_cmdline_to_binary
from docutils.writers.odf_odt import Reader
from docutils.writers.odf_odt import Writer

description = (
    "Generates OpenDocument/OpenOffice/ODF documents from "
    "standalone reStructuredText sources.  " + default_description
)


writer = Writer()
reader = Reader()
output = publish_cmdline_to_binary(
    reader=reader,
    writer=writer,
    description=description,
)
