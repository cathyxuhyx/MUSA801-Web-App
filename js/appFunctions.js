/* ================================
Week 6 Assignment: Midterm Functions + Signatures
================================ */
//Leaflet Configuration
var map = L.map('map', {
  center: [30.266926, -97.750519],
  zoom: 13
});

var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

//define variables and dataset links
var dataset = "https://raw.githubusercontent.com/cathyxuhyx/MUSA801-Web-App/master/data/js_test1.csv";
var bldgarea = "https://raw.githubusercontent.com/cathyxuhyx/MUSA801-Web-App/master/data/BA.csv";
var freq = "https://raw.githubusercontent.com/cathyxuhyx/MUSA801-Web-App/master/data/FQ.csv";
var landuse = "https://raw.githubusercontent.com/cathyxuhyx/MUSA801-Web-App/master/data/LU.csv";
var cbd_data = "https://raw.githubusercontent.com/cathyxuhyx/MUSA801-Web-App/master/data/cbd.geojson";
var ut_data = "https://raw.githubusercontent.com/cathyxuhyx/MUSA801-Web-App/master/data/ut.geojson";
var nhood_data = "https://raw.githubusercontent.com/cathyxuhyx/MUSA801-Web-App/master/data/nhood.geojson";
var hotline_data = "https://raw.githubusercontent.com/cathyxuhyx/MUSA801-Web-App/master/data/hotlines.geojson";
var hotline_trend_data = "https://raw.githubusercontent.com/cathyxuhyx/MUSA801-Web-App/master/data/route_js.json";
var routes_data = "https://raw.githubusercontent.com/cathyxuhyx/MUSA801-Web-App/master/data/routes.geojson";
var markers, markers_ba,markers_lu,markers_fq, realmarkers, realmarkers_lu,realmarkers_ba,realmarkers_fq,nhood, cbd, ut, newtmp, nhood_bound, tmp, hotlines, trends, routes;
var austin = [];
var ba = [];
var fq = [];
var lu = [];

