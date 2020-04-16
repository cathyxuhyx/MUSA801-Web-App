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
var dataset = "https://raw.githubusercontent.com/cathyxuhyx/MUSA_800_Austin-Bus-Network-Prediction/master/JS/js_test.csv";
var markers, realmarkers;

color_ridership = chroma.scale('YlGnBu').colors(6);
//define colors or size of the individual marker with respect to covid 19 cases
var myStyle = function(row) {
  mean_on = Number(row[row.length - 1]).toFixed(2);
  if (mean_on < 125) {
    return {color: color_ridership[1],
            opacity: 0.5,
            weight: 5,
            fillColor: color_ridership[1],
            radius: 3,
            stop_id: row[2],
            mean_on: mean_on};
  } else if (mean_on >= 125 && mean_on < 250) {
    return {color: color_ridership[2],
            opacity: 0.5,
            weight: 5,
            fillColor: color_ridership[2],
            radius: 3,
            stop_id: row[2],
            mean_on: mean_on};
  } else if (mean_on >= 250 && mean_on < 300) {
    return {color: color_ridership[3],
            opacity: 0.5,
            weight: 5,
            fillColor: color_ridership[3],
            radius: 3,
            stop_id: row[2],
            mean_on: mean_on};
  } else if (mean_on >= 300 && mean_on < 400) {
    return {color: color_ridership[4],
            opacity: 0.5,
            weight: 5,
            fillColor: color_ridership[4],
            radius: 3,
            stop_id: row[2],
            mean_on: mean_on};
  } else if (mean_on >= 400) {
    return {color: color_ridership[5],
            opacity: 0.5,
            weight: 5,
            fillColor: color_ridership[5],
            radius: 3,
            stop_id: row[2],
            mean_on: mean_on};
  } else {
    return {color: "transparent",
            opacity: 0,
            weight: 5,
            fillColor: "transparent",
            radius: 3,
            stop_id: row[2],
            mean_on: mean_on};}
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

var newtmp;

//change side bar information with respect to each country
var eachFeatureFunction = function(marker) {
  if (typeof(marker) != "undefined") {
    marker.on('click', function(event) {
      $("#stop-name").text(event.target.options.stop_id);
      $("#stop-boarding").text(event.target.options.mean_on);
      showResults();
      //zoom in to the selected region
      tmp = event.target;
      //highlight the stop;
      newtmp = L.circleMarker(tmp._latlng, {radius: 12, color: "red"});
      newtmp.addTo(map);

      map.fitBounds([[tmp._latlng.lat-0.003, tmp._latlng.lng-0.003],
        [tmp._latlng.lat+0.003, tmp._latlng.lng+0.003]]);
    });
  }
};

//run the analysis by start the request of the dataset
$(document).ready(function() {
  $.ajax(dataset).done(function(data) {

    //parse the csv file
    var rows = data.split("\n");
    austin = [];
    for (var i=0;i<rows.length;i=i+1){
        austin.push(rows[i].split(','));}

    //make markers and plot them
    markers = makeMarkers(austin);
    // find non-US markers
    realmarkers = _.filter(markers, function(marker){
      return typeof(marker) != "undefined";});

    plotMarkers(realmarkers);
    //see the highest riderships

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

var first = document.getElementById("dt");
first.onchange = function () {
    if (this.checked == true) {
        plotMarkers(realmarkers);
    }else {
        removeMarkers(realmarkers);
    }};

//click event for each marker
_.each(markers, function(marker){eachFeatureFunction(marker);});

$("#return").click(function() {
  closeResults();
  map.removeLayer(newtmp);
});

$('#select-feature').selectize({
  create: true,
  sortField: {
    field: 'text',
    direction: 'asc'
  },
  dropdownParent: 'body'
});

$('#select-scenario').selectize({
  create: true,
  sortField: {
    field: 'text',
    direction: 'asc'
  },
  dropdownParent: 'body'
});
