import os
from .base import *

load_dotenv()
if os.environ.get('stage') == 'production':
    print("Running is production")
    from .production import *
else:
    print("Running is development")
    from .development import *

