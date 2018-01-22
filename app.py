#!/usr/bin/env python
# @Author: David Haas

from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
from bson import json_util
import config as cfg
import sys

app = Flask(__name__, static_folder='static')

try:
    arg = sys.argv[1]
except IndexError:
    print 'Please supply a collection to work with'
    print 'i.e. python app.py collection_name'
    sys.exit(1)


@app.route('/')
def index():
    return render_template('index.html')


# load data into json and serve it on route
@app.route('/timeuse/data')
def dataset():
    dbs = MongoClient(cfg.MONGO_HOST, cfg.MONGO_PORT)
    coll = dbs[cfg.DB_NAME][sys.argv[1]]
    data = coll.find(projection=cfg.FIELDS)
    json_data = []
    # 'u because pymongo returns data in unicode
    for entry in data:
        if entry[u'countrya'] in cfg.INCLUDED:
            all_activities = [entry[u'main1'], entry[u'main2'], entry[u'main3'], entry[u'main4'], entry[u'main5'],
                              entry[u'main6'], entry[u'main7'], entry[u'main8'], entry[u'main9'], entry[u'main10'],
                              entry[u'main11'], entry[u'main12'], entry[u'main13'],
                              entry[u'main14'], entry[u'main15'], entry[u'main16'], entry[u'main17'], entry[u'main18'],
                              entry[u'main19'], entry[u'main20'], entry[u'main21'], entry[u'main22'], entry[u'main23'],
                              entry[u'main24'], entry[u'main25'], entry[u'main26'],
                              entry[u'main27'], entry[u'main28'], entry[u'main29'], entry[u'main30'], entry[u'main31'],
                              entry[u'main32'], entry[u'main33'], entry[u'main34'], entry[u'main35'], entry[u'main36'],
                              entry[u'main37'], entry[u'main38'], entry[u'main39'],
                              entry[u'main40'], entry[u'main41'], entry[u'main42'], entry[u'main43'], entry[u'main44'],
                              entry[u'main45'], entry[u'main46'], entry[u'main47'], entry[u'main48'], entry[u'main49'],
                              entry[u'main50'], entry[u'main51'], entry[u'main52'],
                              entry[u'main53'], entry[u'main54'], entry[u'main55'], entry[u'main56'], entry[u'main57'],
                              entry[u'main58'], entry[u'main59'], entry[u'main60'], entry[u'main61'], entry[u'main62'],
                              entry[u'main63'], entry[u'main64'], entry[u'main65'],
                              entry[u'main66'], entry[u'main67'], entry[u'main68'], entry[u'main69']]
            # Clean all the activities, replacing negative values with 0, else the average can't be calculated correctly
            caa = []
            for i in all_activities:
                if i < 0:
                    caa.append(0)
                else:
                    caa.append(i)
            entry[u'main'] = caa
            # Create Grouped Activities
            entry[u'gAct'] = [caa[68], caa[10] + caa[62] + caa[63], caa[61] + caa[64] + caa[65] + caa[66] + caa[67],
                              caa[4] + caa[5],
                              caa[6] + caa[7] + caa[8] + caa[9] + caa[11] + caa[12] + caa[13] + caa[14] + caa[15] + caa[
                                  16] + caa[32],
                              caa[33] + caa[34] + caa[35] + caa[36] + caa[37] + caa[38] + caa[39] + caa[40] + caa[41] +
                              caa[42] +
                              caa[43] + caa[44] + caa[45] + caa[46] + caa[47] + caa[48] + caa[49] + caa[50] +
                              caa[51] + caa[52] + caa[53] + caa[54] + caa[55] + caa[56] + caa[57] + caa[58] + caa[59] +
                              caa[60],
                              caa[0] + caa[3] + caa[17] + caa[18] + caa[19] + caa[20] + caa[21] + caa[22] + caa[23] +
                              caa[24] + caa[25]
                              + caa[26] + caa[27] + caa[28] + caa[29] + caa[30] + caa[31], caa[1] + caa[2]]
            json_data.append(entry)
    json_data = json.dumps(json_data, default=json_util.default)
    dbs.close()
    return json_data


# parse console args and serve on route
@app.route('/timeuse/params')
def params():
    json_data = []
    obj = {'heatmap': 0, 'groupedActivities': 0}
    try:
        obj['heatmap'] = sys.argv[2]
    except IndexError:
        obj['heatmap'] = 1
    try:
        obj['groupedActivities'] = sys.argv[3]
    except IndexError:
        obj['groupedActivities'] = 1

    json_data.append(obj)
    json_data = json.dumps(json_data, default=json_util.default)
    return json_data


# 404 page
@app.errorhandler(404)
def not_found(e):
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(host=cfg.APP_HOST, port=cfg.APP_PORT, debug=True)