color_ridership = chroma.scale('YlGnBu').colors(6);
//define colors or size of the individual marker with respect to covid 19 cases
var myStyle = function(row) {
  var mean_on, residential, commercial, building_area, diff;
  if(row.length >37){
    mean_on = Number(row[row.length - 1]).toFixed(2);
    residential = Number(row[39]).toFixed(3);
    commercial = Number(row[33]).toFixed(3);
    building_area = Number(row[31]).toFixed(3);
    if (mean_on < 125) {
      return {color: color_ridership[1],
              opacity: 0.6,
              weight: 5,
              fillColor: color_ridership[1],
              radius: 3,
              stop_id: row[2],
              mean_on: mean_on,
              residential: residential,
              commercial: commercial,
              building_area: building_area};
    } else if (mean_on >= 125 && mean_on < 250) {
      return {color: color_ridership[2],
              opacity: 0.6,
              weight: 5,
              fillColor: color_ridership[2],
              radius: 3,
              stop_id: row[2],
              mean_on: mean_on,
              residential: residential,
              commercial: commercial,
              building_area: building_area};
    } else if (mean_on >= 250 && mean_on < 300)   {
      return {color: color_ridership[3],
              opacity: 0.6,
              weight: 5,
              fillColor: color_ridership[3],
              radius: 3,
              stop_id: row[2],
              mean_on: mean_on,
              residential: residential,
              commercial: commercial,
              building_area: building_area};
    } else if (mean_on >= 300 && mean_on < 400) {
      return {color: color_ridership[4],
              opacity: 0.6,
              weight: 5,
              fillColor: color_ridership[4],
              radius: 3,
              stop_id: row[2],
              mean_on: mean_on,
              residential: residential,
              commercial: commercial,
              building_area: building_area};
    } else if (mean_on >= 400) {
      return {color: color_ridership[5],
              opacity: 0.6,
              weight: 5,
              fillColor: color_ridership[5],
              radius: 3,
              stop_id: row[2],
              mean_on: mean_on,
              residential: residential,
              commercial: commercial,
              building_area: building_area};
    } else {
      return {color: "transparent",
              opacity: 0,
              weight: 5,
              fillColor: "transparent",
              radius: 3,
              stop_id: row[2],
              mean_on: mean_on,
              residential: residential,
              commercial: commercial,
              building_area: building_area};
    }
  } else {
    diff = Number(row[36]).toFixed(3);
    residential = Number(row[6]).toFixed(3);
    commercial = Number(row[5]).toFixed(3);
    building_area = Number(row[3]).toFixed(3);
    mean_on = Number(row[34]).toFixed(3);
    if (diff < -33) {
      return {color: color_ridership[1],
              opacity: 0.6,
              weight: 5,
              fillColor: color_ridership[1],
              radius: 3,
              stop_id: row[2],
              mean_on: mean_on,
              change: diff,
              residential: residential,
              commercial: commercial,
              building_area: building_area};
    } else if (diff >=-33 && diff < 4 && diff != 0 ) {
      return {color: color_ridership[2],
              opacity: 0.6,
              weight: 5,
              fillColor: color_ridership[2],
              radius: 3,
              stop_id: row[2],
              mean_on: mean_on,
              change: diff,
              residential: residential,
              commercial: commercial,
              building_area: building_area};
    } else if (diff >=4 && diff < 42) {
      return {color: color_ridership[3],
              opacity: 0.6,
              weight: 5,
              fillColor: color_ridership[3],
              radius: 3,
              mean_on: mean_on,
              change: diff,
              residential: residential,
              commercial: commercial,
              building_area: building_area};
    } else if (diff >= 42 && diff < 80) {
      return {color: color_ridership[4],
              opacity: 0.6,
              weight: 5,
              fillColor: color_ridership[4],
              radius: 3,
              stop_id: row[2],
              mean_on: mean_on,
              change: diff,
              residential: residential,
              commercial: commercial,
              building_area: building_area};
    } else if (diff >= 80) {
      return {color: color_ridership[5],
              opacity: 0.6,
              weight: 5,
              fillColor: color_ridership[5],
              radius: 3,
              stop_id: row[2],
              mean_on: mean_on,
              change: diff,
              residential: residential,
              commercial: commercial,
              building_area: building_area};
    } else if (diff == 0){
      return {color: "#dadada",
              opacity: 0.3,
              weight: 5,
              fillColor: "#dadada",
              radius: 2,
              stop_id: row[2],
              mean_on: mean_on,
              change: diff,
              residential: residential,
              commercial: commercial,
              building_area: building_area};
    } else {
      return {color: "transparent",
              opacity: 0,
              weight: 5,
              fillColor: "transparent",
              radius: 3,
              stop_id: row[2],
              mean_on: mean_on,
              change: diff,
              residential: residential,
              commercial: commercial,
              building_area: building_area};
            }
          }
  };


//function to plot the locations
var makeMarkers = function (data) {
  addmarker = _.map(_.rest(data), function (row) {
    lat = Number(row[1]);
    lng = Number(row[0]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return L.circleMarker([lat, lng], myStyle(row));}
});
  return addmarker;
};

// and puts them on the map
var plotMarkers = function (marker) {
  _.each(marker, function (x){
    if (typeof(x) !== "undefined") {return x.addTo(map); }
  });
};

// Remove markers
var removeMarkers = function (marker) {
  _.each(marker, function (x){
    if (typeof(x) !== "undefined") {return map.removeLayer(x);}
  });
};

//show results
var showResults = function() {
  $('#intro').hide();
  $('#stops').show();
};

//close results and return to original state
var closeResults = function() {
  $('#intro').show();
  $('#stops').hide();
  map.setView( [30.266926, -97.750519], 13);
};

var clearScenarios = function(){
  document.getElementById("glance").checked = false;
  myScenarioValue = undefined;
  removeMarkers(realmarkers_ba);
  removeMarkers(realmarkers_fq);
  removeMarkers(realmarkers_lu);
  plotMarkers(realmarkers);
  zoomin(realmarkers);
  scenariosList[0].selectize.clearOptions();
  $(".sce-legend").hide();
  $(".legend").show();
  map.setView( [30.266926, -97.750519], 13);
};

