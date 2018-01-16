#!/usr/bin/env python
# @Author: David Haas

from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
from bson import json_util
import config as cfg

app = Flask(__name__, static_folder='static')


@app.route('/')
def index():
    return render_template('index.html')


# load data into json
@app.route('/timeuse/' + cfg.COLL_NAME)
def dataset():
    dbs = MongoClient(cfg.MONGO_HOST, cfg.MONGO_PORT)
    coll = dbs[cfg.DB_NAME][cfg.COLL_NAME]
    data = coll.find(projection=cfg.FIELDS)
    json_data = []
    for entry in data:
        if entry[u'countrya'] not in cfg.EXCLUDED:
            json_data.append(entry)
    json_data = json.dumps(json_data, default=json_util.default)
    dbs.close()
    return json_data


if __name__ == '__main__':
    app.run(host=cfg.APP_HOST, port=cfg.APP_PORT, debug=True)
