# @Author: David Haas
# exports json
from pymongo import MongoClient
import json
from bson import json_util
import config as cfg
import sys
import csv

dbs = MongoClient(cfg.MONGO_HOST, cfg.MONGO_PORT)
coll = dbs[cfg.DB_NAME][sys.argv[1]]
data = coll.find(projection=cfg.FIELDS)
json_data = []
# 'u because pymongo returns data in unicode
# Cleaning the data
for entry in data:
    if entry[u'countrya'] in cfg.INCLUDED:
        # Object instead of array, dc.js quicksort performance reacts a lot better to objects
        all_activities = {1: entry[u'main1'], 2: entry[u'main2'], 3: entry[u'main3'], 4: entry[u'main4'],
                          5: entry[u'main5'],
                          6: entry[u'main6'], 7: entry[u'main7'], 8: entry[u'main8'], 9: entry[u'main9'],
                          10: entry[u'main10'],
                          11: entry[u'main11'], 12: entry[u'main12'], 13: entry[u'main13'],
                          14: entry[u'main14'], 15: entry[u'main15'], 16: entry[u'main16'], 17: entry[u'main17'],
                          18: entry[u'main18'],
                          19: entry[u'main19'], 20: entry[u'main20'], 21: entry[u'main21'], 22: entry[u'main22'],
                          23: entry[u'main23'],
                          24: entry[u'main24'], 25: entry[u'main25'], 26: entry[u'main26'],
                          27: entry[u'main27'], 28: entry[u'main28'], 29: entry[u'main29'], 30: entry[u'main30'],
                          31: entry[u'main31'],
                          32: entry[u'main32'], 33: entry[u'main33'], 34: entry[u'main34'], 35: entry[u'main35'],
                          36: entry[u'main36'],
                          37: entry[u'main37'], 38: entry[u'main38'], 39: entry[u'main39'],
                          40: entry[u'main40'], 41: entry[u'main41'], 42: entry[u'main42'], 43: entry[u'main43'],
                          44: entry[u'main44'],
                          45: entry[u'main45'], 46: entry[u'main46'], 47: entry[u'main47'], 48: entry[u'main48'],
                          49: entry[u'main49'],
                          50: entry[u'main50'], 51: entry[u'main51'], 52: entry[u'main52'],
                          53: entry[u'main53'], 54: entry[u'main54'], 55: entry[u'main55'], 56: entry[u'main56'],
                          57: entry[u'main57'],
                          58: entry[u'main58'], 59: entry[u'main59'], 60: entry[u'main60'], 61: entry[u'main61'],
                          62: entry[u'main62'],
                          63: entry[u'main63'], 64: entry[u'main64'], 65: entry[u'main65'],
                          66: entry[u'main66'], 67: entry[u'main67'], 68: entry[u'main68'], 69: entry[u'main69']}
        # Clean all the activities, replacing negative values with 0, else the average can't be calculated correctly
        caa = {}
        for i in all_activities:
            if all_activities[i] < 0:
                caa[i] = 0
            else:
                caa[i] = all_activities[i]
        entry[u'main'] = caa
        # Create Grouped Activities
        g_0 = caa[69]
        g_1 = caa[11] + caa[63] + caa[64]
        g_2 = caa[62] + caa[65] + caa[66] + caa[67] + caa[68]
        g_3 = caa[5] + caa[6]
        g_4 = caa[7] + caa[8] + caa[9] + caa[10] + caa[12] + caa[13] + caa[14] + caa[15] + caa[16] + caa[17] + caa[
            33]
        g_5 = caa[34] + caa[35] + caa[36] + caa[37] + caa[38] + caa[39] + caa[40] + caa[41] + caa[42] + caa[43] + \
              caa[44] + caa[45] + caa[46] + caa[47] + caa[48] + caa[49] + caa[50] + caa[51] + caa[52] + caa[53] + \
              caa[54] + caa[55] + caa[56] + caa[57] + caa[58] + caa[59] + caa[60] + caa[61]
        g_6 = caa[1] + caa[4] + caa[18] + caa[19] + caa[20] + caa[21] + caa[22] + caa[23] + caa[24] + caa[25] + caa[
            26] + caa[27] + caa[28] + caa[29] + caa[30] + caa[31] + caa[32]
        g_7 = caa[2] + caa[3]
        entry[u'gAct'] = {0: g_0, 1: g_1, 2: g_2, 3: g_3, 4: g_4, 5: g_5, 6: g_6, 7: g_7}

        del entry[u'main1']
        del entry[u'main2']
        del entry[u'main3']
        del entry[u'main4']
        del entry[u'main5']
        del entry[u'main6']
        del entry[u'main7']
        del entry[u'main8']
        del entry[u'main9']
        del entry[u'main10']
        del entry[u'main11']
        del entry[u'main12']
        del entry[u'main13']
        del entry[u'main14']
        del entry[u'main15']
        del entry[u'main16']
        del entry[u'main17']
        del entry[u'main18']
        del entry[u'main19']
        del entry[u'main20']
        del entry[u'main21']
        del entry[u'main22']
        del entry[u'main23']
        del entry[u'main24']
        del entry[u'main25']
        del entry[u'main26']
        del entry[u'main27']
        del entry[u'main28']
        del entry[u'main29']
        del entry[u'main30']
        del entry[u'main31']
        del entry[u'main32']
        del entry[u'main33']
        del entry[u'main34']
        del entry[u'main35']
        del entry[u'main36']
        del entry[u'main37']
        del entry[u'main38']
        del entry[u'main39']
        del entry[u'main40']
        del entry[u'main41']
        del entry[u'main42']
        del entry[u'main43']
        del entry[u'main44']
        del entry[u'main45']
        del entry[u'main46']
        del entry[u'main47']
        del entry[u'main48']
        del entry[u'main49']
        del entry[u'main50']
        del entry[u'main51']
        del entry[u'main52']
        del entry[u'main53']
        del entry[u'main54']
        del entry[u'main55']
        del entry[u'main56']
        del entry[u'main57']
        del entry[u'main58']
        del entry[u'main59']
        del entry[u'main60']
        del entry[u'main61']
        del entry[u'main62']
        del entry[u'main63']
        del entry[u'main64']
        del entry[u'main65']
        del entry[u'main66']
        del entry[u'main67']
        del entry[u'main68']
        del entry[u'main69']

        json_data.append(entry)
json_data = json.dumps(json_data, default=json_util.default)
dbs.close()

with open('static/js/data.json', 'w') as outfile:
    outfile.write(json_data)
# with open('static/js/data.csv','w') as f:
#     wr = csv.writer(f,delimiter=',',quoting=csv.QUOTE_ALL)
#     wr.writerow(json_data)
