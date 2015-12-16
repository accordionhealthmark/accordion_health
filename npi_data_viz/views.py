from django.shortcuts import render
import csv
import pandas as pd
import numpy as np
import json as simplejson
from django.http import JsonResponse 

def index(request):
  return render(request, 'index.html')