var t;
//change side bar information with respect to each country
var eachFeatureFunction = function(marker) {
  if (typeof(marker) != "undefined") {
    marker.on('click', function(event) {
      t=event.target.options.mean_on;
      $("#stop-name").text(event.target.options.stop_id);
      $("#stop-boarding").text(parseFloat(event.target.options.mean_on).toFixed(2));
      $("#stop-commercial").text(parseFloat(event.target.options.commercial*100).toFixed(2));
      $("#stop-residential").text(parseFloat(event.target.options.residential*100).toFixed(2));
      $("#stop-building").text(parseFloat(event.target.options.building_area).toFixed(2));
      $("#delta").hide();
      showResults();

      //highlight the stop;
      if (typeof(newtmp) != "undefined"){
        map.removeLayer(newtmp);
      }
      //zoom in to the selected region
      tmp = event.target;
      newtmp = L.circleMarker(tmp._latlng, {radius: 12, color: "red"});
      newtmp.addTo(map);
      map.fitBounds([[tmp._latlng.lat-0.003, tmp._latlng.lng-0.003],
        [tmp._latlng.lat+0.003, tmp._latlng.lng+0.003]]);

    });
  }
};

var eachFeatureFunction_sce = function(marker) {
  if (typeof(marker) != "undefined") {
    marker.on('click', function(event) {
      $("#stop-name").text(event.target.options.stop_id);
      $("#stop-boarding").text(parseFloat(event.target.options.mean_on).toFixed(2));
      $("#stop-commercial").text(parseFloat(event.target.options.commercial*100).toFixed(2));
      $("#stop-residential").text(parseFloat(event.target.options.residential*100).toFixed(2));
      $("#stop-building").text(parseFloat(event.target.options.building_area).toFixed(2));
      $("#change").text(parseFloat(event.target.options.change).toFixed(2));
      $("#delta").show();
      //console.log(event.target.options.change);
      showResults();
      //highlight the stop;
      if (typeof(newtmp) != "undefined"){
        map.removeLayer(newtmp);
      }
      //zoom in to the selected region
      tmp = event.target;
      newtmp = L.circleMarker(tmp._latlng, {radius: 12, color: "red"});
      newtmp.addTo(map);
      map.fitBounds([[tmp._latlng.lat-0.003, tmp._latlng.lng-0.003],
        [tmp._latlng.lat+0.003, tmp._latlng.lng+0.003]]);

    });
  }
};


//zoom in to each markers
//click event for each marker
var zoomin = function(markers) {
  _.each(markers, function(marker){
    eachFeatureFunction(marker);});
  $("#return").click(function() {
  closeResults();
  map.removeLayer(newtmp);
});
};
var zoomin_sce = function(markers) {
  _.each(markers, function(marker){
    eachFeatureFunction_sce(marker);});
  $("#return").click(function() {
  closeResults();
  map.removeLayer(newtmp);
});
};


// click on each route
var newRoute, newRoute_b, route_layer;
var hoverRoute = function(routedata){
  routedata.on('click', function(e) {
      if (typeof(newRoute) !== "undefined"){
        map.removeLayer(newRoute);
        map.removeLayer(newRoute_b);
      }
      route_layer = e.target;
      newRoute = L.geoJSON(route_layer.feature.geometry, {
        color: "#fff6cf",
        weight: 9});
      newRoute_b = L.geoJSON(route_layer.feature.geometry, {
        color: "#FDCE07",
        weight: 12});
      map.addLayer(newRoute_b);
      map.addLayer(newRoute);
      var route_box = turf.bbox(route_layer.feature.geometry);
      map.fitBounds([[route_box[1],route_box[0]-0.1],[route_box[3],route_box[2]]]);
      var n = route_layer.feature.properties.ROUTE_ID;
      $('#chart').show();
      drawCharts(trends, n);

  });
};

