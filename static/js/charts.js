/**
 * @Author: David Haas
 * @Date: 22.01.2018
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
 * @param {error} e
 * @param {json} json
 * @param {json} geoJson
 * @param {json} params
 * This function is used to create the whole Visualisation
 */
function buildVisualisation(e, json, geoJson, params) {
    console.log(e);
    /**
     *
     * @type {json}
     */
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
            if (workhrsBin >= 100) {
                d['workhrsBin'] = '100+';
            }
            else {
                d['workhrsBin'] = workhrsBin + ' - ' + (workhrsBin + 19);
            }
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
    var ageDim = ndx.dimension(function (d) {
        return d['ageFix'];
    });

    /**
     * Barchart Workhrs distribution
     * @type {crossfilter.dimension|dc.baseMixin|*}
     */
    var workhrsDim = ndx.dimension(function (d) {
        return d['workhrsBin'];
    });

    /**
     * Barchart famstat
     * @type {crossfilter.dimension|dc.baseMixin|*}
     */
    var famstatDim = ndx.dimension(function (d) {
        return d['famstatFix'];
    });

    /*
        Select Menu Dimensions
    */
    var sexDim = ndx.dimension(function (d) {
        return d['sex'];
    });
    var badcaseDim = ndx.dimension(function (d) {
        return d['badcase'];
    });
    var retiredDim = ndx.dimension(function (d) {
        return d['retired'];
    });
    var studentDim = ndx.dimension(function (d) {
        return d['student'];
    });
    var computerDim = ndx.dimension(function (d) {
        return d['computer'];
    });
    var vehicleDim = ndx.dimension(function (d) {
        return d['vehicle'];
    });
    var hhldsizeDim = ndx.dimension(function (d) {
        return d['hhldsize'];
    });
    var sectorDim = ndx.dimension(function (d) {
        return d['sector'];
    });
    var singparDim = ndx.dimension(function (d) {
        return d['singpar'];
    });
    var civstatDim = ndx.dimension(function (d) {
        return d['civstat'];
    });
    var citizenDim = ndx.dimension(function (d) {
        return d['citizen'];
    });
    var empstatDim = ndx.dimension(function (d) {
        return d['empstat'];
    });
    var nchildDim = ndx.dimension(function (d) {
        return d['nchild'];
    });
    var ownHomeDim = ndx.dimension(function (d) {
        return d['ownhome'];
    });
    var edcatDim = ndx.dimension(function (d) {
        return d['edcat'];
    });
    var hhtypeDim = ndx.dimension(function (d) {
        return d['hhtype'];
    });
    var urbanDim = ndx.dimension(function (d) {
        return d['urban'];
    });
    var cohabDim = ndx.dimension(function (d) {
        return d['cohab'];
    });
    var empDim = ndx.dimension(function (d) {
        return d['emp'];
    });
    var unempDim = ndx.dimension(function (d) {
        return d['unemp'];
    });
    var empspDim = ndx.dimension(function (d) {
        return d['empsp'];
    });
    var rushedDim = ndx.dimension(function (d) {
        return d['rushed'];
    });
    var healthDim = ndx.dimension(function (d) {
        return d['health'];
    });

    /**
     * Define the type of dc.js Chart and the corresponding HTML tag
     */
    var totalRecords = dc.numberDisplay('#total-records');
    var timeChart = dc.barChart('#timeChart');
    var chloropleth = dc.geoChoroplethChart('#chloropleth');
    var occupationPieChart = dc.pieChart('#occupation-piechart');


    /**
     * Build the bar charts and select menus
     */
    barChartBuilder(ageDim,'#age',4);
    barChartBuilder(days,'#day',4);
    barChartBuilder(workhrsDim,'#workhrs',2);
    barChartBuilder(famstatDim,'#famstat',2);
    selectChartBuilder(sexDim, '#select-sex', 'Sex', sex);
    selectChartBuilder(retiredDim, '#select-retired', 'Retired', retired);
    selectChartBuilder(studentDim, '#select-student', 'Student', student);
    selectChartBuilder(computerDim, '#select-computer', 'Computer', computer, true);
    selectChartBuilder(vehicleDim, '#select-vehicle', 'Vehicle', vehicle, true);
    selectChartBuilder(hhldsizeDim, '#select-hhldsize', 'Hhld Size', false, true);
    selectChartBuilder(sectorDim, '#select-sector', 'Sector', sector, true);
    selectChartBuilder(empstatDim, '#select-empstat', 'Emp. Status', empstat);
    selectChartBuilder(singparDim, '#select-singpar', 'Single Parent', singpar);
    selectChartBuilder(citizenDim, '#select-citizen', 'Citizen', citizen);
    selectChartBuilder(nchildDim, '#select-nchild', '# Children');
    selectChartBuilder(edcatDim, '#select-edcat', 'Education', edcat);
    selectChartBuilder(hhtypeDim, '#select-hhtype', 'Hhld Type', hhtype);
    selectChartBuilder(urbanDim, '#select-urban', 'Urban', urban);
    selectChartBuilder(cohabDim, '#select-cohab', 'Cohab', cohab);
    selectChartBuilder(ownHomeDim, '#select-ownhome', 'Own Home', ownhome);
    selectChartBuilder(civstatDim, '#select-civstat', 'Civstat', civstat);
    selectChartBuilder(empDim, '#select-emp', 'Employment', emp);
    selectChartBuilder(unempDim, '#select-unemp', 'Unemployed', unemp);
    selectChartBuilder(empspDim, '#select-empsp', 'Spouse Employment', empsp);
    selectChartBuilder(rushedDim, '#select-rushed', 'Rushed', rushed);
    selectChartBuilder(healthDim, '#select-health', 'Health', health);
    var selectBadCase = selectChartBuilder(badcaseDim, '#select-badcase', 'Badcase');
    tooltipBuilder(selectBadCase,'#select-badcase',badcase);

    /**
     *
     * @param {Object} dimension - ndx.dimension
     * @param {String} chartid - the chart id i.e. '#select-xyz'
     * @param {Number} ticks - how many ticks the x axis should display
     */
    function barChartBuilder(dimension, chartid, ticks) {
        if(!ticks) ticks = 4;
        var chart = dc.rowChart(chartid);
        chart
            .width(320)
            .height(200)
            .dimension(dimension)
            .elasticX(true)
            .group(dimension.group())
            .gap(1)
            .xAxis().ticks(ticks);
        chart.on('postRender', function (chart) {
            chart.svg().append('text').attr('class', 'x-axis-label').attr('text-anchor', 'middle').attr('x', chart.width() / 2).attr('y', chart.height())
                .text('Records');
        });
    }

    /**
     * All the different select Menus
     * The title is added via JQuery
     * The values are replaced by text using the replaceSelectText function
     *
     * @param {Object} dimension - ndx.dimension
     * @param {String} chartid - the chart id i.e. '#select-xyz'
     * @param {String} title - the title div above the select chart
     * @param {Object} mtus_var - the MTUS corresponding var to replace numbers with text, located in mtus_vars.js
     * @param {boolean} sort - if it should be sorted or not false for ascending order, true for descending
     * @returns {selectMenu}
     */
    function selectChartBuilder(dimension, chartid, title, mtus_var, sort) {
        var chart = dc.selectMenu(chartid);
        chart
            .dimension(dimension)
            .group(dimension.group())
            .multiple(true)
            .controlsUseVisibility(true)
            .on('postRender', function () {
                $(chartid).prepend($('<div class="select-title">' + title + '</div>'));
            });
        if (mtus_var) {
            chart.on('renderlet', function () {
                var string = chartid+ ' option.dc-select-option';
                $(string).each(function () {
                    $(this).text(replaceSelectText($(this).text(), mtus_var))
                })
            });
        }
        if (sort) {
            chart.order(function (a, b) {
                return a.key < b.key ? 1 : b.key < a.key ? -1 : 0;
            });
        }
        return chart;
    }

    /**
     *
     * Create Tooltip for Bad Case Select Menu (refer to page 29 of the MTUS user guide)
     *
     * @param {Object} chart - this is the chartobject created by selectChartBuilder function
     * @param {String} chartid - the chart id i.e. '#select-xyz'
     * @param {Object} mtus_var - the var to get the tooltip text from located in mtus_vars.js
     */
    function tooltipBuilder(chart, chartid, mtus_var) {
        chart.on('renderlet', function () {
            $(chartid + ' option.dc-select-option').each(function () {
                if ($(this).attr('value') in mtus_var)
                    $(this).attr('title', mtus_var[$(this).attr('value')]);
                else
                    $(this).attr('title', 'undefined');
                $(this).tooltip();
            })
        })
    }

    /**
     * All Records
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
     * Conditional Grouped Activities, if the param has been provided via console, render it
     */
    if (params[0] && parseInt(params[0]['groupedActivities']) === 1) {
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
            var obj = v['gAct'];
            for(var k in obj){
                if(!p[+k])
                p[+k] = {0:obj[+k],1:1}
                else{
                    p[k][0] += obj[+k];
                    p[k][1] += 1;
                }
            }
            return p;
        }
        /**
         * Remove a Record
         * @param {Object} p - Filter Object
         * @param {Object} v - current object being evaluated
         * @returns {Object}
         */
        function reduceRemoveActivity(p, v) {
            var obj = v['gAct'];
            for(var k in obj){
                p[+k][0] -= obj[+k];
                p[+k][1] -= 1;
            }
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
    if (params[0] && parseInt(params[0]['heatmap']) === 1) {
        //The dimension doesnt really matter, since you won't be able to filter on it.
        var heatDim = ndx.dimension(function (d) {
            return [d['day'], d['main']];
        });
        var heatGroup = heatDim.groupAll().reduce(reduceAdd, reduceRemove, reduceInitial).value();

        /**
         *  Custom reduce functions, to work with objects, activities are converted into the following:
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
            var obj = v['main'];
            for (var k in obj){
                var key = concatenateNumber(v['day'], +k);
                if (!p[key])
                    p[key] = {0: key, 1: 1};
                else {
                    p[key][0] += obj[k];
                    p[key][1] += 1;
                }

            }
            return p;
        }

        /**
         * Remove a record
         * @param {Object} p - Filter Object
         * @param {Object} v - the current record being evaluated
         * @returns {Object}
         */
        function reduceRemove(p, v){
            var obj = v['main'];
            for (var k in obj){
                var key = concatenateNumber(v['day'], +k);
                p[key][1] -= 1;
                p[key][0] -= obj[k];

            }
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
            $('#heatmap').find('g > g > text').each(function () {
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