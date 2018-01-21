/**
 * @Author: David Haas
 */
/**
 * Javascript is async, use of queue ensures that the data is fully loaded before dc.js starts building charts
 */
queue()
    .defer(d3.json, 'timeuse/data')
    .defer(d3.json, 'static/js/lib/custom.geo.json')
    .defer(d3.json, 'timeuse/params')
    .await(buildVisualisation);

/**
 * This Section holds all the MTUS variables as keys, this is used to convert the specific key into something readable
 */
/**
 * Some countries here have a slightly different Name than in the MTUS Guide,
 * they have been renamed to correspond to the according geojson country, have a look at custom.geo.json
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
    10: 'Unspecified weekend day',
    11: 'undefined'
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
var badcase = {
    0: 'Good case',
    1: 'missing age or sex only',
    2: 'missing day of the week only',
    3: 'missing 91+ minutes in diary only',
    4: '(1 to 6) <7 episodes only',
    5: 'missing 2+ basic activities only',
    6: 'missing age or sex & the day of week ',
    7: 'missing age or sex & 91+ diary minutes',
    8: 'missing age or sex & <7 episodes',
    9: 'missing age or sex & 2+ basic activites',
    10: 'missing the day of the week & 91+ diary minutes',
    11: 'missing the day of the week & <7 episodes',
    12: 'missing the day of the week & 2+ basic activites',
    13: 'missing 91+ diary minutes & <7 episodes',
    14: 'missing 91+ diary minutes & 2+ basic activites',
    15: '<7 episodes & 2+ basic activites',
    16: 'missing age or sex, the day of the week, & 91+ diary minutes',
    17: 'missing age or sex, the day of the week, & <7 episodes',
    18: 'missing age or sex, the day of the week, & 2+ basic activites',
    19: 'missing age or sex, 91+ diary minutes, & <7 episodes',
    20: 'missing age or sex, 91+ diary minutes, & 2+ basic activites',
    21: 'missing age or sex, 2+ basic activites, & <7 episodes',
    22: 'missing the day of the week, 91+ diary minutes, & <7 episodes',
    23: 'missing the day of the week, 91+ diary minutes, & 2+ basic activites',
    24: 'missing the day of the week, 2+ basic activites, & <7 episodes',
    25: 'missing 91+ diary minutes, 2+ basic activites, & <7 episodes',
    26: 'missing age or sex, the day of the week, 91+ diary minutes, & <7 episodes',
    27: 'missing age or sex, the day of the week, 91+ diary minutes, & 2+ basic acts',
    28: 'missing age or sex, the day of the week, <7 episodes, & 2+ basic activities',
    29: 'missing age or sex, 91+ diary minutes, <7 episodes, & 2+ basic activities',
    30: 'missing day of the week, 91+ diary minutes, <7 episodes, & 2+ basic acts',
    31: 'bad case on all points '
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
    '-7': 'undefined'
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
var singpar = {
    0: 'No',
    1: 'Yes'
};
var ownhome = {
    1: 'Own',
    2: 'Rent',
    3: 'Other Arrangement',
    '-9': 'not recorded'
};
var urban = {
    1: 'Urban/Suburban',
    2: 'Rural/Semi-rural'
};
var empstat = {
    1: 'Employed Full Time',
    2: 'Employed Part Time',
    3: 'Employed, unknown status',
    4: 'Not in paid work'
};
var edcat = {
    1: 'uncompleted secondary or less',
    2: 'completed secondary',
    3: 'above secondary education'
};
var citizen = {
    0: 'No',
    1: 'Yes'
};
var civstat = {
    1: 'Diarist in a couple',
    2: 'No, diarist not in a couple'
};
var hhtype = {
    1: 'One person household',
    2: 'Couple alone',
    3: 'Couple + others',
    4: 'Other household types'
};
var cohab = {
    '-7': 'Not in a couple',
    0: 'Married/civil partners',
    1: 'Cohabiting'
};
var actToolTip = {
    1: 'imputed personal or household care',
    2: 'sleep and naps',
    3: 'imputed sleep',
    4: 'wash, dress, care for self',
    5: 'meals at work or school',
    6: 'meals or snacks in other places',
    7: 'paid work- job (not at home)',
    8: 'paid work at home',
    9: 'second or other job not at home',
    10: 'unpaid work to generate household income',
    11: 'travel as a part of work',
    12: 'work breaks',
    13: 'other time at workplace',
    14: 'look for work',
    15: 'regular schooling, education',
    16: 'homework',
    17: 'leisure & other education or training',
    18: 'food preparation, cooking',
    19: 'set table, wash/put away dishes',
    20: 'cleaning',
    21: 'laundry, ironing, clothing repair',
    22: 'maintain home/vehicle, including collect fuel',
    23: 'other domestic work',
    24: 'purchase goods',
    25: 'consume personal care services',
    26: 'consume other services',
    27: 'pet care (not walk dog)',
    28: 'physical, medical child care',
    29: 'teach, help with homework',
    30: 'read to, talk or play with child',
    31: 'supervise, accompany, other child care',
    32: 'adult care',
    33: 'voluntary, civic, organisational act',
    34: 'worship and religion',
    35: 'general out-of-home leisure',
    36: 'attend sporting event',
    37: 'cinema, theatre, opera, concert',
    38: 'other public event, venue',
    39: 'restaurant, café, bar, pub',
    40: 'party, social event, gambling',
    41: 'imputed time away from home',
    42: 'general sport or exercise',
    43: 'walking',
    44: 'cycling',
    45: 'other outside recreation',
    46: 'gardening/pick mushrooms',
    47: 'walk dogs',
    48: 'receive or visit friends',
    49: 'conversation (in person, phone)',
    50: 'games (social & solitary)/other in-home social',
    51: 'general indoor leisure',
    52: 'art or music',
    53: 'correspondence (not e-mail)',
    54: 'knit, crafts or hobbies',
    55: 'relax, think, do nothing',
    56: 'read',
    57: 'listen to music or other audio content',
    58: 'listen to radio',
    59: 'watch TV, video, DVD',
    60: 'computer games',
    61: 'e-mail, surf internet, computing',
    62: 'no activity, imputed or recorded transport',
    63: 'travel to/from work',
    64: 'education travel',
    65: 'voluntary/civic/religious travel',
    66: 'child/adult care travel',
    67: 'shop, person/hhld care travel',
    68: 'other travel',
    69: 'no recorded activity'
};
var emp = {
    0: 'Not in paid work',
    1: 'In paid work'
};
var unemp = {
    0: 'Not-unemployed',
    1: 'Unemployed'
};
var empsp = {
    1: 'Employed full-time',
    2: 'Employed part-time',
    3: 'Employed, unknown hours',
    4: 'Not in paid work',
    '-7': 'Not in a couple'
};
var rushed = {
    0: 'Almost never',
    1: 'Sometimes',
    2: 'Often'
};
var health = {
    0: 'Poor',
    1: 'Fair',
    2: 'Good',
    3: 'Very good'
};
var carer = {
    0: 'No',
    1: 'Yes'
};
var disab = {
    0: 'No',
    1: 'Yes'
};

/**
 * @param {error} e
 * @param {json} json
 * @param {json} geoJson
 * @param {json} params
 * This function is used to create the whole Visualisation
 */
