**NPI D3 Visualaztions**

The original data set was cleaned using [csvkit](https://csvkit.readthedocs.org/en/0.9.1/). The cleaned csv was too large to upload so it's not in this repo. I can send it over upon request. Following this clean, I used [pandas](http://pandas.pydata.org/) to format the data in a way that would make it easier to load the data to the database (row by row from dataframe). 

In order to create a counties US map I found a JSON file with FIPS to Zipcode mappings [here](http://mavericklee.com/assets/data/FIPS_to_ZIPS.json). I also used a data set that contains populations by zipcode. This dataset was pulled from [here](http://blog.splitwise.com/2013/09/18/the-2010-us-census-population-by-zip-code-totally-free/). The map show ratios of *(population for county x)/(number of type x doctors)* for each county. I thought this was a better representation of whats trying to be conveyed. 

References:

http://bl.ocks.org/mbostock/4060606

http://bl.ocks.org/mbostock/3885304

Several other blogs that I didn't keep track of


