import os
from .base import *

if os.environ.get('stage') == 'production':
    from .production import *
else:
    from .development import *