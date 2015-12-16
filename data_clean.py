import pandas as pd
import random
import time
from fips_to_zips import zipcode_to_county
import json
import os


# This script was used to wrangle the data in an appropiate
# format and to create json data for the D3 bar plots and maps.
# The script is currently only shown for presentation purposes,
# since I was unable to upload final_data.csv, which is the
# cleaned version of the original 4gb file. (there are space 
# limitations on the size of files that are pushed to GitHub).

if not os.path.exists('./static/csv/sampled-set.csv'):
    #This file was removed due to space issues with GitHub.
    npi_data = pd.read_csv('final_data.csv', dtype=object)
    state_ids = pd.read_csv('./static/csv/us-state-names.tsv', sep='\t', dtype=object)

    ######################
    ### Wrangle Data #####
    ######################

    # Remove spaces from column names to help with indexing
    npi_data.columns = [
        'entity_type', 'provider_credentials', 'state',
        'postal_code','deactivation_code', 'deactivation_date', 
        'activation_date','gender', 'name_prefix', 
        'is_sole_proprietor'
    ]

    # Sample data(DUHHHH)
    rows = random.sample(npi_data.index, 100000)
    sampled_data = npi_data.ix[rows]

    # Function used to translate zipcode to FIP.
    def find_county(zipcode):
        try: 
            return zipcode_to_county[zipcode] 
        except KeyError: 
            return 'County not found.'

    # Grab only first 5 digits in zipcode
    sampled_data['postal_code'] = sampled_data['postal_code'].map(lambda x: str(x)[0:5])
    # Assign FIPs code based on zipcode using fips_to_zips.py dictionary (mapping found online, but missing data)
    sampled_data['county_id'] = sampled_data['postal_code'].map(lambda x: find_county(x))
    # Merge so that data contains state id used in D3
    merged_data = pd.merge(sampled_data, state_ids, left_on='state', right_on='code',how='inner')
    #Eliminate extra columns
    merged_data = merged_data.drop('code', 1)
    merged_data = merged_data.drop('deactivation_code', 1)

    #######################################
    ### Create json files for Map data ####
    #######################################

    map_types = ['id', 'county_id']
    data_categories = {
      'gender':['M','F'],
      'is_sole_proprietor':['Y','N'],
      'entity_type':['1','2'],
    }
    #Create a json file for each state, county to variable combo.
    for map_type in map_types:
        for variable, factors in data_categories.iteritems():
            # Use getattr since dot operator cant be use when we have a variable attribute
            data_series = getattr(merged_data, variable)
            #Wrangle in correct format
            cleaned_data = merged_data[data_series.isin(factors)]
            formated_data = pd.crosstab(getattr(cleaned_data, map_type), getattr(cleaned_data, variable)).apply(lambda x: x/x.sum(), axis=1)
            dict_data = formated_data.to_dict()
            _map_type = 'State' if map_type == 'id' else 'County'
            #Add map type to json
            dict_data['map_type'] = _map_type
            filepath = './static/json_data/%s_%s.json' % (_map_type, variable) 
            with open(filepath, "w") as outfile:
                json.dump(dict_data, outfile, separators=(',', ':'))
           

    ##################################
    ## Transform data for bar plot ###
    ##################################

    bar_plot_variables = ['provider_credentials', 'name_prefix']
    for bar_variable in bar_plot_variables:
        # Group by variable and frequency of that variable
        freq_df = merged_data.groupby([bar_variable]).size().reset_index(name='Freq').sort('Freq', ascending=False)
        # For credentials just get frequency of highest occuring strings
        # and count those due to variability and inconsistency in reporting.
        if bar_variable == 'provider_credentials':
            freq_df = freq_df[1:15]
        freq_list = freq_df.to_dict(orient='records')
        bar_plot_data = {}
        bar_plot_data['data'] = freq_list
        bar_plot_data['type'] = bar_variable
        filepath = './static/%s_freq.json' % (bar_variable) 
        with open(filepath, "w") as bar_plot:
            json.dump(bar_plot_data, bar_plot, separators=(',', ':'))
    merged_data.to_csv('./static/csv/sampled-set.csv', ',', index=False)





