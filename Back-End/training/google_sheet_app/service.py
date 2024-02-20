import os
import gspread
from typing import List
from django.conf import settings



credentials = {
    "type": os.environ.get("TYPE"),
    "project_id": os.environ.get("PROJECT_ID"),
    "private_key_id": os.environ.get("PRIVATE_KEY_ID"),
    "private_key": os.environ.get("PRIVATE_KEY"),
    "client_email": os.environ.get("CLIENT_EMAIL"),
    "client_id": os.environ.get("CLIENT_ID"),
    "auth_uri": os.environ.get("AUTH_URI"),
    "token_uri": os.environ.get("TOKEN_URI"),
    "auth_provider_x509_cert_url": os.environ.get("AUTH_PROVIDER_X509_CERT_URL"),
    "client_x509_cert_url": os.environ.get("CLIENT_X509_CERT_URL"),
    "universe_domain": os.environ.get("UNIVERSE_DOMAIN")
  }

def initialize_gspread() -> gspread.client.Client:
  """
  Initialize a gspread client with the given credentials.
  """
  print(credentials["private_key"])
  return gspread.service_account_from_dict(credentials)  # Note: we could move this to settings to do this once.


def get_all_rows(doc_name: str, sheet_name: str = None) -> List[dict]:
  """
  Fetches all rows from a given Google Sheet worksheet.
  """
  sh = settings.GSPREAD_CLIENT.open(doc_name)
  worksheet = sh.worksheet[sheet_name] if sheet_name else sh.get_worksheet(0)
  return worksheet.get_all_records()