/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8166666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "/login.php, user- 3-1"], "isController": false}, {"data": [1.0, 500, 1500, "/login.php, user- 2-1"], "isController": false}, {"data": [1.0, 500, 1500, "/login.php, user- 3-0"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "/index.php"], "isController": false}, {"data": [0.5, 500, 1500, "/logout.php"], "isController": false}, {"data": [1.0, 500, 1500, "/login.php"], "isController": false}, {"data": [1.0, 500, 1500, "/dashboard.php"], "isController": false}, {"data": [0.5, 500, 1500, "/login.php, user- 2"], "isController": false}, {"data": [0.5, 500, 1500, "/login.php, user- 3"], "isController": false}, {"data": [0.5, 500, 1500, "/login.php, user- 1"], "isController": false}, {"data": [1.0, 500, 1500, "/senerio.php"], "isController": false}, {"data": [1.0, 500, 1500, "/login.php, user- 1-1"], "isController": false}, {"data": [1.0, 500, 1500, "/login.php, user- 2-0"], "isController": false}, {"data": [1.0, 500, 1500, "/logout.php-0"], "isController": false}, {"data": [0.5, 500, 1500, "/login.php, user- 1-0"], "isController": false}, {"data": [1.0, 500, 1500, "/logout.php-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 30, 0, 0.0, 496.2, 289, 2052, 315.0, 852.8000000000001, 1487.1499999999992, 2052.0, 4.803843074459567, 24.421412129703764, 4.992431445156125], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/login.php, user- 3-1", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 16.440480025773198, 3.1109052835051547], "isController": false}, {"data": ["/login.php, user- 2-1", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 11.445405950956939, 2.1657259270334928], "isController": false}, {"data": ["/login.php, user- 3-0", 1, 0, 0.0, 314.0, 314, 314, 314.0, 314.0, 314.0, 314.0, 3.1847133757961785, 33.01963077229299, 3.433519108280255], "isController": false}, {"data": ["/index.php", 3, 0, 0.0, 1249.3333333333333, 842, 2052, 854.0, 2052.0, 2052.0, 2052.0, 0.7318858258111735, 2.6316441510124418, 0.5574911563796048], "isController": false}, {"data": ["/logout.php", 3, 0, 0.0, 610.3333333333334, 606, 618, 607.0, 618.0, 618.0, 618.0, 1.3966480446927374, 4.674588279795158, 2.2600056738826813], "isController": false}, {"data": ["/login.php", 3, 0, 0.0, 326.0, 300, 371, 307.0, 371.0, 371.0, 371.0, 1.293103448275862, 3.713042160560345, 1.0430697737068966], "isController": false}, {"data": ["/dashboard.php", 3, 0, 0.0, 297.0, 291, 306, 294.0, 306.0, 306.0, 306.0, 1.6375545851528384, 7.834355383460698, 1.3273147516375545], "isController": false}, {"data": ["/login.php, user- 2", 1, 0, 0.0, 717.0, 717, 717, 717.0, 717.0, 717.0, 717.0, 1.3947001394700138, 21.131613929567642, 2.7635220536959553], "isController": false}, {"data": ["/login.php, user- 3", 1, 0, 0.0, 606.0, 606, 606, 606.0, 606.0, 606.0, 606.0, 1.6501650165016502, 25.003867574257427, 3.2729347153465347], "isController": false}, {"data": ["/login.php, user- 1", 1, 0, 0.0, 1025.0, 1025, 1025, 1025.0, 1025.0, 1025.0, 1025.0, 0.975609756097561, 14.782774390243905, 1.9340701219512197], "isController": false}, {"data": ["/senerio.php", 3, 0, 0.0, 304.6666666666667, 296, 316, 302.0, 316.0, 316.0, 316.0, 1.6339869281045751, 4.228579452614379, 1.3276143790849673], "isController": false}, {"data": ["/login.php, user- 1-1", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 11.418089946300716, 2.160557130071599], "isController": false}, {"data": ["/login.php, user- 2-0", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 34.67286789297659, 3.5992370401337794], "isController": false}, {"data": ["/logout.php-0", 3, 0, 0.0, 309.0, 305, 316, 306.0, 316.0, 316.0, 316.0, 1.6339869281045751, 0.7755055147058824, 1.3228273080065358], "isController": false}, {"data": ["/login.php, user- 1-0", 1, 0, 0.0, 605.0, 605, 605, 605.0, 605.0, 605.0, 605.0, 1.6528925619834711, 17.13746126033058, 1.7804106404958677], "isController": false}, {"data": ["/logout.php-1", 3, 0, 0.0, 301.0, 289, 312, 302.0, 312.0, 312.0, 312.0, 1.638448935008192, 4.706273894046969, 1.3248395685417804], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 30, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