// add hotline charts function
var drawCharts = function(trends, n){
  title = `Route ${n} Daily Ridership Summary`;
  var chart = bb.generate({
    title: {text: title,padding: {bottom: 30}},
    size: {height: 200,width: 300},
    data: {
      columns: [["mean passenger load"].concat(trends[n]["mean_load"])],
      types: {'mean passenger load': "area-spline"},
      colors: {'mean passenger load':"#FDCE07"}
    },
    point: {show: false},
    area: {linearGradient: true},
    zoom: {enabled: true},
    tooltip: {linked: true},
    axis: {
      x: {tick: {outer: false,show: false,text: {show: false}}},
      y: {tick: {outer: false,show: true,stepSize: 5}}
    },
    line: {classes: ["line-class-data1"]},
    grid: {x: {show: false},y: {show: false}},
    bindto: "#chart1"
  });

  var chart2 = bb.generate({
    size: {height: 200, width: 300},
    data: {
      columns: [
        ["mean boarding"].concat(trends[n]["mean_on"]),
        ["mean alighting"].concat(trends[n]["mean_off"])
      ],
      types: {'mean boarding': "area", 'mean alighting': "area"},
      colors: {'mean boarding': "#2166ac", 'mean alighting': "#ef8a62"},
    },
    point: {show: false},
    area: {linearGradient: true},
    zoom: {enabled: true},
    tooltip: {linked: true},
    axis: {
      x: {
        label: {position: "outer-center",text: "Stop Sequence ID",},
        tick: {count: 5,outer: false,show: true}
      },
      y: {tick: {outer: false,show: true,stepSize: 3}}
    },
    line: {classes: ["line-class-data1","line-class-data1"]},
    grid: {x: {show: false}, y: {show: false}},
    bindto: "#chart2"
  });
};

// function to draw average ridership
var drawCharts2 = function(){
  var chart3 = bb.generate({
  title: {text:"Average Daily Boarding by Different Regions"},
  data: {
    columns: [
	["CBD", 325],
	["UT Austin", 373],
	["Rest of Austin", 294]
    ],
    type: "bar",
    colors: {
      'CBD': color_ridership[3],
      'UT Austin': color_ridership[5],
      'Rest of Austin': color_ridership[2]
    },
    labels: {colors: "white", centered: true}
  },
  bar: {padding: 20, radius: {ratio: 0.3}},
  tooltip: {show: false},
  axis: {
    x: {tick: {outer: false, show: false, text: {show: false}}},
    y: {tick: {outer: false}}
  },
  bindto: "#chart3"
});
};

