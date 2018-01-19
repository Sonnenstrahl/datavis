/*
    @Author: David Haas
 */
//Javascript is async, use of queue ensures that Data is fully loaded before dc.js starts building charts
queue()
    .defer(d3.json, 'timeuse/data')
    .defer(d3.json, 'static/js/lib/custom.geo.json')
    .defer(d3.json, 'timeuse/params')
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
var famstat = {
    0: 'Adult aged 18 to 39 with no co-resident children <18',
    1: 'Adult 18+ living with 1+ co-resident children aged <5',
    2: 'Adult 18+ living with 1+ co-resident children 5-17, none <5',
    3: 'Adult aged 40+ with no co-resident children <18',
    4: 'Respondent aged <18 and living with parent(s)/guardian(s)',
    5: 'Respondent aged <18, living arrangement other or unknown',
    6: 'undefined'
};
var activitiesCombined = {
    0: 'Undefined',
    1: 'Work travel & commute',
    2: 'Private travel',
    3: 'Food & Drink',
    4: 'Paid and voluntary work',
    5: 'Leisure & recreation',
    6: 'Personal, household, family care',
    7: 'Sleep & rest'
};

function buildVisualisation(error, json, geoJson, params) {
    console.log(error);
    var cleanData = json;
    cleanData.forEach(function (d) {
        //Assign Countrynames, required for the GeoJson of the chloropleth Map
        d['countrya'] = countrya[d['countrya']];

        //Convert occupation into Text
        if (d['occup'] in occup) {
            d['occupFix'] = occup[d['occup']];
        }
        else d['occupFix'] = occup[15];
        //Convert famstat into Text
        if (d['famstat'] in famstat) {
            d['famstatFix'] = famstat[d['famstat']]
        }
        else d['famstatFix'] = famstat[6];
        //Combine Ages into Bins, CF bins work but do not filter correctly.
        if (d['age']) {
            if (d['age'] < 20) {
                d['ageFix'] = 18;
            }
            else d['ageFix'] = Math.floor(d['age'] / 10) * 10;
        }
        else d['ageFix'] = 0;
        //Combine Workhours into Bins
        if (d['workhrs'] > 0) {
            d['workhrsBin'] = Math.floor(d['workhrs'] / 20) * 20;
        }
        else if (d['workhrs'] < 0) {
            d['workhrsBin'] = 'undefined';
        }
        else d['workhrsBin'] = 0;
    });

    //Create a Crossfilter
    var ndx = crossfilter(cleanData);
    //Show Total Amount of Records that are being filtered
    var all = ndx.groupAll();

    //Activity Pie Chart
    //The Dimension doesnt really matter, as we cant sort on fake groups
    var activities = ndx.dimension(function (d) {
        return d['gAct'];
    });

    var activitiesGroup = activities.groupAll().reduce(reduceAddActivity, reduceRemoveActivity, reduceInitialActivity).value();

    function reduceAddActivity(p, v) {
        v['gAct'].forEach(function (val, index) {
            if (!p[index])
                p[index] = [val, 1];
            else {
                p[index][0] += val;
                p[index][1] += 1;
            }
        });
        return p;
    }

    function reduceRemoveActivity(p, v) {
        v['gAct'].forEach(function (val, index) {
            p[index][0] -= val;
            p[index][1] -= 1;
        });
        return p;
    }

    function reduceInitialActivity() {
        return {};
    }

    activitiesGroup.all = function () {
        var newObject = [];
        for (var key in this) {
            if (this.hasOwnProperty(key) && key != 'all') {
                var avg = 0;
                if (this[key][1] > 0)
                    avg = Math.round(this[key][0] / this[key][1]);
                newObject.push({
                    key: key,
                    value: avg
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

    //Famstat Distribution
    var famstatDim = ndx.dimension(function (d) {
        return d['famstatFix'];
    });
    var famstatGrouped = famstatDim.group();

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
    var singparDim = ndx.dimension(function(d){
        return d['singpar'];
    });
    var singparGrouped = singparDim.group();
    var civstatDim = ndx.dimension(function(d){
        return d['civstat'];
    });
    var civstatGrouped = civstatDim.group();

    var citizenDim = ndx.dimension(function(d){
        return d['citizen'];
    });
    var citizenGrouped = citizenDim.group();
    var empstatDim = ndx.dimension(function (d) {
        return d['empstat'];
    });
    var empstatGrouped = empstatDim.group();

    //Charts HTML tags
    var totalRecords = dc.numberDisplay('#total-records');
    var timeChart = dc.barChart('#timeChart');
    var ageChart = dc.rowChart('#ageChart');
    var weekDay = dc.rowChart('#weekDay');
    var workHrsChart = dc.rowChart('#workhrs');
    var famstatChart = dc.rowChart('#famstat');
    var chloropleth = dc.geoChoroplethChart('#chloropleth');
    var occupationPieChart = dc.pieChart('#occupation-piechart');
    var selectSex = dc.selectMenu('#select-sex');
    var selectRetired = dc.selectMenu('#select-retired');
    var selectBadCase = dc.selectMenu('#select-bad-case');
    var selectStudent = dc.selectMenu('#select-student');
    var selectComputer = dc.selectMenu('#select-computer');
    var selectVehicle = dc.selectMenu('#select-vehicle');
    var selectHhldsize = dc.selectMenu('#select-hhldsize');
    var selectSector = dc.selectMenu('#select-sector');
    var selectEmpstat = dc.selectMenu('#select-empstat');
    var selectSingpar = dc.selectMenu('#select-singpar');
    var selectCitizen = dc.selectMenu('#select-citizen');
    //var selectCohab = dc.selectMenu('select-cohab');
    var selectCivstat = dc.selectMenu('select-civstat');
    var activityGroupPieChart = dc.pieChart('#groupedActivities');

    totalRecords
        .formatNumber(d3.format('d'))
        .valueAccessor(function (d) {
            return d;
        })
        .group(all);

    timeChart
        .width(620)
        .height(150)
        .margins({top: 10, right: 50, left: 50, bottom: 50})
        .dimension(years)
        .group(recordsByYear)
        .transitionDuration(200)
        .x(d3.scale.linear().domain([firstYear - 1, lastYear + 1]))
        .elasticY(true)
        .centerBar(true)
        .xAxisLabel('Year')
        .yAxisLabel('Records')
        .yAxis().ticks(5);

    ageChart
        .width(320)
        .height(200)
        .dimension(age)
        .elasticX(true)
        .group(ageGrouped)
        .xAxis().ticks(4);
    ageChart.on('postRender', function (chart) {
        chart.svg().append('text').attr('class', 'x-axis-label').attr('text-anchor', 'middle').attr('x', weekDay.width() / 2).attr('y', weekDay.height())
            .text('Records');
    });

    famstatChart
        .width(320)
        .height(200)
        .dimension(famstatDim)
        .elasticX(true)
        .group(famstatGrouped)
        .xAxis().ticks(2);
    famstatChart.on('postRender', function (chart) {
        chart.svg().append('text').attr('class', 'x-axis-label').attr('text-anchor', 'middle').attr('x', weekDay.width() / 2).attr('y', weekDay.height())
            .text('Records');
    });

    workHrsChart
        .width(320)
        .height(200)
        .dimension(workHrs)
        .elasticX(true)
        .group(workHrsGrouped)
        .xAxis().ticks(2);
    workHrsChart.on('postRender', function (chart) {
        chart.svg().append('text').attr('class', 'x-axis-label').attr('text-anchor', 'middle').attr('x', weekDay.width() / 2).attr('y', weekDay.height())
            .text('Records');
    });
    weekDay
        .width(320)
        .height(200)
        .dimension(days)
        .group(recordsByDay)
        .gap(1)
        .ordering(function (d) {
            return -d.value
        })
        .elasticX(true)
        .xAxis().ticks(5);
    weekDay.on('postRender', function (chart) {
        chart.svg().append('text').attr('class', 'x-axis-label').attr('text-anchor', 'middle').attr('x', weekDay.width() / 2).attr('y', weekDay.height())
            .text('Records');
    });

    chloropleth
        .width(700)
        .height(415)
        .dimension(countries)
        .group(recordsByCountry)
        .colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
        .colorDomain([0, countryMax])
        .overlayGeoJson(geoJson.features, 'name', function (d) {
            return d.properties.name;
        })
        .projection(d3.geo.mercator()
            .scale(500)
            .translate([350, 220])
            .center([20, 50]))
        .title(function (t) {
            return 'Country: ' + t['key'] + '\n' + 'Records: ' + t['value'];
        });

    occupationPieChart
        .width(250)
        .height(250)
        .externalRadiusPadding(10)
        .dimension(occupation)
        .group(occupationGrouped)
        .legend(dc.legend().x(250).y(0).gap(5))
        .selectAll('.dc-legend.item text')
        .text('').append('tspan').text(function (d) {
        return d.name;
    });

    activityGroupPieChart
        .width(450)
        .height(230)
        .externalRadiusPadding(30)
        .dimension(activities)
        .group(activitiesGroup)
        .innerRadius(40)
        .externalLabels(20)
        .legend(dc.legend().x(250).y(0).gap(12).legendText(function (d){
            if(d.name in activitiesCombined)
                return activitiesCombined[d.name];
        }))
        .cx(120)
        .title(function(d){
            return 'Average time spent: ' + d.value + '\n' + activitiesCombined[d.key];
        })
        .renderLabel(true);
        //.colors(d3.scale.ordinal().domain([1,2,3,4,5,6,7]).range(["#D82C8C", "#17A7CF", "#23e578","#D82C8C", "#17A7CF", "#E58304","#23E578"])));
    activityGroupPieChart.on('pretransition', function(chart) {
        chart.selectAll('text.pie-slice').text(function(d) {
            if ((d.endAngle - d.startAngle) < (5*Math.PI/180))
                return '';
            return Math.round(dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100)) + '%';
        })
    });
    /*
        Disable the onclick event, since we cant filter
     */
    activityGroupPieChart.filter = function() {};

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

    selectCitizen
        .dimension(citizenDim)
        .group(citizenGrouped)
        .multiple(true)
        .controlsUseVisibility(true).on('postRender', function () {
        $('#select-citizen').prepend($('<div class="select-title">Citizen</div>'));
    });
    selectEmpstat
        .dimension(empstatDim)
        .group(empstatGrouped)
        .multiple(true)
        .controlsUseVisibility(true).on('postRender', function () {
        $('#select-empstat').prepend($('<div class="select-title">Employementstat</div>'));
    });
    selectSingpar
        .dimension(singparDim)
        .group(singparGrouped)
        .multiple(true)
        .controlsUseVisibility(true).on('postRender', function () {
        $('#select-singpar').prepend($('<div class="select-title">Single Parent</div>'));
    });
    selectCivstat
        .dimension(civstatDim)
        .group(civstatGrouped)
        .multiple(true)
        .controlsUseVisibility(true).on('postRender', function () {
        $('#select-civstat').prepend($('<div class="select-title">Civstat</div>'));
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

    //Heatmap
    if (params[0] && params[0]['heatmap'] === 1) {
        //The dimension doesnt really matter, since you won't be able filter on it.
        var heatDim = ndx.dimension(function (d) {
            return [d['day'], d['main']];
        });
        var heatGroup = heatDim.groupAll().reduce(reduceAdd, reduceRemove, reduceInitial).value();

        /*
            Custom reduce functions, to work with arrays, activities are converted into the following:
            'day,main': value
            for example: 11: 10
         */
        //Add up all selected records -> p[key] = [value,count]
        //For example p[11] = [20,2]
        function reduceAdd(p, v) {
            v['main'].forEach(function (val, index) {
                //+1 since Activity 0 is not a thing, but the first index of the array is 0
                var key = v['day'].concatenate(index + 1);
                //if(!p[key] = []
                //p[key].push(val)
                if (!p[key])
                    p[key] = [val, 1];
                else {
                    p[key][0] += val;
                    p[key][1] += 1;
                }
            });
            return p;
        }

        function reduceRemove(p, v) {
            v['main'].forEach(function (val, index) {
                var key = v['day'].concatenate(index + 1);
                //var indexOfValue = p[key].indexOf(val);
                //p[key].splice(indexOfValue,1);
                p[key][1] -= 1;
                p[key][0] -= val;
            });
            return p;
        }

        function reduceInitial() {
            return {};
        }

        heatGroup.all = function () {
            var newObject = [];
            for (var key in this) {
                if (this.hasOwnProperty(key) && key != 'all') {
                    var digits = getNumberOfDigits(key);
                    var activity = digits < 3 ? key % 10 : key % 100;
                    var day = digits < 3 ? Math.floor(key / 10) % 10 : Math.floor(key / 100) % 100;
                    var avg = 0;
                    if (this[key][1] > 0)
                        avg = Math.round(this[key][0] / this[key][1]);
                    //var avg = _.reduce(this[key], function(memo, num) {return memo + num;}, 0) / (this[key].length === 0 ? 1 : this[key].length);
                    newObject.push({
                        day: day,
                        activity: activity,
                        avg: avg
                    });
                }
            }
            return newObject;
        };
        var heatMap = dc.heatMap('#heatmap');

        heatMap
            .width(1400)
            .height(200)
            .dimension(heatDim)
            .group(heatGroup)
            .valueAccessor(function (d) {
                return d.day;
            })
            .keyAccessor(function (d) {
                return d.activity;
            })
            .colorAccessor(function (d) {
                return d.avg;
            })
            .rows([2, 3, 4, 5, 6, 7, 1])
            .cols([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
                , 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69])
            .colors(d3.scale.linear().range(['white', 'darkblue']))
            .title(function (d) {
                return 'Avg: ' + (d.avg);
            })
            .rowsLabel(function(d){
                if(d in day)
                    return day[d];
            })
            .xBorderRadius(2)
            .yBorderRadius(2)
            .calculateColorDomain()
            .on('pretransition', function () {
                $('.heatmap').attr('transform', 'translate(60,10)');
            });

        /*
            Disable the filter function
         */
            heatMap.filter = function() {};
    }

    //Download as CSV Function
    d3.select('#download')
        .on('click', function () {
            var data = years.top(Infinity);
            console.log(data[0]);
            var objects = [];
            //Reverse the replaced data, find by key (thanks underscore.js)
            data.forEach(function (d) {
                d['countrya'] = parseInt((_.invert(countrya))[d['countrya']]);
                //sort the Object according to initial data ordering, else the CSV could have random column ordering
                var tempObject = {
                    countrya: d['countrya'],
                    survey: d['survey'],
                    swave: d['swave'],
                    msamp: d['msamp'],
                    hhldid: d['hhldid'],
                    persid: d['persid'],
                    id: d['id'],
                    parntid1: d['parntid1'],
                    parntid2: d['parntid2'],
                    partid: d['partid'],
                    day: d['day'],
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

Number.prototype.concatenate = function (b) {
    return this * Math.pow(10, Math.floor(Math.log(b) / Math.log(10)) + 1) + b;
};

function getNumberOfDigits(Number) {
    return Math.max(Math.floor(Math.log10(Math.abs(Number))), 0) + 1;
}