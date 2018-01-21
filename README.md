
# Timeuse Datavisualisation

![](https://i.imgur.com/SUYZb5L.gif)

This application visualizes the MTUS-adult-aggregate.csv file from [The Centre For Time Use Research](https://timeuse.org/)
Skimming over their [Multinational Time Use Study Documentation](https://www.timeuse.org/sites/default/files/9727/mtus-user-guide-r9-february-2016.pdf) is recommended
### Requirements
- Python 2.7
- mongodb
- pip
---
## How to set it up
Install the necessary requirements

    $ pip install -r requirements.txt

Import your csv file into mongo change collection_name and filepath accordingly

    $ mongoimport -d timeuse -c collection_name --type csv --file filepath --headerline
i.e

    $ mongoimport -d timeuse -c france --type csv --file MTUS/france.csv --headerline
I'm working with just one csv like this:

    $ mongoimport -d timeuse -c all --type csv --file MTUS/all.csv --headerline

## How to start your application

    $ python app.py collection_name optional_heatmap optional_grouped_activities
    
Only the collection_name is required, the other 2 parameters are optional, by default they are set to 1
If you want to improve performance (does not affect initial loading time) you can set them to 0 so the heatmap and grouped_activities won't get rendered.

    $ python app.py all 0 0
The application can now be accessed at [localhost:8080](http://localhost:8080)

---

[**Read the Wiki**](https://github.com/Sonnenstrahl/datavis/wiki)

---
