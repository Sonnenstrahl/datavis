/*
    @Author: David Haas
 */
//Javascript is async, use of queue ensures that Data is fully loaded before dc.js starts building charts
queue()
    .defer(d3.json, 'timeuse/temp')
    .defer(d3.json, 'static/js/lib/custom.geo.json')
    .await(buildVisualisation);

/*
    TODO
    Czech slovakia etc.
 */
var countrya = {
    1: 'Armenia',
    2: 'Australia',
    3: 'Austria',
    4: 'Belgium',
    5: 'Brazil',
    6: 'Bulgaria',
    7: 'Canada',
    8: 'China',
    9: 'Denmark',
    10: 'Estonia',
    11: 'Finland',
    12: 'France',
    13: 'Germany',
    14: 'Hungary',
    15: 'India',
    16: 'Ireland',
    17: 'Isreal',
    18: 'Italy',
    19: 'Japan',
    20: 'Latvia',
    21: 'Lithuania',
    22: 'Netherlands',
    23: 'New Zealand',
    24: 'Norway',
    25: 'Pakistan',
    26: 'Poland',
    27: 'Portugal',
    28: 'Republic of Korea',
    29: 'Romania',
    30: 'Serbia',
    31: 'Slovakia',
    32: 'Slovenia',
    33: 'South Africa',
    34: 'Spain',
    35: 'Sweden',
    36: 'Turkey',
    37: 'United Kingdom',
    38: 'United States'
};
var day = {
    1: 'Sunday',
    2: 'Monday',
    3: 'Tuesday',
    4: 'Wednesday',
    5: 'Thursday',
    6: 'Friday',
    7: 'Saturday',
    8: 'Averaged time across Week',
    9: 'Unspecified weekday',
    10: 'Unspecified weekend day'
};
var occup = {
    1: 'Management',
    2: 'Finance and legal',
    3: 'Science and engineering',
    4: 'Civil and social service',
    5: 'Education and social science',
    6: 'Medical',
    7: 'Other professionals',
    8: 'Health, education, and social care support',
    9: 'Clerical and office support',
    10: 'Security and armed forces',
    11: 'Sales, services, creative support, cleaning',
    12: 'Farming, forestry, fishing',
    13: 'Construction, assembly&repair, moving goods, transport,extraction',
    14: 'self employed non-professionals',
    15: 'Others/Undefined'
};
var computer = {
    0: 'No',
    1: 'Yes'
};
var sex = {
    1: 'Male',
    2: 'Female'
};
var student = {
    0: 'Not a student',
    1: 'Student'
};
var retired = {
    0: 'Not retired',
    1: 'Retired'
};
var vehicle = {
    0: 'No',
    1: 'Animal only',
    2: 'Non-motorised vehicle',
    3: '1 car or motorcycle',
    4: '2+ cars or motorcycles'
};
var sector = {
    1: 'Public Sector',
    2: 'Private Sector'
};