function buildVisualisation(e, json, geoJson, params) {
    console.log(e);
    var cleanData = json;
    /**
     * Clean json, add some Fixes that are used for specific charts (i.e. bins)
     */
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
        else d['famstatFix'] = famstat['-7'];
        //Days into text, doing it via jQuery updates too slow and looks unclean
        if (d['day'] in day)
            d['dayFix'] = day[d['day']];
        else
            d['dayFix'] = day[11];
        //Combine Ages into Bins, CF Bins work but do not filter correctly.
        if (d['age']) {
            if (d['age'] < 20) {
                d['ageFix'] = 'under 20';
            }
            else {
                var ageBin = Math.floor(d['age'] / 10) * 10;
                d['ageFix'] = ageBin + ' - ' + (ageBin + 9);
            }
        }
        else d['ageFix'] = 0;
        //Combine Workhours into Bins
        if (d['workhrs'] > 0) {
            var workhrsBin = Math.floor(d['workhrs'] / 20) * 20;
            d['workhrsBin'] = workhrsBin + ' - ' + (workhrsBin + 19);
        }
        else if (d['workhrs'] < 0) {
            d['workhrsBin'] = 'not recorded';
        }
        else d['workhrsBin'] = '0';
    });

    /**
     * Create a crossfilter
     */
    var ndx = crossfilter(cleanData);

    /**
     * Total amount of records currently being filter into
     */
    var all = ndx.groupAll();

    /**
     * Timechart Years
     * @type {crossfilter.dimension|dc.baseMixin|*}
     */
    var years = ndx.dimension(function (d) {
        return d['year'];
    });
    var recordsByYear = years.group();
    //Calculate the Year Span
    var firstYear = years.bottom(1)[0]['year'];
    var lastYear = years.top(1)[0]['year'];

    /**
     * Barchart Days
     * @type {crossfilter.dimension|dc.baseMixin|*}
     */
    var days = ndx.dimension(function (d) {
        return d['dayFix'];
    });
    var recordsByDay = days.group();

    /**
     * Chloropleth GeoChart
     * @type {crossfilter.dimension|dc.baseMixin|*}
     */
    var countries = ndx.dimension(function (d) {
        return d['countrya']
    });
    var recordsByCountry = countries.group();
    /**
     * @var countryMax is used for the colorscheme in the chloropleth
     */
    var countryMax = recordsByCountry.top(1)[0].value;

    /**
     * Occupation Piechart
     * @type {crossfilter.dimension|dc.baseMixin|*}
     */
    var occupation = ndx.dimension(function (d) {
        return d['occupFix']
    });
    var occupationGrouped = occupation.group();

    /**
     * Barchart age distribution
     * @type {crossfilter.dimension|dc.baseMixin|*}
     */
    var age = ndx.dimension(function (d) {
        return d['ageFix'];
    });
    var ageGrouped = age.group();

    /**
     * Barchart Workhrs distribution
     * @type {crossfilter.dimension|dc.baseMixin|*}
     */
    var workHrs = ndx.dimension(function (d) {
        return d['workhrsBin'];
    });
    var workHrsGrouped = workHrs.group();

    /**
     * Barchart famstat
     * @type {crossfilter.dimension|dc.baseMixin|*}
     */
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
    var badcaseDim = ndx.dimension(function (d) {
        return d['badcase'];
    });
    var badCaseGrouped = badcaseDim.group();
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
    var singparDim = ndx.dimension(function (d) {
        return d['singpar'];
    });
    var singparGrouped = singparDim.group();
    var civstatDim = ndx.dimension(function (d) {
        return d['civstat'];
    });
    var civstatGrouped = civstatDim.group();

    var citizenDim = ndx.dimension(function (d) {
        return d['citizen'];
    });
    var citizenGrouped = citizenDim.group();
    var empstatDim = ndx.dimension(function (d) {
        return d['empstat'];
    });
    var empstatGrouped = empstatDim.group();
    var nchildDim = ndx.dimension(function (d) {
        return d['nchild'];
    });
    var nchildGrouped = nchildDim.group();
    var ownHomeDim = ndx.dimension(function (d) {
        return d['ownhome'];
    });
    var ownHomeGrouped = ownHomeDim.group();
    var edcatDim = ndx.dimension(function (d) {
        return d['edcat'];
    });
    var edcatGrouped = edcatDim.group();
    var hhtypeDim = ndx.dimension(function (d) {
        return d['hhtype'];
    });
    var hhtypeGrouped = hhtypeDim.group();
    var urbanDim = ndx.dimension(function (d) {
        return d['urban'];
    });
    var urbanGrouped = urbanDim.group();
    var cohabDim = ndx.dimension(function (d) {
        return d['cohab'];
    });
    var cohabGrouped = cohabDim.group();
    var empDim = ndx.dimension(function (d) {
        return d['emp'];
    });
    var empGrouped = empDim.group();
    var unempDim = ndx.dimension(function (d) {
        return d['unemp'];
    });
    var unempGrouped = unempDim.group();
    var empspDim = ndx.dimension(function (d) {
        return d['empsp'];
    });
    var empspGrouped = empspDim.group();
    var rushedDim = ndx.dimension(function (d) {
        return d['rushed'];
    });
    var rushedGrouped = rushedDim.group();
    var healthDim = ndx.dimension(function (d) {
        return d['health'];
    });
    var healthGrouped = healthDim.group();

    /**
     * Define the type of dc.js Chart and the corresponding HTML tag
     */
    var totalRecords = dc.numberDisplay('#total-records');
    var timeChart = dc.barChart('#timeChart');
    var ageBarchart = dc.rowChart('#ageChart');
    var weekdayBarchart = dc.rowChart('#weekDay');
    var workHrsBarchart = dc.rowChart('#workhrs');
    var famstatBarchart = dc.rowChart('#famstat');
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
    var selectNchild = dc.selectMenu('#select-nchild');
    var selectEdcat = dc.selectMenu('#select-edcat');
    var selectHhtype = dc.selectMenu('#select-hhtype');
    var selectUrban = dc.selectMenu('#select-urban');
    var selectCohab = dc.selectMenu('#select-cohab');
    var selectOwnhome = dc.selectMenu('#select-ownhome');
    var selectCivstat = dc.selectMenu('#select-civstat');
    var selectEmp = dc.selectMenu('#select-emp');
    var selectUnemp = dc.selectMenu('#select-unemp');
    var selectEmpsp = dc.selectMenu('#select-empsp');
    var selectRushed = dc.selectMenu('#select-rushed');
    var selectHealth = dc.selectMenu('#select-health');


    /**
     *
     * Assign Dimension,Group,Colors etc. to all those Charts
     *
     */
    totalRecords
        .formatNumber(d3.format('d'))
        .valueAccessor(function (d) {
            return d;
        })
        .group(all);
    /**
     * Timechart
     */
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
    //Remove Commas from Years
    timeChart.xAxis().tickFormat(d3.format('d'));

    ageBarchart
        .width(320)
        .height(200)
        .dimension(age)
        .elasticX(true)
        .group(ageGrouped)
        .gap(1)
        .xAxis().ticks(4);
    ageBarchart.on('postRender', function (chart) {
        chart.svg().append('text').attr('class', 'x-axis-label').attr('text-anchor', 'middle').attr('x', weekdayBarchart.width() / 2).attr('y', weekdayBarchart.height())
            .text('Records');
    });

    famstatBarchart
        .width(320)
        .height(200)
        .dimension(famstatDim)
        .elasticX(true)
        .group(famstatGrouped)
        .gap(1)
        .xAxis().ticks(2);
    famstatBarchart.on('postRender', function (chart) {
        chart.svg().append('text').attr('class', 'x-axis-label').attr('text-anchor', 'middle').attr('x', weekdayBarchart.width() / 2).attr('y', weekdayBarchart.height())
            .text('Records');
    });

    workHrsBarchart
        .width(320)
        .height(200)
        .dimension(workHrs)
        .elasticX(true)
        .group(workHrsGrouped)
        .gap(1)
        .xAxis().ticks(2);
    workHrsBarchart.on('postRender', function (chart) {
        chart.svg().append('text').attr('class', 'x-axis-label').attr('text-anchor', 'middle').attr('x', weekdayBarchart.width() / 2).attr('y', weekdayBarchart.height())
            .text('Records');
    });
    weekdayBarchart
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
    weekdayBarchart.on('postRender', function (chart) {
        chart.svg().append('text').attr('class', 'x-axis-label').attr('text-anchor', 'middle').attr('x', weekdayBarchart.width() / 2).attr('y', weekdayBarchart.height())
            .text('Records');
    });

    /**
     * Chloropleth Map
     */
    chloropleth
        .width(700)
        .height(415)
        .dimension(countries)
        .group(recordsByCountry)
        .colors(d3.scale.linear().range(['#E2F2FF', '#0061B5']))
        .colorDomain([0, countryMax])
        .overlayGeoJson(geoJson.features, 'name', function (d) {
            return d.properties.name;
        })
        .projection(d3.geo.mercator()
            .scale(500)
            .translate([350, 220])
            .center([20, 50]))
        .title(function (d) {
            return 'Country: ' + d['key'] + '\n' + 'Records: ' + d['value'];
        });
    /**
     * Occupation Pie Chart
     */
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

    /**
     * This function takes the text value gotten via JQuery and the Object we want to find the key in
     * In order to convert it into a more readable form
     * If no key is found we keep the default text
     *
     * @param {string} text
     * @param {Object} obj
     * @returns {String}
     */
    function replaceSelectText(text, obj) {
        var substring1 = text.substring(0, text.indexOf(':'));
        var substring2 = text.substring(text.indexOf(':'));
        if (obj[substring1]) {
            substring1 = obj[substring1];
            return (substring1 + substring2);
        }
        else
            return text;
    }

    /**
     * All the different select Menus
     * The title is added via JQuery
     * The values are replaced by text using the replaceSelectText function
     */
    selectSex
        .dimension(sexDim)
        .group(sexGrouped)
        .multiple(true)
        .controlsUseVisibility(true)
        .on('renderlet', function () {
            $('#select-sex option.dc-select-option').each(function () {
                $(this).text(replaceSelectText($(this).text(), sex));
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
                $(this).text(replaceSelectText($(this).text(), retired));
            });
        }).on('postRender', function () {
        $('#select-retired').prepend($('<div class="select-title">Retired</div>'));
    });
    selectBadCase
        .dimension(badcaseDim)
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
                $(this).text(replaceSelectText($(this).text(), student));
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
                $(this).text(replaceSelectText($(this).text(), computer));
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
                $(this).text(replaceSelectText($(this).text(), vehicle));
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
                $(this).text(replaceSelectText($(this).text(), sector));
            });
        }).on('postRender', function () {
        $('#select-sector').prepend($('<div class="select-title">Sector</div>'));
    });
    selectHhldsize
        .dimension(hhldsize)
        .group(hhldsizeGrouped)
        .multiple(true)
        .controlsUseVisibility(true)
        .on('postRender', function () {
            $('#select-hhldsize').prepend($('<div class="select-title">Hhold Size</div>'));
        });
    selectCitizen
        .dimension(citizenDim)
        .group(citizenGrouped)
        .multiple(true)
        .controlsUseVisibility(true)
        .on('renderlet', function () {
            $('#select-citizen option.dc-select-option').each(function () {
                $(this).text(replaceSelectText($(this).text(), citizen));
            });
        })
        .on('postRender', function () {
            $('#select-citizen').prepend($('<div class="select-title">Citizen</div>'));
        });
    selectEmpstat
        .dimension(empstatDim)
        .group(empstatGrouped)
        .multiple(true)
        .controlsUseVisibility(true)
        .on('renderlet', function () {
            $('#select-empstat option.dc-select-option').each(function () {
                $(this).text(replaceSelectText($(this).text(), empstat));
            });
        }).on('postRender', function () {
        $('#select-empstat').prepend($('<div class="select-title">Employmentstat</div>'));
    });
    selectSingpar
        .dimension(singparDim)
        .group(singparGrouped)
        .multiple(true)
        .controlsUseVisibility(true)
        .on('renderlet', function () {
            $('#select-singpar option.dc-select-option').each(function () {
                $(this).text(replaceSelectText($(this).text(), singpar));
            });
        })
        .on('postRender', function () {
            $('#select-singpar').prepend($('<div class="select-title">Single Parent</div>'));
        });
    selectCivstat
        .dimension(civstatDim)
        .group(civstatGrouped)
        .multiple(true)
        .controlsUseVisibility(true)
        .on('renderlet', function () {
            $('#select-civstat option.dc-select-option').each(function () {
                $(this).text(replaceSelectText($(this).text(), civstat));
            });
        })
        .on('postRender', function () {
            $('#select-civstat').prepend($('<div class="select-title">Civstat</div>'));
        });
    selectNchild
        .dimension(nchildDim)
        .group(nchildGrouped)
        .multiple(true)
        .controlsUseVisibility(true).on('postRender', function () {
        $('#select-nchild').prepend($('<div class="select-title"># Children</div>'));
    });
    selectOwnhome
        .dimension(ownHomeDim)
        .group(ownHomeGrouped)
        .multiple(true)
        .controlsUseVisibility(true)
        .on('renderlet', function () {
            $('#select-ownhome option.dc-select-option').each(function () {
                $(this).text(replaceSelectText($(this).text(), ownhome));
            });
        })
        .on('postRender', function () {
            $('#select-ownhome').prepend($('<div class="select-title">Own Home</div>'));
        });
    selectEdcat
        .dimension(edcatDim)
        .group(edcatGrouped)
        .multiple(true)
        .controlsUseVisibility(true)
        .on('renderlet', function () {
            $('#select-edcat option.dc-select-option').each(function () {
                $(this).text(replaceSelectText($(this).text(), edcat));
            });
        })
        .on('postRender', function () {
            $('#select-edcat').prepend($('<div class="select-title">Education</div>'));
        });
    selectHhtype
        .dimension(hhtypeDim)
        .group(hhtypeGrouped)
        .multiple(true)
        .controlsUseVisibility(true)
        .on('renderlet', function () {
            $('#select-hhtype option.dc-select-option').each(function () {
                $(this).text(replaceSelectText($(this).text(), hhtype));
            });
        })
        .on('postRender', function () {
            $('#select-hhtype').prepend($('<div class="select-title">Hhold Type</div>'));
        });
    selectUrban
        .dimension(urbanDim)
        .group(urbanGrouped)
        .multiple(true)
        .controlsUseVisibility(true)
        .on('renderlet', function () {
            $('#select-urban option.dc-select-option').each(function () {
                $(this).text(replaceSelectText($(this).text(), urban));
            });
        })
        .on('postRender', function () {
            $('#select-urban').prepend($('<div class="select-title">Urban</div>'));
        });
    selectCohab
        .dimension(cohabDim)
        .group(cohabGrouped)
        .multiple(true)
        .controlsUseVisibility(true)
        .on('renderlet', function () {
            $('#select-cohab option.dc-select-option').each(function () {
                $(this).text(replaceSelectText($(this).text(), cohab));
            });
        })
        .on('postRender', function () {
            $('#select-cohab').prepend($('<div class="select-title">Cohab</div>'));
        });
    selectEmp
        .dimension(empDim)
        .group(empGrouped)
        .multiple(true)
        .controlsUseVisibility(true)
        .on('renderlet', function () {
            $('#select-emp option.dc-select-option').each(function () {
                $(this).text(replaceSelectText($(this).text(), emp));
            });
        })
        .on('postRender', function () {
            $('#select-emp').prepend($('<div class="select-title">Employment</div>'));
        });
    selectUnemp
        .dimension(unempDim)
        .group(unempGrouped)
        .multiple(true)
        .controlsUseVisibility(true)
        .on('renderlet', function () {
            $('#select-unemp option.dc-select-option').each(function () {
                $(this).text(replaceSelectText($(this).text(), unemp));
            });
        })
        .on('postRender', function () {
            $('#select-unemp').prepend($('<div class="select-title">Unemployed</div>'));
        });
    selectEmpsp
        .dimension(empspDim)
        .group(empspGrouped)
        .multiple(true)
        .controlsUseVisibility(true)
        .on('renderlet', function () {
            $('#select-empsp option.dc-select-option').each(function () {
                $(this).text(replaceSelectText($(this).text(), empsp));
            });
        })
        .on('postRender', function () {
            $('#select-empsp').prepend($('<div class="select-title">Spouse Employment</div>'));
        });
    selectRushed
        .dimension(rushedDim)
        .group(rushedGrouped)
        .multiple(true)
        .controlsUseVisibility(true)
        .on('renderlet', function () {
            $('#select-rushed option.dc-select-option').each(function () {
                $(this).text(replaceSelectText($(this).text(), rushed));
            });
        })
        .on('postRender', function () {
            $('#select-rushed').prepend($('<div class="select-title">Rushed</div>'));
        });
    selectHealth
        .dimension(healthDim)
        .group(healthGrouped)
        .multiple(true)
        .controlsUseVisibility(true)
        .on('renderlet', function () {
            $('#select-health option.dc-select-option').each(function () {
                $(this).text(replaceSelectText($(this).text(), health));
            });
        })
        .on('postRender', function () {
            $('#select-health').prepend($('<div class="select-title">Health</div>'));
        });
    /**
     * Create Tooltip for Bad Case Select Menu (refer to page 29 of the MTUS user guide)
     */
    selectBadCase.on('renderlet', function () {
        $('#select-bad-case option.dc-select-option').each(function () {
                if ($(this).attr('value') in badcase)
                    $(this).attr('title', badcase[$(this).attr('value')]);
                else
                    $(this).attr('title', 'undefined');
                $(this).tooltip();
            }
        );
    });
    selectBadCase.on('postRender', function () {
        $('#select-bad-case').prepend($('<div class="select-title">Badcase</div>'));
    });
    /**
     * Conditional Grouped Activities, if the param has been provided via console, render it
     */
    if (params[0] && params[0]['groupedActivities'] === 1) {
        /**
         * Grouped Activities
         * @type {crossfilter.dimension|dc.baseMixin|*}
         * The Dimension doesn't really matter, as we can't sort on fake groups
         */
        var activities = ndx.dimension(function (d) {
            return d['gAct'];
        });

        var activitiesGroup = activities.groupAll().reduce(reduceAddActivity, reduceRemoveActivity, reduceInitialActivity).value();

        /**
         * Add a Record, if p does not have the key yet, create it
         * @param {Object} p - Filter Object
         * @param {Object} v - current object being evaluated
         * @returns {Object}
         */
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

        /**
         * Remove a Record
         * @param {Object} p - Filter Object
         * @param {Object} v - current object being evaluated
         * @returns {Object}
         */
        function reduceRemoveActivity(p, v) {
            v['gAct'].forEach(function (val, index) {
                p[index][0] -= val;
                p[index][1] -= 1;
            });
            return p;
        }

        /**
         * Initialize, empty because we add the keys dynamically
         * @returns {{}}
         */
        function reduceInitialActivity() {
            return {};
        }

        /**
         * Group all the activities and calculate the average, push into array
         * @returns {Array}
         */
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
        var activityGroupPieChart = dc.pieChart('#groupedActivities');
        /**
         * Grouped Activities Pie Chart
         */
        activityGroupPieChart
            .width(450)
            .height(230)
            .externalRadiusPadding(30)
            .dimension(activities)
            .group(activitiesGroup)
            .innerRadius(40)
            .externalLabels(20)
            .legend(dc.legend().x(250).y(0).gap(12).legendText(function (d) {
                if (d.name in activitiesCombined)
                    return activitiesCombined[d.name];
            }))
            .cx(120)
            .title(function (d) {
                return 'Average time spent: ' + d.value + '\n' + activitiesCombined[d.key];
            })
            .renderLabel(true);
        /**
         * Get Percentages for the Pie Chart
         */
        activityGroupPieChart.on('pretransition', function (chart) {
            // Get Percentages by calculating the Pie Slice
            chart.selectAll('text.pie-slice').text(function (d) {
                if ((d.endAngle - d.startAngle) < (5 * Math.PI / 180))
                    return '';
                return Math.round(dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100)) + '%';
            })
        });
        // Disable onClick handler since we can't filter on fake groups
        activityGroupPieChart.filter = function () {
        };

    }

    /**
     * Conditional Heatmap, if the param has been provided via console, render it
     */
    if (params[0] && params[0]['heatmap'] === 1) {
        //The dimension doesnt really matter, since you won't be able to filter on it.
        var heatDim = ndx.dimension(function (d) {
            return [d['day'], d['main']];
        });
        var heatGroup = heatDim.groupAll().reduce(reduceAdd, reduceRemove, reduceInitial).value();

        /**
         *  Custom reduce functions, to work with arrays, activities are converted into the following:
         'day,main': [value,count]
         for example: 121: 10
         If a record gets added example:
         v['day'] = 1 && v['main'][21] = 10
         then
         p[121] = [10,1]
         If another gets added:
         v['day'] = 1 && v['main'][21] = 20
         then
         p[121] = [30,2]
         */
        /**
         * Add a record
         * @param {Object} p - Filter Object
         * @param {Object} v - the current record being evaluated
         * @returns {Object}
         */
        function reduceAdd(p, v) {
            v['main'].forEach(function (val, index) {
                //+1 since Activity 0 is not a thing, but the first index of the array is 0
                var key = concatenateNumber(v['day'],index + 1);
                if (!p[key])
                    p[key] = [val, 1];
                else {
                    p[key][0] += val;
                    p[key][1] += 1;
                }
            });
            return p;
        }

        /**
         * Remove a record
         * @param {Object} p - Filter Object
         * @param {Object} v - the current record being evaluated
         * @returns {Object}
         */
        function reduceRemove(p, v) {
            v['main'].forEach(function (val, index) {
                //+1 since Activity 0 is not a thing, but the first index of the array is 0
                var key = concatenateNumber(v['day'],index + 1);
                p[key][1] -= 1;
                p[key][0] -= val;
            });
            return p;
        }

        /**
         * Initialize, empty because we add the keys dynamically
         * @returns {{}}
         */
        function reduceInitial() {
            return {};
        }

        /**
         * Group all selected records, extract the activity and day from the Key
         * and calculate the average, push into an array
         * @returns {Array}
         */
        heatGroup.all = function () {
            var newObject = [];
            for (var key in this) {
                if (this.hasOwnProperty(key) && key != 'all') {
                    /*
                        Get the number of Digits from the key i.e. 123 = 3
                        Then Splice the number so we can split day and activity
                     */
                    var digits = getNumberOfDigits(+key);
                    var activity = digits < 3 ? key % 10 : key % 100;
                    var day = digits < 3 ? Math.floor(key / 10) % 10 : Math.floor(key / 100) % 100;
                    var avg = 0;
                    if (this[key][1] > 0)
                        avg = Math.round(this[key][0] / this[key][1]);
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
            .colors(d3.scale.linear().range(['white', 'darkgreen']))
            .title(function (d) {
                return 'Avg: ' + (d.avg);
            })
            .rowsLabel(function (d) {
                if (d in day)
                    return day[d];
            })
            .xBorderRadius(2)
            .yBorderRadius(2)
            .calculateColorDomain()
            .on('pretransition', function () {
                $('.heatmap').attr('transform', 'translate(60,10)');
            });

        /**
         *   Disable the filter function
         */
        heatMap.filter = function () {
        };

        /**
         *   Create the tooltips for all activities
         */
        heatMap.on('renderlet', function () {
            $('#heatmap g > g > text').each(function () {
                    if ($(this).text() in actToolTip) {
                        $(this).attr('title', actToolTip[$(this).text()]);
                        $(this).tooltip();
                    }
                }
            );
        });
    }
    /**
     * Download as CSV
     */
    d3.select('#download')
        .on('click', function () {
            var data = years.top(Infinity);
            var objects = [];
            //Reverse the replaced data, find by key (thanks underscore.js)
            data.forEach(function (d) {
                d['countrya'] = parseInt((_.invert(countrya))[d['countrya']]);
                /*
                    create the Object according to initial data ordering, else the CSV could have random column ordering
                    Exporting directly to CSV results in random column ordering
                 */
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
    //Finally render all the charts
    dc.renderAll();
}

/**
 * Concatenate 2 Numbers
 * This is used to create the keys for the Heatmap dynamically
 * Number1 is the day and Number2 is the activity
 * So day:1 & activity22 becomes 122 instead of 23
 * @param {number} a - the first number to concatenate
 * @param {number} b - the 2nd number to concatenate
 * @returns {number}
 */
function concatenateNumber(a,b) {
    return parseInt(String(a) + String(b))
}

/**
 * Calculate the #Digits a number has
 * This is used to split the keys for the Heatmap again into day & activity
 * The first digit is the day and the remaining digits are the activity
 * So 134 would be day:1 & activity:34
 * @param {number} Number
 * @returns {number}
 */
function getNumberOfDigits(Number) {
    return Math.floor(Math.log10(Number)) + 1;
}