//run the analysis by start the request of the dataset
$(document).ready(function() {

  //read all routes dataset
  $.ajax(routes_data).done(function(data) {
    routes = JSON.parse(data);
    routes = L.geoJSON(routes, {
      "color": "#bfe4e6",
      "weight": 3,
      "opacity": 0.5});
    map.addLayer(routes);
  });

  //read ridership data
  $.ajax(dataset).done(function(data) {
    //parse the csv file
    var rows = data.split("\n");
    for (var i=0;i<rows.length;i=i+1){
        austin.push(rows[i].split(','));}
    //make markers and plot them
    markers = makeMarkers(austin);
    realmarkers = _.filter(markers, function(marker){
      return typeof(marker) != "undefined";});
      //plotMarkers(realmarkers);
    });

    //show Legend
    $(".legend").append(`<b>2019 Average Daily Boarding per Stop&nbsp</b>
    <span class = "dot" style="background-color:${color_ridership[1]}"></span>
    <a> < 125&nbsp</a>
    <span class = "dot" style="background-color:${color_ridership[2]}"></span>
    <a> 125-250&nbsp</a>
    <span class = "dot" style="background-color:${color_ridership[3]}"></span>
    <a> 250-300&nbsp</a>
    <span class = "dot" style="background-color:${color_ridership[4]}"></span>
    <a> 300-400&nbsp</a>
    <span class = "dot" style="background-color:${color_ridership[5]}"></span>
    <a> > 400</a>`);

    $(".sce-legend").append(`<b>Changes of Average Daily Boarding per Stop&nbsp</b>
    <span class = "dot" style="background-color:${"#dadada"}"></span>
    <a> = 0</a>
    <span class = "dot" style="background-color:${color_ridership[1]}"></span>
    <a> < -33&nbsp</a>
    <span class = "dot" style="background-color:${color_ridership[2]}"></span>
    <a> -33-4&nbsp</a>
    <span class = "dot" style="background-color:${color_ridership[3]}"></span>
    <a> 4-42&nbsp</a>
    <span class = "dot" style="background-color:${color_ridership[4]}"></span>
    <a> 42-80&nbsp</a>
    <span class = "dot" style="background-color:${color_ridership[5]}"></span>
    <a> > 80</a>`);

  //read neighborhood dataset
  $.ajax(nhood_data).done(function(data) {
    var nhood_parse = turf.lineToPolygon(JSON.parse(data));
    nhood_bound = turf.bbox(nhood_parse);
    //make geojson layer
    nhood = L.geoJSON(nhood_parse, {
      "color": color_ridership[2],
      "fillcolor": color_ridership[2],
      "weight": 0,
      "opacity": 0.5,
      "fillOpacity": 0.5});
  });

  //read cbd dataset
  $.ajax(cbd_data).done(function(data) {
    var cbd_parse = turf.lineToPolygon(JSON.parse(data));
    //make geojson layer
    cbd = L.geoJSON(cbd_parse, {
      color: color_ridership[3],
      fillcolor: color_ridership[3],
      weight: 0,
      opacity: 0.5,
      fillOpacity: 0.7});
  });

  //read ut dataset
  $.ajax(ut_data).done(function(data) {
    var ut_parse = turf.lineToPolygon(JSON.parse(data));
    //make geojson layer
    ut = L.geoJSON(ut_parse, {
      "color": color_ridership[5],
      "fillcolor": color_ridership[5],
      "weight": 0,
      "opacity": 0.5,
      "fillOpacity": 0.7});
  });

  //read hotline dataset
  $.ajax(hotline_data).done(function(data) {
    var route_parse = JSON.parse(data);
    //make geojson layer
    hotlines = L.geoJSON(route_parse, {
      "color": "#FDCE07",
      "weight": 9});
    //hover event for each line
    _.each(hotlines._layers, function(route){
      hoverRoute(route);});
  });

  //read hotline trend dataset
  $.ajax(hotline_trend_data).done(function(data) {
    trends = JSON.parse(data);
  });
});


// switches
// switch ridership by stops
document.getElementById("glance").onchange = function () {
    if (this.checked == true) {
        $(".sce-legend").hide();
        plotMarkers(realmarkers);

        //click event for each marker
        zoomin(realmarkers);

        $(".legend").show();
        map.setView([30.266926, -97.750519], 13);
      }else {
        $(".legend").hide();
        removeMarkers(realmarkers);
      }
  };
//switch ridership by types
document.getElementById("dt").onchange = function () {
    if (this.checked == true) {
      map.addLayer(nhood);
      map.addLayer(cbd);
      map.addLayer(ut);
      map.setView([30.296926, -97.800519], 12);
      $('#chart_ridership').show();
      drawCharts2();
      $(".legend").hide();
      $(".sce-legend").hide();
      //map.fitBounds([[nhood_bound[1],nhood_bound[0]],[nhood_bound[3],nhood_bound[2]]]);
    }else {
      map.removeLayer(nhood);
      map.removeLayer(cbd);
      map.removeLayer(ut);
      $('#chart_ridership').hide();
      //map.setView([30.266926, -97.750519], 13);
    }};
//switch ridership by routes
document.getElementById("route").onchange = function () {
    if (this.checked == true) {
      map.addLayer(hotlines);
      $(".legend").hide();
      $(".sce-legend").hide();
      map.setView([30.286926, -97.750519], 12);
    }else {
      map.removeLayer(hotlines);
      $('#chart').hide();
      if (typeof(newRoute) !== "undefined"){
        map.removeLayer(newRoute);
        map.removeLayer(newRoute_b);
      }
    }};

// close buttons
document.getElementById("close").onclick = function(){
  $('#chart').hide();
  map.removeLayer(newRoute);
  map.removeLayer(newRoute_b);
  map.setView([30.266926, -97.750519], 12);
};

