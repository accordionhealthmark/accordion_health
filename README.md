**NPI D3 Visualaztions**

The original data set was cleaned using [csvkit](https://csvkit.readthedocs.org/en/0.9.1/). The cleaned csv was too large to upload so it's not in this repo. I can send it over upon request.

Following this clean, I used [pandas](http://pandas.pydata.org/) to create JSON data for the D3 visualizations. In order to create a 
counties US maps I found a JSON file with FIPS to Zipcode mappings [here](http://mavericklee.com/assets/data/FIPS_to_ZIPS.json). This mapping
was not as precise as I would of liked. This is why the US maps have counties that are missing data. One other thing to note with the visualizations is
the fact that the reporting of provider credentials is inconsistent. Therefore this bar plot is not accurate and has repeated categories.
May deal with this better in the future. Right now, I just wanted get something up and going for you all to see. 

Still need to write docs for the D3 code. Will hopefully have time to do that before tomorrow night.

References:
http://bl.ocks.org/mbostock/4060606
http://bl.ocks.org/mbostock/3885304
Several other blogs that I didn't keep track of

