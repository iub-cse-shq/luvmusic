var array = require('numpy-js');
var plt = require('plotly-js');
var array = require('numpy-js');
var kMeans = require('kmeans-js');
var kMeansModel = require('kmeans-js');

//Load and parse the data
var data = pd.loadCSV('datasets.csv');
data.take(2);

//Make a list from every line
var data = data.map(function(x) {
   return x.split('\t');
});

//Cleaning data
var data2 = data.filter(function(line){
    return line !== header;
});

console.log(data2.count());

//Filter the data
var data3 = data2.filter(function(x){
    return x[1].length === 1 && x[2] > 1;
});

data3.count();

//Encode the data
var user = {'male': 0, 'female': 1};

//Define mapper function
function mapper(key) {
    return user[key];
}

var data4 = data3.map(function(x){
    return mapper[x]
});

//Cluster the data and calculating the mean squared error
function error (x) {
    var clusters, centers;
    var center = clusters.centers();
}