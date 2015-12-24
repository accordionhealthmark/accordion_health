from django.shortcuts import render
import pandas as pd
import json 
from django.http import JsonResponse 
from models import County


def index(request):
  if request.POST:
    # Create a dataframe out of all of the stored data.
    county_data = pd.DataFrame(list(County.objects.all().values()))
    if request.POST.get('map'):
      doctor_type = request.POST.get('map')
      # Filter by doctor type
      doctor_type_county_data = county_data[county_data.doctor_type == doctor_type]
      # Sum frequency by FIP code. 
      doctor_type_county_data = doctor_type_county_data.groupby(['fip_code']).sum().reset_index()
      # Create column for ratio of doctors per population
      doctor_type_county_data['doctor_per_pop'] = doctor_type_county_data['population']/doctor_type_county_data['frequency']
      # Select correct columns
      doctor_type_county_data = doctor_type_county_data[['fip_code','doctor_per_pop']].set_index(['fip_code'])
      # Grab numerical values to use in our D3 quantile method. Used to split the data evenly
      # into different buckets
      population_data = doctor_type_county_data.doctor_per_pop.tolist()
      doctor_dict_data = doctor_type_county_data.to_dict()
      doctor_dict_data['population_data'] = population_data
      json_data = json.dumps(doctor_dict_data)
    elif request.POST.get('bar'):
      state = request.POST.get('bar')
      # Filter by state
      state_data = county_data[county_data.state == state]
      # Sum frequency by state
      set_data = state_data[['state','doctor_type','frequency']].groupby(['state','doctor_type']).sum().reset_index().sort('frequency', ascending=False)[0:10]
      # Create object suitable for front end processing
      bar_plot_data = []
      for index, row in set_data.iterrows(): 
        datum = {'doctor_type': row['doctor_type'],'frequency': row['frequency']}
        bar_plot_data.append(datum)
      bar_plot_dict = {'bar_plot': bar_plot_data}
      json_data = json.dumps(bar_plot_dict)
    return JsonResponse(json_data, safe=False)
  return render(request, 'index.html')

