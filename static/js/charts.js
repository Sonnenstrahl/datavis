/*
    @Author: David Haas
 */

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
        d['day'] = day[d['day']];
        d['countrya'] = countrya[d['countrya']];
        d['main'] = [d['main1'], d['main2'], d['main3'], d['main4'], d['main5'], d['main6'], d['main7'], d['main8'], d['main9'], d['main10'], d['main11'], d['main12'], d['main13'],
            d['main14'], d['main15'], d['main16'], d['main17'], d['main18'], d['main19'], d['main20'], d['main21'], d['main22'], d['main23'], d['main24'], d['main25'], d['main26'],
            d['main27'], d['main28'], d['main29'], d['main30'], d['main31'], d['main32'], d['main33'], d['main34'], d['main35'], d['main36'], d['main37'], d['main38'], d['main39'],
            d['main40'], d['main41'], d['main42'], d['main43'], d['main44'], d['main45'], d['main46'], d['main47'], d['main48'], d['main49'], d['main50'], d['main51'], d['main52'],
            d['main53'], d['main54'], d['main55'], d['main56'], d['main57'], d['main58'], d['main59'], d['main60'], d['main61'], d['main62'], d['main63'], d['main64'], d['main65'],
            d['main66'], d['main67'], d['main68'], d['main69']];
        if (d['occup'] in occup) {
            //patch since there are values like -8 /-7 that get combined into one, this information would else be lost.
            d['occupsaved'] = d['occup'];
            d['occup'] = occup[d['occup']];
        }
        else {
            //patch since there are values like -8 /-7 that get combined into one, this information would else be lost.
            d['occupsaved'] = d['occup'];
            d['occup'] = occup[15];
        }
        //Combine Ages into Bins, CF bins work but do not filter correctly.
        if (d['age']) {
            if (d['age'] < 20) {
                d['ageFix'] = 18;
            }
            else d['ageFix'] = Math.floor(d['age'] / 10) * 10;
        }
        else d['ageFix'] = 0;
    });

    var ndx = crossfilter(cleanData);
    var all = ndx.groupAll();

    //Heatmap
/*    var heatDim = ndx.dimension(function (d) {
        return [d['day'], d['main']];
    });
    var heatGroup = heatDim.groupAll().reduce(reduceAdd, reduceRemove, reduceInitial).value();

    //Oh boy fuck multidimensional arrays fuck fuck fuck
    function reduceAdd(p, v) {
        v['main'].forEach(function (val, index) {
            if (val > 0) {
                var temp_array = [v['day'], index + 1];
                p[temp_array] = (p[temp_array] || 0) + val;
            }
        });
        return p;
    }

    function reduceRemove(p, v) {
        v['main'].forEach(function (val, index) {
            if (val > 0) {
                var temp_array = [v['day'], index + 1];
                p[temp_array] = (p[temp_array] || 0) - val;
            }
        });
        return p;
    }

    function reduceInitial(p, v) {
        return {};
    }

    heatGroup.all = function () {
        var newObject = [];
        for (var key in this) {
            if (this.hasOwnProperty(key) && key != "all" && key != "top") {
                var temp_array = [key.substring(0, key.indexOf(',')), key.substring(key.indexOf(',') + 1)];
                newObject.push({
                    key: temp_array,
                    value: this[temp_array]
                });
            }
        }
        return newObject;
    };
    heatGroup.top = function () {
        var newObject = this.all();
        newObject.sort(function (a, b) {
            return b.value - a.value
        });
        return newObject.slice(0, count);
    };*/

    //TimeChart
    var years = ndx.dimension(function (d) {
        return d['year'];
    });
    var recordsByYear = years.group();
    var firstYear = years.bottom(1)[0]['year'];
    var lastYear = years.top(1)[0]['year'];

    //Day of the Week
    var days = ndx.dimension(function (d) {
        return d['day'];
    });
    var recordsByDay = days.group();

    //Stacked Bar Chart
    /*    var grp1 = days.group().reduceCount(function(d) {
            return d['sex'];
        });
        var grp2 = days.group().reduceCount(function(d) {
            return d['age'];
        });
        console.log(grp2);*/

    //Chloropleth Map
    var countries = ndx.dimension(function (d) {
        return d['countrya']
    });
    var recordsByCountry = countries.group();
    var countryMax = recordsByCountry.top(1)[0].value;

    //Occupation Pie Chart
    var occupation = ndx.dimension(function (d) {
        return d['occup']
    });
    var occupationGrouped = occupation.group();

    //Age Distribution
    var age = ndx.dimension(function (d) {
        return d['ageFix'];
    });
    var ageGrouped = age.group();
    var youngestAge = age.bottom(1)[0]['age'];
    var oldestAge = age.top(1)[0]['age'];

    //DataTable
    var tableDim = ndx.dimension(function (d) {
        return d['_id']['$oid']
    });

    //Select Menu
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
    var chloropleth = dc.geoChoroplethChart('#chloropleth');
    var occupationPie = dc.pieChart('#occupation-piechart');
    //var heatMap = dc.heatMap('#heatmap');
    var selectSex = dc.selectMenu('#select-sex');
    var selectRetired = dc.selectMenu('#select-retired');
    var selectBadCase = dc.selectMenu('#select-bad-case');
    var selectStudent = dc.selectMenu('#select-student');
    var selectComputer = dc.selectMenu('#select-computer');
    var selectVehicle = dc.selectMenu('#select-vehicle');
    var selectHhldsize = dc.selectMenu('#select-hhldsize');
    var selectSector = dc.selectMenu('#select-sector');
    var dataTable = dc.dataTable('#dataTable');
    /*
        var stackedActivityChart = dc.compositeChart('#composite');
    */

/*
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
            return +d.value;
        })
        //Disable on Click, since we can't sort due to our activity arrays (there is nothing to sort on)
        .boxOnClick(function (d) {
        })
        .rows(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
        .cols([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
            , 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69])
        .colors(d3.scale.linear().range(['white', 'darkblue']))
        .title(function (d) {
            return "Minutes Spent: " + (d.value);
        })
        .xBorderRadius(2)
        .yBorderRadius(2)
        .calculateColorDomain()
        .on('renderlet', function () {
            $('.heatmap').attr('transform', 'translate(60,10)');
        });
*/

    /*
        stackedActivityChart
            .width(760)
            .height(400)
            .compose ([
                dc.lineChart(stackedActivityChart)
                    .dimension(days)
                    .colors('red')
                    .group(grp1,'main1')
                    .dashStyle([2,2]),
                dc.lineChart(stackedActivityChart)
                    .dimension(days)
                    .colors('blue')
                    .group(grp2,'main2')
                    .dashStyle([5,5])
            ]).brushOn(false);*/

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

    dataTable
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
            }]);

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

    //TODO unclean data again
    d3.select('#download')
        .on('click', function () {
            console.log(years.top(Infinity));
            var data = years.top(Infinity);
            //Reverse the replaced data, find by key (thanks underscore.js)
            data.forEach(function (d) {
                d['countrya'] = (_.invert(countrya))[d['countrya']];
                d['day'] = (_.invert(day))[d['day']];
                //here we use occupsaved and remove it afterwards
                d['occup'] = d['occupsaved'];
                delete d['occupsaved'];
                delete d['_id'];
                delete d['main'];
                delete d['ageFix'];
            });
            var blob = new Blob([d3.csv.format(years.top(Infinity))], {type: "text/csv;charset=utf-8"});
            saveAs(blob, 'data.csv');
        });

    $.LoadingOverlay('hide');

    dc.renderAll();

}