document.getElementById("chart_ridership").onclick = function(){
  $('#chart_ridership').hide();
  map.setView([30.266926, -97.750519], 12);
};


//scenarios plot markers
var scenarios = document.getElementById("select-scenario");
scenarios.onchange = function(){
  if (myScenarioValue === "LU"){
    console.log(event.target.value);
    removeMarkers(realmarkers);
    $.ajax(landuse).done(function(data) {
      //parse the csv file
      var rows = data.split("\n");
      for (var i=0;i<rows.length;i=i+1){
          lu.push(rows[i].split(','));}
      //make markers and plot them
      markers_lu = makeMarkers(lu);
      realmarkers_lu = _.filter(markers_lu, function(marker){
        return typeof(marker) != "undefined";});
        plotMarkers(realmarkers_lu);
        //click event for each marker
        zoomin_sce(realmarkers_lu);
        $(".legend").hide();
        $(".sce-legend").show();
        map.setView([30.326926, -97.750519], 11);
        // console.log(markers_lu);
        // console.log(realmarkers_lu);
      });
  }else if (myScenarioValue == "BA") {
    removeMarkers(realmarkers);
    $.ajax(bldgarea).done(function(data) {
      //parse the csv file
      var rows = data.split("\n");
      for (var i=0;i<rows.length;i=i+1){
          ba.push(rows[i].split(','));}
      //make markers and plot them
      markers_ba = makeMarkers(ba);
      realmarkers_ba = _.filter(markers_ba, function(marker){
        return typeof(marker) != "undefined";});
       plotMarkers(realmarkers_ba);
       //click event for each marker
       zoomin_sce(realmarkers_ba);
       $(".legend").hide();
       $(".sce-legend").show();
       map.setView([30.326926, -97.750519], 11);
       // console.log(markers_ba);
       // console.log(realmarkers_ba);
     });
  }else if (myScenarioValue == "FQ") {
    removeMarkers(realmarkers);
    $.ajax(freq).done(function(data) {
      //parse the csv file
      var rows = data.split("\n");
      for (var i=0;i<rows.length;i=i+1){
          fq.push(rows[i].split(','));}
      //make markers and plot them
      markers_fq = makeMarkers(fq);
      realmarkers_fq = _.filter(markers_fq, function(marker){
        return typeof(marker) != "undefined";});
        plotMarkers(realmarkers_fq);
        //click event for each marker
        zoomin_sce(realmarkers_fq);
        $(".legend").hide();
        $(".sce-legend").show();
        map.setView([30.326926, -97.750519], 11);
        // console.log(markers_fq);
        // console.log(realmarkers_fq);
      });
  }
  // else{
  //   plotMarkers(realmarkers);
  // }
};

//scenarios selections
$("#OG").click(function() {
  clearScenarios();
});


var scenariosList = $('#select-scenario').selectize({
  create: true,
  sortField: {
    field: 'text',
    direction: 'asc'
  },
  dropdownParent: 'body',
  onChange: function(id){
    myScenarioValue = id;
  }
});
var myScenarioValue;
var myFieldValue;
var myList;
var features = $('#select-feature').selectize({
      create: true,
      sortField: {
        field: 'text',
        direction: 'asc'
      },
      dropdownParent: 'body',
      onChange: function(id){
        console.log(myList);
        scenariosList[0].selectize.removeOption(scenariosList[0].selectize.getValue());
        if(id == "BA"){
          myList = {disabled: false, text: "Building areas Increase 400,000 sqft", value: "BA"};
        }else if (id == "LU"){
            myList = {disabled: false, text:"Commercial and Residential exchange by 10%" , value: "LU"};
        }else if (id == "FQ"){
          myList = {disabled: false, text: "Feeder Routes to High Frequency", value: "FQ"};
        }else{
          myList = {disabled: false, text: "Select a scenario...", value: "0"};
        }
        scenariosList[0].selectize.addOption(myList);
        console.log(scenariosList[0].selectize)
       }
    });
