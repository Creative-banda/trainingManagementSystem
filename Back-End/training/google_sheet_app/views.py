from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.conf import settings
from datetime import datetime


class GoogleSheetView(APIView):
    # def get_or_create_sheet()
    def get(self, request: dict) -> Response:
        try:
            sh = settings.GSPREAD_CLIENT.open(request.data.get('worksheet'))
            worksheet = sh.worksheet(request.data.get("school"))
            print(worksheet)
            return Response(worksheet.get_all_values(), status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request: dict) -> Response:
        try:
            response = request.data
            sheet = response.pop("worksheet")
            school = response.pop("school")
            sh = settings.GSPREAD_CLIENT.open(sheet)
            try:
                worksheet = sh.worksheet(school)
            except:
                worksheet = sh.add_worksheet(title=school, rows="100", cols="20")
                worksheet.append_row(["Timestamp","Training Type","Grade","Topic", "start Time", "End Time", "Conducted", "Trainer", "Remark"])
            data = [str(datetime.now())]

            for _, value in response.items():
                data.append(value)

            worksheet.append_row(data)
            print(worksheet.url)
            return Response({"message":"success"}, status=status.HTTP_200_OK)
        except Exception as e:
            print(sh)
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        
    