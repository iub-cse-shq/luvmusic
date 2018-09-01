var np = require('numpy-js');
var sqrt = require('math-js');
var plt = require('plotly');
var array = require('numpy-js');
var pd = require('pandas-js');
var kMeans = require('kmeans-js');

//Load and parse the data
var data = pd.readCSV('datasets.csv');
data.take(2);

//Make a list from every line
var data = data.map(function(x) {return x.split('\t')});
var header = data.first();

//Clean data
var data2 = data.filter(function(line) {return line!=header});
console.log("Length of uncleaned data: " + toString(data2.count()));
data2.first();

//Filter the data
var data3 = data2.filter(function(x) {return x[4].length === 1 && x[5].length > 1});
data3.count();

//Encode the data
var title = ["Sawaali si raat", "Cholo Brishtite Bhiji", "Take a lool around"];
var artist = ["Arijit Singh", "Habib and Sabina Yasmin", "Limp Bizkit"];

function mapr1(key) {
    return title[key];
}

function mapr2(key) {
    return artist[key];
}

var data4 = data3.map(function(x){return [mapr1(x[4]), float(x[5]), mapr2(x[6])]});
data4.count();

//Clustering the data
function error(point) {
    var center = clusters.centers[clusters.predict(point)];
    var centroid = point - center;
    var total = 0;
    for (var i = 0; i < centroid; i++) {
        total += Math.pow(i, 2);
    }
    return total;
}

var 