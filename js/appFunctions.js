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
var bldgarea = "https://raw.githubusercontent.com/cathyxuhyx/MUSA801-Web-App/74171799c9982eaccc39fe9b7a1dfdee09b23bd9/data/BA.csv";
var freq = "https://raw.githubusercontent.com/cathyxuhyx/MUSA801-Web-App/74171799c9982eaccc39fe9b7a1dfdee09b23bd9/data/FQ.csv";
var landuse = "https://raw.githubusercontent.com/cathyxuhyx/MUSA801-Web-App/74171799c9982eaccc39fe9b7a1dfdee09b23bd9/data/LU.csv";
var cbd_data = "https://raw.githubusercontent.com/cathyxuhyx/MUSA801-Web-App/master/data/cbd.geojson";
var ut_data = "https://raw.githubusercontent.com/cathyxuhyx/MUSA801-Web-App/master/data/ut.geojson";
var nhood_data = "https://raw.githubusercontent.com/cathyxuhyx/MUSA801-Web-App/master/data/nhood.geojson";
var hotline_data = "https://raw.githubusercontent.com/cathyxuhyx/MUSA801-Web-App/master/data/hotlines.geojson";
var hotline_trend_data = "https://raw.githubusercontent.com/cathyxuhyx/MUSA801-Web-App/master/data/route_js.json";
var markers,markers_fq,markers_lu,markers_ba, realmarkers,realmarkers_lu,realmarkers_ba,realmarkers_fq, nhood, cbd, ut, newtmp, nhood_bound, tmp, hotlines, trends;
var austin = [];
var ba = [];
var fq = [];
var lu = [];

