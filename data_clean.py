import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "accordion_health.settings")

import pandas as pd
import random
import time
from original_fips_to_zips import original_fips_to_zips
import json
from npi_data_viz.models import County

# TL;DR

#Ready in initial data
npi_data = pd.read_csv('./static/csv/npi_doctor_data.csv')

#Maps codes to profession titles
taxonomy_codes = pd.read_csv('./static/csv/taxonomy_codes.csv')

#Population for every zipcode in US
population_by_zipcode = pd.read_csv('./static/csv/zip_to_population.csv', dtype=str)

##########################################
### CREATE POPULATION BY FIP CODE DATA ###
##########################################

# Rename columns 
population_by_zipcode.columns = ['zipcode', 'population']

# Create a list of lists with [FIP, Zipcode] pairs to create
# dataframe
zip_to_fip_dict = []
for key, list_of_zips in original_fips_to_zips.items():
    # Remove first character for FIP codes that start with a zero
    # since this is how they are identified in our us-topo.json file
    if key[0] == '0':
        fip = key[1:5]
    else:
        fip = key
    for zipcode in list_of_zips:
        zip_to_fip_dict.append([fip, zipcode])

#Create a dataframe that ties a FIP code to every FIP code
zip_to_fip = pd.DataFrame(zip_to_fip_dict, columns=['FIP', 'zipcode'])

# Convert zipcode and population data types
zip_to_fip.zipcode = zip_to_fip.zipcode.astype(str)
population_by_zipcode.population = population_by_zipcode.population.astype(int)

# Merge our zip to fip mapping with population data
# Merged dataset will be FIP, Zipcode, Zipcode population
zip_fip_population = pd.merge(zip_to_fip, population_by_zipcode, on='zipcode')

#Sum by FIP code to get population for each FIP area.
fip_population = zip_fip_population[['FIP','population']].groupby(['FIP']).sum().reset_index()
# fip_population.to_csv('fip_population.csv')

##########################################
### TYPE OF DOCTOR BY FIP (Freq) Data ####
##########################################

doctor_credentials = [
    'MD', 'M D', 'M.D.', 
    'M.D', 'M D.', 'DO',
    'D.O.', 'D O', 'D O.'
]

column_names = [
    'npi', 'country_code', 'zipcode',
    'state', 'credential', 'taxonomy_code_1', 'taxonomy_code_2', 
    'taxonomy_code_3', 'taxonomy_code_4', 'taxonomy_code_5',
    'taxonomy_code_6', 'taxonomy_code_7', 'taxonomy_code_8',
    'taxonomy_code_9', 'taxonomy_code_10', 'taxonomy_code_11',
    'taxonomy_code_12', 'taxonomy_code_13', 'taxonomy_code_14',
    'taxonomy_code_15', 'primary_1', 'primary_2',
    'primary_3', 'primary_4', 'primary_5',
    'primary_6', 'primary_7', 'primary_8',
    'primary_9', 'primary_10', 'primary_11',
    'primary_12', 'primary_13', 'primary_14',
    'primary_15'
]

# Rename columns
npi_data.columns = column_names

# Filter data by MD and OD type doctors in the US.
us_doctor_data = npi_data[(npi_data.credential.isin(doctor_credentials)) & (npi_data.country_code == 'US')]

# Get zipcode by removing all numbers past the first 5 characters in the zipcode field.
us_doctor_data['zipcode'] = us_doctor_data['zipcode'].map(lambda x: str(x)[0:5])

# Replace NA values
us_doctor_data = us_doctor_data.fillna('')

# Use this function to find the primary type of doctor for each provider
def find_primary(row):
    for i in range(1,15):
        if row['primary_%s' % str(i)] == 'Y':
            return row['taxonomy_code_%s' % str(i)]

us_doctor_data['primary_taxonomy'] = us_doctor_data.apply(lambda row: find_primary(row), axis=1)

# Assign a FIP code to each record 
us_doctor_data = pd.merge(zip_to_fip, us_doctor_data, on='zipcode')

# Select only FIP, state, and primary Taxonomy code
us_doctor_data = us_doctor_data[['FIP', 'primary_taxonomy', 'state']]

# Join the taxonomy table that has specific names for 
# for each taxonomy code
us_doctor_data = pd.merge(us_doctor_data, taxonomy_codes, left_on='primary_taxonomy', right_on='Code')

# Select necessary columns
us_doctor_data = us_doctor_data[['FIP', 'primary_taxonomy', 'Classification', 'state']]

# Find the top 20 types of doctors by frequency in total set
top_doctor_types = us_doctor_data.groupby(['Classification']).size().reset_index(name="Freq").sort(['Freq'], ascending=False)[0:20]

# Make a list of top 20 doctors
list_of_top_doctors = top_doctor_types.Classification.tolist()

# Filter data to only contain top 20 docots
final_doctor = us_doctor_data[us_doctor_data.Classification.isin(list_of_top_doctors)]

# Get frequency by FIP, Type of Doctor
final_doctor = final_doctor.groupby(['FIP', 'Classification', 'state']).size().reset_index(name="Freq")
final_doctor = pd.merge(final_doctor, fip_population, on='FIP')

# Load data in database
for index, row in final_doctor.iterrows():
    county = County(fip_code=row['FIP'], doctor_type=row['Classification'], state=row['state'], frequency=row['Freq'], population=row['population'] )
    county.save()