function buildVisualisation(error, json, geoJson) {
    console.log(error);
    var cleanData = json;

    cleanData.forEach(function (d) {
        //Assign Text to the Weekday
        d['day'] = day[d['day']];
        //Assign Countrynames, required for the GeoJson of the chloropleth Map
        d['countrya'] = countrya[d['countrya']];
        //Create an array with all activities, this is required for the Heatmap
        d['main'] = [d['main1'], d['main2'], d['main3'], d['main4'], d['main5'], d['main6'], d['main7'], d['main8'], d['main9'], d['main10'], d['main11'], d['main12'], d['main13'],
            d['main14'], d['main15'], d['main16'], d['main17'], d['main18'], d['main19'], d['main20'], d['main21'], d['main22'], d['main23'], d['main24'], d['main25'], d['main26'],
            d['main27'], d['main28'], d['main29'], d['main30'], d['main31'], d['main32'], d['main33'], d['main34'], d['main35'], d['main36'], d['main37'], d['main38'], d['main39'],
            d['main40'], d['main41'], d['main42'], d['main43'], d['main44'], d['main45'], d['main46'], d['main47'], d['main48'], d['main49'], d['main50'], d['main51'], d['main52'],
            d['main53'], d['main54'], d['main55'], d['main56'], d['main57'], d['main58'], d['main59'], d['main60'], d['main61'], d['main62'], d['main63'], d['main64'], d['main65'],
            d['main66'], d['main67'], d['main68'], d['main69']];
        //Convert Occupation into Text
        if (d['occup'] in occup) {
            d['occupFix'] = occup[d['occup']];
        }
        else d['occupFix'] = occup[15];
        //Combine Ages into Bins, CF bins work but do not filter correctly.
        if (d['age']) {
            if (d['age'] < 20) {
                d['ageFix'] = 18;
            }
            else d['ageFix'] = Math.floor(d['age'] / 10) * 10;
        }
        else d['ageFix'] = 0;
        //Combine Workhours into Bins
        if(d['workhrs']>0){
            d['workhrsBin'] = Math.floor(d['workhrs'] / 20) * 20;
        }
        else if (d['workhrs']<0){
            d['workhrsBin'] = 'undefined';
        }
        else d['workhrsBin'] = 0;
    });

    //Create A Crossfilter
    var ndx = crossfilter(cleanData);
    //Show Total Amount of Records that are being filtered
    var all = ndx.groupAll();

    //Heatmap
    var heatDim = ndx.dimension(function (d) {
        return [d['day'], d['main']];
    });
    var heatGroup = heatDim.groupAll().reduce(reduceAdd, reduceRemove, reduceInitial).value();

    /*
        Custom reduce functions, to work with arrays, activities are converted into the following:
        [day,activity]: value
        for example: ['Monday','main1']: 10
     */
    function reduceAdd(p, v) {
        v['main'].forEach(function (val, index) {
            if (val > 0) {
                //+1 since Activity 0 is not a thing, but the first index of the array is 0
                var temp_array = [v['day'], index + 1];
                p[temp_array].push(val);
            }
        });
        return p;
    }

    function reduceRemove(p, v) {
        v['main'].forEach(function (val, index) {
            if (val > 0) {
                var temp_array = [v['day'], index + 1];
                var indx = p[temp_array].indexOf(val);
                p[temp_array] = p[temp_array].splice(indx,1);
        }
        });
        return p;
    }

    function reduceInitial() {
        return {
            'Friday,1':[],
            'Friday,2':[],
            'Friday,3':[],
            'Friday,4':[],
            'Friday,5':[],
            'Friday,6':[],
            'Friday,7':[],
            'Friday,8':[],
            'Friday,9':[],
            'Friday,10':[],
            'Friday,11':[],
            'Friday,12':[],
            'Friday,13':[],
            'Friday,14':[],
            'Friday,15':[],
            'Friday,16':[],
            'Friday,17':[],
            'Friday,18':[],
            'Friday,19':[],
            'Friday,20':[],
            'Friday,21':[],
            'Friday,22':[],
            'Friday,23':[],
            'Friday,24':[],
            'Friday,25':[],
            'Friday,26':[],
            'Friday,27':[],
            'Friday,28':[],
            'Friday,29':[],
            'Friday,30':[],
            'Friday,31':[],
            'Friday,32':[],
            'Friday,33':[],
            'Friday,34':[],
            'Friday,35':[],
            'Friday,36':[],
            'Friday,37':[],
            'Friday,38':[],
            'Friday,39':[],
            'Friday,40':[],
            'Friday,41':[],
            'Friday,42':[],
            'Friday,43':[],
            'Friday,44':[],
            'Friday,45':[],
            'Friday,46':[],
            'Friday,47':[],
            'Friday,48':[],
            'Friday,49':[],
            'Friday,50':[],
            'Friday,51':[],
            'Friday,52':[],
            'Friday,53':[],
            'Friday,54':[],
            'Friday,55':[],
            'Friday,56':[],
            'Friday,57':[],
            'Friday,58':[],
            'Friday,59':[],
            'Friday,60':[],
            'Friday,61':[],
            'Friday,62':[],
            'Friday,63':[],
            'Friday,64':[],
            'Friday,65':[],
            'Friday,66':[],
            'Friday,67':[],
            'Friday,68':[],
            'Friday,69':[],
            'Monday,1':[],
            'Monday,2':[],
            'Monday,3':[],
            'Monday,4':[],
            'Monday,5':[],
            'Monday,6':[],
            'Monday,7':[],
            'Monday,8':[],
            'Monday,9':[],
            'Monday,10':[],
            'Monday,11':[],
            'Monday,12':[],
            'Monday,13':[],
            'Monday,14':[],
            'Monday,15':[],
            'Monday,16':[],
            'Monday,17':[],
            'Monday,18':[],
            'Monday,19':[],
            'Monday,20':[],
            'Monday,21':[],
            'Monday,22':[],
            'Monday,23':[],
            'Monday,24':[],
            'Monday,25':[],
            'Monday,26':[],
            'Monday,27':[],
            'Monday,28':[],
            'Monday,29':[],
            'Monday,30':[],
            'Monday,31':[],
            'Monday,32':[],
            'Monday,33':[],
            'Monday,34':[],
            'Monday,35':[],
            'Monday,36':[],
            'Monday,37':[],
            'Monday,38':[],
            'Monday,39':[],
            'Monday,40':[],
            'Monday,41':[],
            'Monday,42':[],
            'Monday,43':[],
            'Monday,44':[],
            'Monday,45':[],
            'Monday,46':[],
            'Monday,47':[],
            'Monday,48':[],
            'Monday,49':[],
            'Monday,50':[],
            'Monday,51':[],
            'Monday,52':[],
            'Monday,53':[],
            'Monday,54':[],
            'Monday,55':[],
            'Monday,56':[],
            'Monday,57':[],
            'Monday,58':[],
            'Monday,59':[],
            'Monday,60':[],
            'Monday,61':[],
            'Monday,62':[],
            'Monday,63':[],
            'Monday,64':[],
            'Monday,65':[],
            'Monday,66':[],
            'Monday,67':[],
            'Monday,68':[],
            'Monday,69':[],
            'Tuesday,1':[],
            'Tuesday,2':[],
            'Tuesday,3':[],
            'Tuesday,4':[],
            'Tuesday,5':[],
            'Tuesday,6':[],
            'Tuesday,7':[],
            'Tuesday,8':[],
            'Tuesday,9':[],
            'Tuesday,10':[],
            'Tuesday,11':[],
            'Tuesday,12':[],
            'Tuesday,13':[],
            'Tuesday,14':[],
            'Tuesday,15':[],
            'Tuesday,16':[],
            'Tuesday,17':[],
            'Tuesday,18':[],
            'Tuesday,19':[],
            'Tuesday,20':[],
            'Tuesday,21':[],
            'Tuesday,22':[],
            'Tuesday,23':[],
            'Tuesday,24':[],
            'Tuesday,25':[],
            'Tuesday,26':[],
            'Tuesday,27':[],
            'Tuesday,28':[],
            'Tuesday,29':[],
            'Tuesday,30':[],
            'Tuesday,31':[],
            'Tuesday,32':[],
            'Tuesday,33':[],
            'Tuesday,34':[],
            'Tuesday,35':[],
            'Tuesday,36':[],
            'Tuesday,37':[],
            'Tuesday,38':[],
            'Tuesday,39':[],
            'Tuesday,40':[],
            'Tuesday,41':[],
            'Tuesday,42':[],
            'Tuesday,43':[],
            'Tuesday,44':[],
            'Tuesday,45':[],
            'Tuesday,46':[],
            'Tuesday,47':[],
            'Tuesday,48':[],
            'Tuesday,49':[],
            'Tuesday,50':[],
            'Tuesday,51':[],
            'Tuesday,52':[],
            'Tuesday,53':[],
            'Tuesday,54':[],
            'Tuesday,55':[],
            'Tuesday,56':[],
            'Tuesday,57':[],
            'Tuesday,58':[],
            'Tuesday,59':[],
            'Tuesday,60':[],
            'Tuesday,61':[],
            'Tuesday,62':[],
            'Tuesday,63':[],
            'Tuesday,64':[],
            'Tuesday,65':[],
            'Tuesday,66':[],
            'Tuesday,67':[],
            'Tuesday,68':[],
            'Tuesday,69':[],
            'Wednesday,1':[],
            'Wednesday,2':[],
            'Wednesday,3':[],
            'Wednesday,4':[],
            'Wednesday,5':[],
            'Wednesday,6':[],
            'Wednesday,7':[],
            'Wednesday,8':[],
            'Wednesday,9':[],
            'Wednesday,10':[],
            'Wednesday,11':[],
            'Wednesday,12':[],
            'Wednesday,13':[],
            'Wednesday,14':[],
            'Wednesday,15':[],
            'Wednesday,16':[],
            'Wednesday,17':[],
            'Wednesday,18':[],
            'Wednesday,19':[],
            'Wednesday,20':[],
            'Wednesday,21':[],
            'Wednesday,22':[],
            'Wednesday,23':[],
            'Wednesday,24':[],
            'Wednesday,25':[],
            'Wednesday,26':[],
            'Wednesday,27':[],
            'Wednesday,28':[],
            'Wednesday,29':[],
            'Wednesday,30':[],
            'Wednesday,31':[],
            'Wednesday,32':[],
            'Wednesday,33':[],
            'Wednesday,34':[],
            'Wednesday,35':[],
            'Wednesday,36':[],
            'Wednesday,37':[],
            'Wednesday,38':[],
            'Wednesday,39':[],
            'Wednesday,40':[],
            'Wednesday,41':[],
            'Wednesday,42':[],
            'Wednesday,43':[],
            'Wednesday,44':[],
            'Wednesday,45':[],
            'Wednesday,46':[],
            'Wednesday,47':[],
            'Wednesday,48':[],
            'Wednesday,49':[],
            'Wednesday,50':[],
            'Wednesday,51':[],
            'Wednesday,52':[],
            'Wednesday,53':[],
            'Wednesday,54':[],
            'Wednesday,55':[],
            'Wednesday,56':[],
            'Wednesday,57':[],
            'Wednesday,58':[],
            'Wednesday,59':[],
            'Wednesday,60':[],
            'Wednesday,61':[],
            'Wednesday,62':[],
            'Wednesday,63':[],
            'Wednesday,64':[],
            'Wednesday,65':[],
            'Wednesday,66':[],
            'Wednesday,67':[],
            'Wednesday,68':[],
            'Wednesday,69':[],
            'Thursday,1':[],
            'Thursday,2':[],
            'Thursday,3':[],
            'Thursday,4':[],
            'Thursday,5':[],
            'Thursday,6':[],
            'Thursday,7':[],
            'Thursday,8':[],
            'Thursday,9':[],
            'Thursday,10':[],
            'Thursday,11':[],
            'Thursday,12':[],
            'Thursday,13':[],
            'Thursday,14':[],
            'Thursday,15':[],
            'Thursday,16':[],
            'Thursday,17':[],
            'Thursday,18':[],
            'Thursday,19':[],
            'Thursday,20':[],
            'Thursday,21':[],
            'Thursday,22':[],
            'Thursday,23':[],
            'Thursday,24':[],
            'Thursday,25':[],
            'Thursday,26':[],
            'Thursday,27':[],
            'Thursday,28':[],
            'Thursday,29':[],
            'Thursday,30':[],
            'Thursday,31':[],
            'Thursday,32':[],
            'Thursday,33':[],
            'Thursday,34':[],
            'Thursday,35':[],
            'Thursday,36':[],
            'Thursday,37':[],
            'Thursday,38':[],
            'Thursday,39':[],
            'Thursday,40':[],
            'Thursday,41':[],
            'Thursday,42':[],
            'Thursday,43':[],
            'Thursday,44':[],
            'Thursday,45':[],
            'Thursday,46':[],
            'Thursday,47':[],
            'Thursday,48':[],
            'Thursday,49':[],
            'Thursday,50':[],
            'Thursday,51':[],
            'Thursday,52':[],
            'Thursday,53':[],
            'Thursday,54':[],
            'Thursday,55':[],
            'Thursday,56':[],
            'Thursday,57':[],
            'Thursday,58':[],
            'Thursday,59':[],
            'Thursday,60':[],
            'Thursday,61':[],
            'Thursday,62':[],
            'Thursday,63':[],
            'Thursday,64':[],
            'Thursday,65':[],
            'Thursday,66':[],
            'Thursday,67':[],
            'Thursday,68':[],
            'Thursday,69':[],
            'Saturday,1':[],
            'Saturday,2':[],
            'Saturday,3':[],
            'Saturday,4':[],
            'Saturday,5':[],
            'Saturday,6':[],
            'Saturday,7':[],
            'Saturday,8':[],
            'Saturday,9':[],
            'Saturday,10':[],
            'Saturday,11':[],
            'Saturday,12':[],
            'Saturday,13':[],
            'Saturday,14':[],
            'Saturday,15':[],
            'Saturday,16':[],
            'Saturday,17':[],
            'Saturday,18':[],
            'Saturday,19':[],
            'Saturday,20':[],
            'Saturday,21':[],
            'Saturday,22':[],
            'Saturday,23':[],
            'Saturday,24':[],
            'Saturday,25':[],
            'Saturday,26':[],
            'Saturday,27':[],
            'Saturday,28':[],
            'Saturday,29':[],
            'Saturday,30':[],
            'Saturday,31':[],
            'Saturday,32':[],
            'Saturday,33':[],
            'Saturday,34':[],
            'Saturday,35':[],
            'Saturday,36':[],
            'Saturday,37':[],
            'Saturday,38':[],
            'Saturday,39':[],
            'Saturday,40':[],
            'Saturday,41':[],
            'Saturday,42':[],
            'Saturday,43':[],
            'Saturday,44':[],
            'Saturday,45':[],
            'Saturday,46':[],
            'Saturday,47':[],
            'Saturday,48':[],
            'Saturday,49':[],
            'Saturday,50':[],
            'Saturday,51':[],
            'Saturday,52':[],
            'Saturday,53':[],
            'Saturday,54':[],
            'Saturday,55':[],
            'Saturday,56':[],
            'Saturday,57':[],
            'Saturday,58':[],
            'Saturday,59':[],
            'Saturday,60':[],
            'Saturday,61':[],
            'Saturday,62':[],
            'Saturday,63':[],
            'Saturday,64':[],
            'Saturday,65':[],
            'Saturday,66':[],
            'Saturday,67':[],
            'Saturday,68':[],
            'Saturday,69':[],
            'Sunday,1':[],
            'Sunday,2':[],
            'Sunday,3':[],
            'Sunday,4':[],
            'Sunday,5':[],
            'Sunday,6':[],
            'Sunday,7':[],
            'Sunday,8':[],
            'Sunday,9':[],
            'Sunday,10':[],
            'Sunday,11':[],
            'Sunday,12':[],
            'Sunday,13':[],
            'Sunday,14':[],
            'Sunday,15':[],
            'Sunday,16':[],
            'Sunday,17':[],
            'Sunday,18':[],
            'Sunday,19':[],
            'Sunday,20':[],
            'Sunday,21':[],
            'Sunday,22':[],
            'Sunday,23':[],
            'Sunday,24':[],
            'Sunday,25':[],
            'Sunday,26':[],
            'Sunday,27':[],
            'Sunday,28':[],
            'Sunday,29':[],
            'Sunday,30':[],
            'Sunday,31':[],
            'Sunday,32':[],
            'Sunday,33':[],
            'Sunday,34':[],
            'Sunday,35':[],
            'Sunday,36':[],
            'Sunday,37':[],
            'Sunday,38':[],
            'Sunday,39':[],
            'Sunday,40':[],
            'Sunday,41':[],
            'Sunday,42':[],
            'Sunday,43':[],
            'Sunday,44':[],
            'Sunday,45':[],
            'Sunday,46':[],
            'Sunday,47':[],
            'Sunday,48':[],
            'Sunday,49':[],
            'Sunday,50':[],
            'Sunday,51':[],
            'Sunday,52':[],
            'Sunday,53':[],
            'Sunday,54':[],
            'Sunday,55':[],
            'Sunday,56':[],
            'Sunday,57':[],
            'Sunday,58':[],
            'Sunday,59':[],
            'Sunday,60':[],
            'Sunday,61':[],
            'Sunday,62':[],
            'Sunday,63':[],
            'Sunday,64':[],
            'Sunday,65':[],
            'Sunday,66':[],
            'Sunday,67':[],
            'Sunday,68':[],
            'Sunday,69':[]
        };
    }

    heatGroup.all = function () {
        var newObject = [];
        for (var key in this) {
            if (this.hasOwnProperty(key) && key != "all" && key != "top") {
                var temp_array=[key.substring(0,key.indexOf(",")),key.substring(key.indexOf(",")+1)];
                var max = this[temp_array].reduce(function(a,b){
                    return Math.max(a,b);
                });
                var sum = this[temp_array].reduce(function(a,b){
                    return a+b;
                });
                var avg = Math.round(sum/this[temp_array].length);
                newObject.push({
                    key: temp_array,
                    max: max,
                    avg: avg,
                    sum: sum
                    });
                }
            }
        return newObject;
    };

    //TimeChart
    var years = ndx.dimension(function (d) {
        return d['year'];
    });
    var recordsByYear = years.group();
    //Calculate the Year Span
    var firstYear = years.bottom(1)[0]['year'];
    var lastYear = years.top(1)[0]['year'];

    //Day of the Week
    var days = ndx.dimension(function (d) {
        return d['day'];
    });
    var recordsByDay = days.group();

    //Chloropleth Map
    var countries = ndx.dimension(function (d) {
        return d['countrya']
    });
    var recordsByCountry = countries.group();
    var countryMax = recordsByCountry.top(1)[0].value;

    //Occupation Pie Chart
    var occupation = ndx.dimension(function (d) {
        return d['occupFix']
    });
    var occupationGrouped = occupation.group();

    //Age Distribution
    var age = ndx.dimension(function (d) {
        return d['ageFix'];
    });
    var ageGrouped = age.group();

    //Work Hours Distribution
    var workHrs = ndx.dimension(function (d) {
        return d['workhrsBin'];
    });
    var workHrsGrouped = workHrs.group();

    //DataTable
/*
    var tableDim = ndx.dimension(function (d) {
        return d['_id']['$oid']
    });
*/

    /*
        Select Menu
        These are all constructed in the same way
    */
    var sexDim = ndx.dimension(function (d) {
        return d['sex'];
    });
    var sexGrouped = sexDim.group();
    var badCase = ndx.dimension(function (d) {
        return d['badcase'];
    });
    var badCaseGrouped = badCase.group();
    var retiredDim = ndx.dimension(function (d) {
        return d['retired'];
    });
    var retiredGrouped = retiredDim.group();
    var studentDim = ndx.dimension(function (d) {
        return d['student'];
    });
    var studentGrouped = studentDim.group();
    var ownComputer = ndx.dimension(function (d) {
        return d['computer'];
    });
    var computerGrouped = ownComputer.group();
    var ownVehicle = ndx.dimension(function (d) {
        return d['vehicle'];
    });
    var ownVehicleGrouped = ownVehicle.group();
    var hhldsize = ndx.dimension(function (d) {
        return d['hhldsize'];
    });
    var hhldsizeGrouped = hhldsize.group();
    var sectorDim = ndx.dimension(function (d) {
        return d['sector'];
    });
    var sectorGrouped = sectorDim.group();

    //Charts HTML tags
    var totalRecords = dc.numberDisplay('#total-records');
    var timeChart = dc.barChart('#timeChart');
    var ageChart = dc.rowChart('#ageChart');
    var weekDay = dc.rowChart('#weekDay');
    var workHrsChart = dc.rowChart('#workhrs');
    var chloropleth = dc.geoChoroplethChart('#chloropleth');
    var occupationPie = dc.pieChart('#occupation-piechart');
    var heatMap = dc.heatMap('#heatmap');
    var selectSex = dc.selectMenu('#select-sex');
    var selectRetired = dc.selectMenu('#select-retired');
    var selectBadCase = dc.selectMenu('#select-bad-case');
    var selectStudent = dc.selectMenu('#select-student');
    var selectComputer = dc.selectMenu('#select-computer');
    var selectVehicle = dc.selectMenu('#select-vehicle');
    var selectHhldsize = dc.selectMenu('#select-hhldsize');
    var selectSector = dc.selectMenu('#select-sector');
   // var dataTable = dc.dataTable('#dataTable');

    heatMap
        .width(1500)
        .height(150)
        .dimension(heatDim)
        .group(heatGroup)
        .valueAccessor(function (d) {
            return d.key[0];
        })
        .keyAccessor(function (d) {
            return d.key[1];
        })
        .colorAccessor(function (d) {
            return d.avg;
        })
        //Disable on Click, since we can't sort due to our activity arrays (there is nothing to sort on)
        .boxOnClick(function (d) {
        })
        .rows(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
        .cols([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
            , 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69])
        .colors(d3.scale.linear().range(['white', 'darkblue']))
        .title(function (d) {
            return "Minutes Spent: " + (d.sum) + '\n' + 'Avg: ' + (d.avg);
        })
        .xBorderRadius(2)
        .yBorderRadius(2)
        .calculateColorDomain()
        .on('postRender', function () {
            $('.heatmap').attr('transform', 'translate(60,10)');
        });

    totalRecords
        .formatNumber(d3.format('d'))
        .valueAccessor(function (d) {
            return d;
        })
        .group(all);

    timeChart
        .width(500)
        .height(180)
        .margins({top: 10, right: 50, left: 80, bottom: 50})
        .dimension(years)
        .group(recordsByYear)
        .transitionDuration(200)
        .x(d3.scale.linear().domain([firstYear, lastYear + 1]))
        .elasticY(true)
        .centerBar(true)
        .xAxisLabel('Year')
        .yAxisLabel('Records')
        .yAxis().ticks(5);

    ageChart
        .width(300)
        .height(250)
        .dimension(age)
        .elasticX(true)
        .group(ageGrouped)
        .xAxis().ticks(4);

    workHrsChart
        .width(300)
        .height(250)
        .dimension(workHrs)
        .elasticX(true)
        .group(workHrsGrouped)
        .xAxis().ticks(4);

    weekDay
        .width(300)
        .height(250)
        .dimension(days)
        .group(recordsByDay)
        .gap(1)
        .ordering(function (d) {
            return -d.value
        })
        .elasticX(true)
        .xAxis().ticks(5);
    weekDay.on('postRender', function () {
        weekDay.svg().append('text').attr('class', 'x-axis-label').attr('text-anchor', 'middle').attr('x', weekDay.width() / 2).attr('y', weekDay.height())
            .text('Records');
    });

    chloropleth
        .width(700)
        .height(300)
        .dimension(countries)
        .group(recordsByCountry)
        .colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
        .colorDomain([0, countryMax])
        .overlayGeoJson(geoJson.features, 'name', function (d) {
            return d.properties.name;
        })
        .projection(d3.geo.mercator()
            .scale(400)
            .translate([350, 220])
            .center([20, 45]))
        .title(function (t) {
            return 'Country: ' + t['key'] + '\n' + 'Records: ' + t['value'];
        });

    occupationPie
        .width(250)
        .height(250)
        .externalRadiusPadding(10)
        .dimension(occupation)
        .group(occupationGrouped)
        .legend(dc.legend().x(250).y(0).gap(5))
        .selectAll('.dc-legend.item text')
        .text('').append('tspan').text(function (d) {
        return d.name;
    })
        .append('tspan')
        .attr('x', 100)
        .attr('text-anchor', 'end')
        .text(function (d) {
            return d.data;
        });

/*    dataTable
        .width(760)
        .height(400)
        .dimension(tableDim)
        .group(function (d) {
            return d['_id']['$oid']
        })
        .size(25)
        .showGroups(false)
        .columns([
            function (d) {
                return d['countrya'];
            },
            function (d) {
                return d['sex'];
            }]);*/

    selectSex
        .dimension(sexDim)
        .group(sexGrouped)
        .multiple(true)
        .controlsUseVisibility(true)
        .on('renderlet', function () {
            $('#select-sex option.dc-select-option').each(function () {
                var value = $(this).text();
                var valuesubstring = value.substring(0, value.indexOf(':'));
                if (sex[valuesubstring]) {
                    value = value.replace(valuesubstring, sex[valuesubstring]);
                    $(this).text(value);
                }
            });
        }).on('postRender', function () {
        $('#select-sex').prepend($('<div class="select-title">Sex</div>'));
    });
    selectRetired
        .dimension(retiredDim)
        .group(retiredGrouped)
        .multiple(true)
        .controlsUseVisibility(true)
        .on('renderlet', function () {
            $('#select-retired option.dc-select-option').each(function () {
                var value = $(this).text();
                var valuesubstring = value.substring(0, value.indexOf(':'));
                if (retired[valuesubstring]) {
                    value = value.replace(valuesubstring, retired[valuesubstring]);
                    $(this).text(value);
                }
            });
        }).on('postRender', function () {
        $('#select-retired').prepend($('<div class="select-title">Retired</div>'));
    });
    selectBadCase
        .dimension(badCase)
        .group(badCaseGrouped)
        .multiple(true)
        .controlsUseVisibility(true);
    selectStudent
        .dimension(studentDim)
        .group(studentGrouped)
        .order(function (a, b) {
            return a.key < b.key ? 1 : b.key < a.key ? -1 : 0;
        })
        .multiple(true)
        .controlsUseVisibility(true)
        .on('renderlet', function () {
            $('#select-student option.dc-select-option').each(function () {
                var value = $(this).text();
                var valuesubstring = value.substring(0, value.indexOf(':'));
                if (student[valuesubstring]) {
                    value = value.replace(valuesubstring, student[valuesubstring]);
                    $(this).text(value);
                }
            });
        }).on('postRender', function () {
        $('#select-student').prepend($('<div class="select-title">Student</div>'));
    });
    selectComputer
        .dimension(ownComputer)
        .group(computerGrouped)
        .order(function (a, b) {
            return a.key < b.key ? 1 : b.key < a.key ? -1 : 0;
        })
        .multiple(true)
        .controlsUseVisibility(true)
        .on('renderlet', function () {
            $('#select-computer option.dc-select-option').each(function () {
                var value = $(this).text();
                var substring1 = value.substring(0, value.indexOf(':'));
                var substring2 = value.substring(value.indexOf(':'));
                if (computer[substring1]) {
                    substring1 = computer[substring1];
                    $(this).text(substring1 + substring2);
                }
            });
        }).on('postRender', function () {
        $('#select-computer').prepend($('<div class="select-title">Computer</div>'));
    });
    selectVehicle
        .dimension(ownVehicle)
        .group(ownVehicleGrouped)
        .order(function (a, b) {
            return a.key < b.key ? 1 : b.key < a.key ? -1 : 0;
        })
        .multiple(true)
        .controlsUseVisibility(true)
        .on('renderlet', function () {
            $('#select-vehicle option.dc-select-option').each(function () {
                var value = $(this).text();
                var valuesubstring = value.substring(0, value.indexOf(':'));
                if (vehicle[valuesubstring]) {
                    value = value.replace(valuesubstring, vehicle[valuesubstring]);
                    $(this).text(value);
                }
            });
        }).on('postRender', function () {
        $('#select-vehicle').prepend($('<div class="select-title">Vehicle</div>'));
    });
    selectSector
        .dimension(sectorDim)
        .group(sectorGrouped)
        .order(function (a, b) {
            return a.key < b.key ? 1 : b.key < a.key ? -1 : 0;
        })
        .multiple(true)
        .controlsUseVisibility(true)
        .on('renderlet', function () {
            $('#select-sector option.dc-select-option').each(function () {
                var value = $(this).text();
                var valuesubstring = value.substring(0, value.indexOf(':'));
                if (vehicle[valuesubstring]) {
                    value = value.replace(valuesubstring, sector[valuesubstring]);
                    $(this).text(value);
                }
            });
        }).on('postRender', function () {
        $('#select-sector').prepend($('<div class="select-title">Sector</div>'));
    });
    selectHhldsize
        .dimension(hhldsize)
        .group(hhldsizeGrouped)
        .multiple(true)
        .controlsUseVisibility(true).on('postRender', function () {
        $('#select-hhldsize').prepend($('<div class="select-title">Hhold Size</div>'));
    });

    //Create Tooltip for Badcase (refer to page 29 of the MTUS user guide)
    selectBadCase.on('renderlet', function () {
        $('#select-bad-case option.dc-select-option').each(function () {
                switch ($(this).attr('value')) {
                    case '0':
                        $(this).attr('title', 'Good case');
                        break;
                    case '1':
                        $(this).attr('title', 'missing age or sex only');
                        break;
                    case '2':
                        $(this).attr('title', 'missing day of the week only');
                        break;
                    case '3':
                        $(this).attr('title', 'missing 91+ minutes in diary only');
                        break;
                    case '4':
                        $(this).attr('title', '(1 to 6) <7 episodes only');
                        break;
                    case '5':
                        $(this).attr('title', 'missing 2+ basic activities only');
                        break;
                    case '6':
                        $(this).attr('title', 'missing age or sex & the day of week ');
                        break;
                    case '7':
                        $(this).attr('title', 'missing age or sex & 91+ diary minutes');
                        break;
                    case '8':
                        $(this).attr('title', 'missing age or sex & <7 episodes');
                        break;
                    case '9':
                        $(this).attr('title', 'missing age or sex & 2+ basic activites');
                        break;
                    case '10':
                        $(this).attr('title', 'missing the day of the week & 91+ diary minutes');
                        break;
                    case '11':
                        $(this).attr('title', 'missing the day of the week & <7 episodes');
                        break;
                    case '12':
                        $(this).attr('title', 'missing the day of the week & 2+ basic activites');
                        break;
                    case '13':
                        $(this).attr('title', 'missing 91+ diary minutes & <7 episodes');
                        break;
                    case '14':
                        $(this).attr('title', 'missing 91+ diary minutes & 2+ basic activites');
                        break;
                    case '15':
                        $(this).attr('title', '<7 episodes & 2+ basic activites');
                        break;
                    case '16':
                        $(this).attr('title', 'missing age or sex, the day of the week, & 91+ diary minutes');
                        break;
                    case '17':
                        $(this).attr('title', 'missing age or sex, the day of the week, & <7 episodes');
                        break;
                    case '18':
                        $(this).attr('title', 'missing age or sex, the day of the week, & 2+ basic activites');
                        break;
                    case '19':
                        $(this).attr('title', 'missing age or sex, 91+ diary minutes, & <7 episodes');
                        break;
                    case '20':
                        $(this).attr('title', 'missing age or sex, 91+ diary minutes, & 2+ basic activites');
                        break;
                    case '21':
                        $(this).attr('title', 'missing age or sex, 2+ basic activites, & <7 episodes');
                        break;
                    case '22':
                        $(this).attr('title', 'missing the day of the week, 91+ diary minutes, & <7 episodes');
                        break;
                    case '23':
                        $(this).attr('title', 'missing the day of the week, 91+ diary minutes, & 2+ basic activites');
                        break;
                    case '24':
                        $(this).attr('title', 'missing the day of the week, 2+ basic activites, & <7 episodes');
                        break;
                    case '25':
                        $(this).attr('title', 'missing 91+ diary minutes, 2+ basic activites, & <7 episodes');
                        break;
                    case '26':
                        $(this).attr('title', 'missing age or sex, the day of the week, 91+ diary minutes, & <7 episodes');
                        break;
                    case '27':
                        $(this).attr('title', 'missing age or sex, the day of the week, 91+ diary minutes, & 2+ basic acts');
                        break;
                    case '28':
                        $(this).attr('title', 'missing age or sex, the day of the week, <7 episodes, & 2+ basic activities');
                        break;
                    case '29':
                        $(this).attr('title', 'missing age or sex, 91+ diary minutes, <7 episodes, & 2+ basic activities');
                        break;
                    case '30':
                        $(this).attr('title', 'missing day of the week, 91+ diary minutes, <7 episodes, & 2+ basic acts');
                        break;
                    case '31':
                        $(this).attr('title', 'bad case on all points ');
                        break;
                    default:
                        $(this).attr('title', 'undefined');

                }
                $(this).tooltip();
            }
        );
    });
    selectBadCase.on('postRender', function () {
        $('#select-bad-case').prepend($('<div class="select-title">Badcase</div>'));
    });


    //Download as CSV Function
    d3.select('#download')
        .on('click', function () {
            var data = years.top(Infinity);
            console.log(data[0]);
            var objects = [];
            //Reverse the replaced data, find by key (thanks underscore.js)
            data.forEach(function (d) {
                d['countrya'] = parseInt((_.invert(countrya))[d['countrya']]);
                d['day'] = parseInt((_.invert(day))[d['day']]);
                //sort the Object according to initial data ordering, else the CSV could have random column ordering
                var tempObject = {
                    countrya: d['countrya'],
                    survey: d['survey'],
                    swave: d['swave'],
                    msamp: d['msamp'],
                    hhldid: d['hhldid'],
                    persid:d['persid'],
                    id:d['id'],
                    parntid1:d['parntid1'],
                    parntid2:d['parntid2'],
                    partid:d['partid'],
                    day:d['day'],
                    month: d['month'],
                    year: d['year'],
                    diary: d['diary'],
                    badcase: d['badcase'],
                    hhtype: d['hhtype'],
                    hhldsize: d['hhldsize'],
                    nchild: d['nchild'],
                    agekidx: d['agekidx'],
                    incorig: d['incorig'],
                    income: d['income'],
                    ownhome: d['ownhome'],
                    urban: d['urban'],
                    computer: d['computer'],
                    vehicle: d['vehicle'],
                    sex: d['sex'],
                    age: d['age'],
                    famstat: d['famstat'],
                    cphome: d['cphome'],
                    singpar: d['singpar'],
                    relrefp: d['relrefp'],
                    civstat: d['civstat'],
                    empstat: d['empstat'],
                    emp: d['emp'],
                    unemp: d['unemp'],
                    student: d['student'],
                    retired: d['retired'],
                    empsp: d['empsp'],
                    workhrs: d['workhrs'],
                    empinclm: d['empinclm'],
                    occup: d['occup'],
                    sector: d['sector'],
                    educa: d['educa'],
                    edcat: d['edcat'],
                    rushed: d['rushed'],
                    health: d['health'],
                    carer: d['carer'],
                    disab: d['disab'],
                    main1: d['main1'],
                    main2: d['main2'],
                    main3: d['main3'], 
                    main4: d['main4'],
                    main5: d['main5'],
                    main6: d['main6'],
                    main7: d['main7'],
                    main8: d['main8'],
                    main9: d['main9'],
                    main10: d['main10'],
                    main11: d['main11'],
                    main12: d['main12'],
                    main13: d['main13'], 
                    main14: d['main14'],
                    main15: d['main15'],
                    main16: d['main16'],
                    main17: d['main17'],
                    main18: d['main18'],
                    main19: d['main19'],
                    main20: d['main20'],
                    main21: d['main21'],
                    main22: d['main22'],
                    main23: d['main23'], 
                    main24: d['main24'],
                    main25: d['main25'],
                    main26: d['main26'],
                    main27: d['main27'],
                    main28: d['main28'],
                    main29: d['main29'],
                    main30: d['main30'],
                    main31: d['main31'],
                    main32: d['main32'],
                    main33: d['main33'], 
                    main34: d['main34'],
                    main35: d['main35'],
                    main36: d['main36'],
                    main37: d['main37'],
                    main38: d['main38'],
                    main39: d['main39'],
                    main40: d['main40'],
                    main41: d['main41'],
                    main42: d['main42'],
                    main43: d['main43'],
                    main44: d['main44'],
                    main45: d['main45'],
                    main46: d['main46'],
                    main47: d['main47'],
                    main48: d['main48'], 
                    main49: d['main49'],
                    main50: d['main50'],
                    main51: d['main51'],
                    main52: d['main52'],
                    main53: d['main53'],
                    main54: d['main54'],
                    main55: d['main55'],
                    main56: d['main56'],
                    main57: d['main57'],
                    main58: d['main58'], 
                    main59: d['main59'],
                    main60: d['main60'],
                    main61: d['main61'],
                    main62: d['main62'],
                    main63: d['main63'],
                    main64: d['main64'],
                    main65: d['main65'],
                    main66: d['main66'],
                    main67: d['main67'],
                    main68: d['main68'],
                    main69: d['main69'],
                    av1: d['av1'],
                    av2: d['av2'],
                    av3: d['av3'], 
                    av4: d['av4'],
                    av5: d['av5'],
                    av6: d['av6'],
                    av7: d['av7'],
                    av8: d['av8'],
                    av9: d['av9'],
                    av10: d['av10'],
                    av11: d['av11'],
                    av12: d['av12'],
                    av13: d['av13'], 
                    av14: d['av14'],
                    av15: d['av15'],
                    av16: d['av16'],
                    av17: d['av17'],
                    av18: d['av18'],
                    av19: d['av19'],
                    av20: d['av20'],
                    av21: d['av21'],
                    av22: d['av22'],
                    av23: d['av23'], 
                    av24: d['av24'],
                    av25: d['av25'],
                    av26: d['av26'],
                    av27: d['av27'],
                    av28: d['av28'],
                    av29: d['av29'],
                    av30: d['av30'],
                    av31: d['av31'],
                    av32: d['av32'],
                    av33: d['av33'], 
                    av34: d['av34'],
                    av35: d['av35'],
                    av36: d['av36'],
                    av37: d['av37'],
                    av38: d['av38'],
                    av39: d['av39'],
                    av40: d['av40'],
                    av41: d['av41'],
                    sppart: d['sppart'],
                    ocombwt: d['ocombwt'],
                    propwt: d['propwt']
                };
                //Push the new Object to our object array
                objects.push(tempObject);
            });
            //Convert everything into CSV and serve it as a download
            var blob = new Blob([d3.csv.format(objects)], {type: "text/csv;charset=utf-8"});
            saveAs(blob, 'data.csv');
        });

    //Hide the loading overlay once dc.js is done creating all the initial charts
    $.LoadingOverlay('hide');

    dc.renderAll();

}