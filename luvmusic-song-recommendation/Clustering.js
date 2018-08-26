var np = require('numpy-js');
var sqrt = require('math');
var plt = require('plotly');
var array = require('numpy-js');
var pd = require('pandas-js');
var ds = require('dstools');
var stats = require(‘simple-statistics’);
var KMeans = require(‘shaman’).KMeans;
var dataForge = require(‘data-forge’);
//var config = require(‘./config’);
var plotly = require(‘plotly’)(config.USERNAME, config.API_KEY);
var opn = require(‘opn’);

var kMeans = require('kmeans-js');

var data = ds.Collection().loadCSV('luvmusic-dataset.csv');

//Make a list from every line
data = data.map(function (x) { return x.split('\t')});
var header = data.first();

//Clean Data
var data2 = data.filter(function(line) {return line !== header});
console.log("Length of unclean data: ", data.count());

//Filter the data
var data3 = data2.filter(function(x) {return x[1].length >= 1 && x[2].length >= 6});
console.log(data3.count());

//Encode the data
var artistSongs= {"Unknown" : "Unknown", "Warfaze": "Onnoshomoy", "Warfaze": "Onnoshomoy" , "Warfaze": "Maharaj", "Warfaze": "Agami", "Warfaze": "Na", "Farhan Akhter": "Rock On", "Satyameva Jayate": "Dilbar Dilbar"};

//Define a mapper function
function mapr(key) {
    return artistSongs[key];
}

var data4 = data3.map(function(x) {return mapr(x[4])});
console.log(data4.count());

// Evaluate clustering by computing Within Set Sum of Squared Errors
function error(point) {
    var center = clusters.centers[clusters.predict(point)];
    var total =0;
    var centroid = point - center;
    for (var i = 0; i < centroid; i++) {
        total += Math.pow(i, 2);
    }
    return Math.sqrt(total);
}

//Cluster the data