color_ridership = chroma.scale('YlGnBu').colors(6);
//define colors or size of the individual marker with respect to covid 19 cases
var myStyle = function(row) {
  mean_on = Number(row[row.length - 1]).toFixed(2);
  residential = Number(row[39]).toFixed(3);
  commercial = Number(row[33]).toFixed(3);
  building_area = Number(row[31]).toFixed(3);
  if (mean_on < 125) {
    return {color: color_ridership[1],
            opacity: 0.5,
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
            opacity: 0.5,
            weight: 5,
            fillColor: color_ridership[2],
            radius: 3,
            stop_id: row[2],
            mean_on: mean_on,
            residential: residential,
            commercial: commercial,
            building_area: building_area};
  } else if (mean_on >= 250 && mean_on < 300) {
    return {color: color_ridership[3],
            opacity: 0.5,
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
            opacity: 0.5,
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
            opacity: 0.5,
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
            building_area: building_area};}
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

//change side bar information with respect to each country
var eachFeatureFunction = function(marker) {
  if (typeof(marker) != "undefined") {
    marker.on('click', function(event) {
      $("#stop-name").text(event.target.options.stop_id);
      $("#stop-boarding").text(event.target.options.mean_on);
      $("#stop-commercial").text(event.target.options.commercial*100);
      $("#stop-residential").text(event.target.options.residential*100);
      $("#stop-building").text(event.target.options.building_area);
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

// hover on each route
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
//  $("#route-title").append(`<b>Route ${n} Ridership Summary</b>`);
  title = `Route ${n} Ridership Summary`;
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



//run the analysis by start the request of the dataset
$(document).ready(function() {

  //read ridership data
  $.ajax(dataset).done(function(data) {
    //parse the csv file
    var rows = data.split("\n");
    for (var i=0;i<rows.length;i=i+1){
        austin.push(rows[i].split(','));}
    console.log(austin);
    //make markers and plot them
    markers = makeMarkers(austin);
    realmarkers = _.filter(markers, function(marker){
      return typeof(marker) != "undefined";});
      plotMarkers(realmarkers);

    $.ajax(bldgarea).done(function(data) {
      //parse the csv file
      var rows = data.split("\n");
      for (var i=0;i<rows.length;i=i+1){
          ba.push(rows[i].split(','));}
      console.log(ba);
      //make markers and plot them
      markers_ba = makeMarkers(ba);
      console.log(markers_ba);
      realmarkers_ba = _.filter(markers_ba, function(marker){
        return typeof(marker) != "undefined";});
        console.log(realmarkers_ba);
        plotMarkers(markers_ba);

    $.ajax(freq).done(function(data) {
      //parse the csv file
      var rows = data.split("\n");
      for (var i=0;i<rows.length;i=i+1){
          ba.push(rows[i].split(','));}
      //make markers and plot them
      markers_fq = makeMarkers(fq);
      realmarkers_fq = _.filter(markers_fq, function(marker){
        return typeof(marker) != "undefined";});
        plotMarkers(realmarkers_fq);

    $.ajax(landuse).done(function(data) {
      //parse the csv file
      var rows = data.split("\n");
      for (var i=0;i<rows.length;i=i+1){
          ba.push(rows[i].split(','));}
      //make markers and plot them
      markers_lu = makeMarkers(lu);
      realmarkers_lu = _.filter(markers_lu, function(marker){
        return typeof(marker) != "undefined";});
        plotMarkers(realmarkers_lu);

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

    //click event for each marker
    _.each(markers, function(marker){
      eachFeatureFunction(marker);});

    $("#return").click(function() {
      closeResults();
      map.removeLayer(newtmp);
    });
  });});});});

  //read neighborhood dataset
  $.ajax(nhood_data).done(function(data) {
    var nhood_parse = turf.lineToPolygon(JSON.parse(data));
    nhood_bound = turf.bbox(nhood_parse);
    //make geojson layer
    nhood = L.geoJSON(nhood_parse, {
      "color": "#0069AB",
      "fillcolor": "#0069AB",
      "weight": 2,
      "opacity": 0.5,
      "fillOpacity": 0.2});
  });

  //read cbd dataset
  $.ajax(cbd_data).done(function(data) {
    var cbd_parse = turf.lineToPolygon(JSON.parse(data));
    //make geojson layer
    cbd = L.geoJSON(cbd_parse, {
      color: "#0069AB",
      fillcolor: "#0069AB",
      weight: 2,
      opacity: 0.5,
      fillOpacity: 0.2});
  });

  //read ut dataset
  $.ajax(ut_data).done(function(data) {
    var ut_parse = turf.lineToPolygon(JSON.parse(data));
    //make geojson layer
    ut = L.geoJSON(ut_parse, {
      "color": "#0069AB",
      "fillcolor": "#0069AB",
      "weight": 2,
      "opacity": 0.5,
      "fillOpacity": 0.2});
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
var first = document.getElementById("glance");
first.onchange = function () {
    if (this.checked == true) {
      plotMarkers(realmarkers);
    }else {
      removeMarkers(realmarkers);
    }};

var second = document.getElementById("dt");
second.onchange = function () {
    if (this.checked == true) {
      map.addLayer(nhood);
      map.addLayer(cbd);
      map.addLayer(ut);
      map.setView([30.266926, -97.750519], 12);
      //map.fitBounds([[nhood_bound[1],nhood_bound[0]],[nhood_bound[3],nhood_bound[2]]]);
    }else {
      map.removeLayer(nhood);
      map.removeLayer(cbd);
      map.removeLayer(ut);
      //map.setView([30.266926, -97.750519], 13);
    }};

var third = document.getElementById("route");
third.onchange = function () {
    if (this.checked == true) {
      map.addLayer(hotlines);
    }else {
      map.removeLayer(hotlines);
    }};

document.getElementById("close").onclick = function(){
  $('#chart').hide();
  map.removeLayer(newRoute);
  map.removeLayer(newRoute_b);
  map.setView([30.266926, -97.750519], 12);
};

$('#select-feature').selectize({
  create: true,
  sortField: {
    field: 'text',
    direction: 'asc'
  },
  dropdownParent: 'body'
});

$('#selct-scenario').selectize({
  create: true,
  sortField: {
    field: 'text',
    direction: 'asc'
  },
  dropdownParent: 'body'
});


$("#select-feature").change(function() {
  if ($(this).data('options') === undefined) {
    /*Taking an array of all options-2 and kind of embedding it on the select1*/
    $(this).data('options', $('#select-scenario option').clone());
  }
  var id = $(this).val();
  var options = $(this).data('options').filter('[value=' + id + ']');
  $('#select-scenario').html(options);
});
var scenarios = document.getElementById("select-scenario");
scenarios.onchange = function(){
  if (event.target.value === "LU"){
    removeMarkers(realmarkers);
    plotMarkers(realmarkers_lu);
  }else if (event.target.value == "BA") {
    removeMarkers(realmarkers);
    plotMarkers(realmarkers_ba);
  }else if (event.target.value == "FQ") {
    emoveMarkers(realmarkers);
    plotMarkers(realmarkers_fq);
  }else{
    plotMarkers(realmarkers);
  }
};
