from django.shortcuts import render
from django.http import HttpResponse

def AccountHome(request):
    return HttpResponse("<h1> This is Accounts </h1>")
