'use strict';

function getBarChart(dataArray, metaData) {
	var chartTitle = [];
	var xAxisTitle = [];
	var yAxisTitle = [];	
	chartTitle = metaData[0];
	xAxisTitle = metaData[1];
	yAxisTitle = metaData[2];
	var myOptions = {
		chart: {
			renderTo: 'container',
			type: 'bar',
			plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
		},
		colors: Highcharts.map(Highcharts.getOptions().colors, function(color) {
		    return {
		        radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
		        stops: [
		            [0, color],
		            [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
		        ]
		    };
		}),
		title: {
			text: chartTitle
		},
		xAxis: {
			title: {
				text: xAxisTitle
			},
			categories: [],
			labels:{
				formatter: function(){
					if (this.value.length > 10){
						return this.value.substr(0,5) + '...';
					}else{
						 return this.value;   
					}                        
				}
			}
		},
		yAxis: {
			title: {
				text: yAxisTitle
			},
			labels:{
				formatter: function(){
					if (this.value.length > 10){
						return this.value.substr(0,5) + '...';
					}else{
						 return this.value;   
					}                        
				}
			}
		},
		tooltip: {
			formatter: function() {
				return '<b>' + this.x + '</b><br/>' +
						'<b>' + this.series.name + ':</b> ' + Highcharts.numberFormat(this.point.y, 2, '.');
			}
		},
		plotOptions: {
			bar: {
					dataLabels: {
						enabled: true,
						formatter: function() {
							return Highcharts.numberFormat(this.point.y, 2, '.');
						}
					}
				},
            series: {
                shadow: true
            }
		},
		
		series:[]
	};
	
	var headers = [];
	
	headers = dataArray[0];
	
	for(var i = 1; i < headers.length; i++) {
		myOptions.xAxis.categories.push(headers[i]);
	}
	
	for(var j = 1; j < dataArray.length; j++) {
		var currentArray = [];
		currentArray = dataArray[j];
		var categoryName = currentArray[0];
		var categoryData = [];
		//console.log('CategoryName: ' + categoryName + ' for data: ' + dataArray[j]);
		for(var k = 1; k < currentArray.length; k++) {
			categoryData.push(currentArray[k]);
			//console.log('Category Data: ' + currentArray[k]);
		}
		
		myOptions.series.push({'name': categoryName, 'data': categoryData});
	}
	
	//console.log('Bar Chart Options: ' + JSON.stringify(myOptions));
	
	return myOptions;
}


function getBoxPlot(dataArray, metaData) {
	var chartTitle = [];
	var xAxisTitle = [];
	var yAxisTitle = [];	
	chartTitle = metaData[0];
	xAxisTitle = metaData[1];
	yAxisTitle = metaData[2];
	
	var myOptions = {
		chart: {
			renderTo: 'container',
			type: 'boxplot'
		},
		title: {
			text: chartTitle
		},
		xAxis: {
			categories: [],
			labels:{
				formatter: function(){
					if (this.value.length > 10){
						return this.value.substr(0,5) + '...';
					}else{
						 return this.value;   
					}                        
				}
			}
		},
		yAxis: {
			title: {
				text: yAxisTitle
			},
			labels:{
				formatter: function(){
					if (this.value.length > 10){
						return this.value.substr(0,5) + '...';
					}else{
						 return this.value;   
					}                        
				}
			},
			plotLines: [{
	            //value: 932,
	            color: 'red',
	            width: 1,
	            label: {
	                //text: 'Theoretical mean: 932',
	                align: 'center',
	                style: {
	                    color: 'gray'
	                }
	            }
	        }] 
		},
		series:[]
	};
	
	var headers = [];
	
	headers = dataArray[0];
	
	for(var i = 1; i < headers.length; i++) {
		myOptions.xAxis.categories.push(headers[i]);
	}
	
	for(var j = 1; j < dataArray.length; j++) {
		var currentArray = [];
		currentArray = dataArray[j];
		var categoryName = currentArray[0];
		var categoryData = [];
		//console.log('CategoryName: ' + categoryName + ' for data: ' + dataArray[j]);
		for(var k = 1; k < currentArray.length; k++) {
			categoryData.push(currentArray[k]);
			//console.log('Category Data: ' + currentArray[k]);
		}
		
		myOptions.series.push({'data': categoryData});
	}
	
	//console.log('Box Plot Chart Options: ' + JSON.stringify(myOptions));
	
	return myOptions;
}

function getColumnChart(dataArray, metaData) {
	var chartTitle = metaData[0];
	var xAxisTitle = metaData[1];
	var yAxisTitle = metaData[2];
	
	var myOptions = {
		chart: {
			renderTo: 'container',
			type: 'column',
			plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            zoomType:"xy"
		},
		colors: Highcharts.map(Highcharts.getOptions().colors, function(color) {
		    return {
		        radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
		        stops: [
		            [0, color],
		            [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
		        ]
		    };
		}),
		title: {
			text: chartTitle
		},
		xAxis: {
			title: {
				text: xAxisTitle
			},
			categories: [],
			labels: {
                rotation: -45,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
		},
		yAxis: {
			title: {
				text: yAxisTitle
			},
			labels:{
				formatter: function(){
					if (this.value.length > 10){
						return this.value.substr(0,5) + '...';
					}else{
						 return this.value;   
					}                        
				}
			}
		},
		tooltip: {
			formatter: function() {
				return '<b>' + this.x + '</b><br/>' +
						'<b>' + this.series.name + ':</b> ' + Highcharts.numberFormat(this.point.y, 2, '.');
			}
		},
		plotOptions: {
			column: {
					dataLabels: {
						enabled: true,
						formatter: function() {
							return Highcharts.numberFormat(this.point.y, 2, '.');
						}
					}
				},
            series: {
                shadow: true
            }
		},
		series:[]
	};
	
	var headers = [];
	
	headers = dataArray[0];
	
	//console.log('GetCharts: dataArray.length: ' + dataArray.length);

	for(var i = 1; i < headers.length; i++) {
		myOptions.xAxis.categories.push(headers[i]);
	}
	
	for(var j = 1; j < dataArray.length; j++) {
		var currentArray = [];
		currentArray = dataArray[j];
		var categoryName = currentArray[0];
		var categoryData = [];
		//console.log('CategoryName: ' + categoryName + ' for data: ' + dataArray[j]);
		for(var k = 1; k < currentArray.length; k++) {
			categoryData.push(currentArray[k]);
			//console.log('Category Data: ' + currentArray[k]);
		}
		
		myOptions.series.push({'name': categoryName, 'data': categoryData});
	}
	
	//console.log('Bar Chart Options: ' + JSON.stringify(myOptions));
	
	return myOptions;
}

function getStackedColumnChart(dataArray, metaData) {
	//console.log('Stacked Column Chart');
	var chartTitle = metaData[0];
	var xAxisTitle = metaData[1];
	var yAxisTitle = metaData[2];
	
	
	var myOptions = {
		chart: {
			renderTo: 'container',
			type: 'column',
			plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
		},
		colors: Highcharts.map(Highcharts.getOptions().colors, function(color) {
		    return {
		        radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
		        stops: [
		            [0, color],
		            [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
		        ]
		    };
		}),
		title: {
			text: chartTitle
		},
		xAxis: {
		title: {
				text: xAxisTitle
			},
			categories: [],
			labels:{
				formatter: function(){
					if (this.value.length > 10){
						return this.value.substr(0,5) + '...';
					}else{
						 return this.value;   
					}                        
				}
			}
		},
		yAxis: {
			title: {
				text: yAxisTitle
			},
			labels:{
				formatter: function(){
					if (this.value.length > 10){
						return this.value.substr(0,7) + '...';
					}else{
						 return this.value;   
					}                        
				}
			}
		},
		tooltip: {
			formatter: function() {
				return '<b>' + this.x + '</b><br/>' +
						'<b>' + this.series.name + ':</b> ' + Highcharts.numberFormat(this.point.y, 2, '.');
			}
		},
		plotOptions: {
			column: {
				stacking: 'normal',
				dataLabels: {
					enabled: true,
					color: 'white',
					formatter: function() {
						return Highcharts.numberFormat(this.point.y, 2, '.');
					}
				}
			},
			series: {
				shadow: true
			}
        },
		series:[]
	};
	
	var headers = [];
	headers = dataArray[0];

	for(var i = 1; i < headers.length; i++) {
		myOptions.xAxis.categories.push(headers[i]);
	}
	
	for(var j = 1; j < dataArray.length; j++) {
		var currentArray = [];
		currentArray = dataArray[j];
		var categoryName = currentArray[0];
		var categoryData = [];
		for(var k = 1; k < currentArray.length; k++) {
			categoryData.push(currentArray[k]);
		}
		
		myOptions.series.push({'name': categoryName, 'data': categoryData});
	}
	
	//console.log('Stacked Chart Options: ' + JSON.stringify(myOptions));
	
	return myOptions;
}

function getLineChart(dataArray, metaData) {
	var chartTitle = metaData[0];
	var xAxisTitle = metaData[1];
	var yAxisTitle = metaData[2];
	
	var myOptions = {
		chart: {
			renderTo: 'container',
			plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
		},
		title: {
			text: chartTitle
		},
		colors: Highcharts.map(Highcharts.getOptions().colors, function(color) {
		    return {
		        radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
		        stops: [
		            [0, color],
		            [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
		        ]
		    };
		}),
		xAxis: {
		title: {
				text: xAxisTitle
			},
			categories: [],
			labels:{
				formatter: function(){
					if (this.value.length > 10){
						return this.value.substr(0,5) + '...';
					}else{
						 return this.value;   
					}                        
				}
			}
		},
		yAxis: {
			title: {
				text: yAxisTitle
			},
			labels:{
				formatter: function(){
					if (this.value.length > 10){
						return this.value.substr(0,5) + '...';
					}else{
						 return this.value;   
					}                        
				}
			}
		},
		tooltip: {
			formatter: function() {
				return '<b>' + this.x + '</b><br/>' +
						'<b>' + this.series.name + ':</b> ' + Highcharts.numberFormat(this.point.y, 2, '.');
			}
		},
		plotOptions: {
			line: {
				dataLabels: {
					enabled: true,
					formatter: function() {
						return Highcharts.numberFormat(this.point.y, 2, '.');
					}
				}
            },
            series: {
                shadow: true
            }
		},
		series:[]
	};
	
	var headers = [];
	
	headers = dataArray[0];
	
	//console.log('GetCharts: dataArray.length: ' + dataArray.length);
	
	// Set the height
	/*if (headers.length < 5 ) {
		myOptions.chart.height = 360;
	} else if (headers.length > 5) {
		myOptions.chart.height = 60 * headers.length;
	}
	*/
	for(var i = 1; i < headers.length; i++) {
		myOptions.xAxis.categories.push(headers[i]);
	}
	
	for(var j = 1; j < dataArray.length; j++) {
		var currentArray = [];
		currentArray = dataArray[j];
		var categoryName = currentArray[0];
		var categoryData = [];
		//console.log('CategoryName: ' + categoryName + ' for data: ' + dataArray[j]);
		for(var k = 1; k< currentArray.length; k++) {
			categoryData.push(currentArray[k]);
			//console.log('Category Data: ' + currentArray[k]);
		}
		
		myOptions.series.push({'name': categoryName, 'data': categoryData});
	}
	
	//console.log('Bar Chart Options: ' + JSON.stringify(myOptions));
	
	return myOptions;
}

function getAreaChart(dataArray, metaData) {
	var chartTitle = metaData[0];
	var xAxisTitle = metaData[1];
	var yAxisTitle = metaData[2];
	
	var myOptions = {
		chart: {
			renderTo: 'container',
			type: 'area',
			plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
		},
		colors: Highcharts.map(Highcharts.getOptions().colors, function(color) {
		    return {
		        radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
		        stops: [
		            [0, color],
		            [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
		        ]
		    };
		}),
		title: {
			text: chartTitle
		},
		xAxis: {
			title: {
				text: xAxisTitle
			},
			categories: [],
			labels:{
				formatter: function(){
					if (this.value.length > 10){
						return this.value.substr(0,5) + '...';
					}else{
						 return this.value;   
					}                        
				}
			}
		},
		yAxis: {
			title: {
				text: yAxisTitle
			},
			labels:{
				formatter: function(){
					if (this.value.length > 10){
						return this.value.substr(0,5) + '...';
					}else{
						 return this.value;   
					}                        
				}
			}
		},
		tooltip: {
			formatter: function() {
				return '<b>' + this.x + '</b><br/>' +
						'<b>' + this.series.name + ':</b> ' + Highcharts.numberFormat(this.point.y, 2, '.');
			}
		},
		plotOptions: {
            area: {
                pointStart: 0,
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                    hover: {
                        enabled: true
                        }
                    }
                }
            }
        },
		series:[]
	};
	
	var headers = [];
	
	headers = dataArray[0];
	
	//console.log('GetCharts: dataArray.length: ' + dataArray.length);
	
	// Set the height
	/*if (headers.length < 5 ) {
		myOptions.chart.height = 360;
	} else if (headers.length > 5) {
		myOptions.chart.height = 60 * headers.length;
	}
	*/
	for(var i = 1; i < headers.length; i++) {
		myOptions.xAxis.categories.push(headers[i]);
	}
	
	for(var j = 1; j < dataArray.length; j++) {
		var currentArray = [];
		currentArray = dataArray[j];
		var categoryName = currentArray[0];
		var categoryData = [];
		for(var k = 1; k < currentArray.length; k++) {
			categoryData.push(currentArray[k]);
		}
		
		myOptions.series.push({'name': categoryName, 'data': categoryData});
	}
		
	return myOptions;
	
}

function getPieChart(dataArray, metaData) {
	var chartTitle = metaData[0];
	var xAxisTitle = metaData[1];
	var yAxisTitle = metaData[2];
	
	
	// Radialize the colors
		/*Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function(color) {
		    return {
		        radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
		        stops: [
		            [0, color],
		            [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
		        ]
		    };
		});*/
	
	var myOptions = {
		chart: {
			renderTo: 'container',
			type: 'pie',
			plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
		},
		colors: Highcharts.map(Highcharts.getOptions().colors, function(color) {
		    return {
		        radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
		        stops: [
		            [0, color],
		            [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
		        ]
		    };
		}),
		title: {
			text: chartTitle
		},
		tooltip: {
			pointFormat: '{point.y:.2f}'
		},
		series:[],
		plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    //color: '#000000',
                    //connectorColor: '#000000',
                    //format: '<b>{point.name}</b>: {point.percentage:.1f} %',
					formatter: function() {
						if (this.point.name.length > 10) {
							return '<b>' + this.point.name.substr(0,10) + '...:</b> ' + 
								Highcharts.numberFormat(this.point.percentage, 1, '.') + '%';
						} else {
							return this.point.name;
						}
					}
                }
            }
		}
	};
	
	var headers = [];
	
	headers = dataArray[0];
	for(var i = 1; i < dataArray.length; i++) {
		var currentArray = [];
		currentArray = dataArray[i];
		var categoryName = currentArray[0];
		var categoryData = [];
		
		for(var j = 1; j < currentArray.length; j++) {
			var pieDataArray = [];
			pieDataArray.push(headers[j], currentArray[j]);
			categoryData.push(pieDataArray);
		}
		myOptions.series.push({'data': categoryData});
	}
	
	return myOptions;
}


function getScatterPlot(dataArray, metaData) {
	var chartTitle = metaData[0];
	var xAxisTitle = metaData[1];
	var yAxisTitle = metaData[2];
	
	var myOptions = {
		chart: {
			renderTo: 'container',
			type: 'scatter',
			zoomType: 'xy',
			plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
		},
		colors: Highcharts.map(Highcharts.getOptions().colors, function(color) {
		    return {
		        radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
		        stops: [
		            [0, color],
		            [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
		        ]
		    };
		}),
		title: {
			text: chartTitle
		},
		xAxis: {
			categories: [],
			labels:{
				formatter: function(){
					if (this.value.length > 10){
						return this.value.substr(0,5) + '...';
					}else{
						 return this.value;   
					}                        
				}
			},
			startOnTick: true,
            endOnTick: true,
            showLastLabel: true
		},
		yAxis: {
			title: {
				text: yAxisTitle
			},
			labels:{
				formatter: function(){
					if (this.value.length > 10){
						return this.value.substr(0,5) + '...';
					}else{
						 return this.value;   
					}                        
				}
			}
		},
		plotOptions: {
			scatter: {
				marker: {
					radius: 5,
					states: {
						hover: {
							enabled: true,
							lineColor: 'rgb(100,100,100)'
						}
					}
				},
				states: {
					hover: {
						marker: {
							enabled: false
						}
					}
				},
				tooltip: {
					headerFormat: '<b>{series.name}</b><br/>',
					pointFormat: '{point.y:.2f}'
				}
			},
            series: {
                shadow: true
            }
		},
		
		series:[]
	};
	
	var headers = [];
	
	headers = dataArray[0];
	
	
	for(var i = 1; i < headers.length; i++) {
		myOptions.xAxis.categories.push(headers[i]);
	}
	
	for(var j = 1; j < dataArray.length; j++) {
		var currentArray = [];
		currentArray = dataArray[j];
		var categoryName = currentArray[0];
		var categoryData = [];
		for(var k = 1; k < currentArray.length; k++) {
			categoryData.push(currentArray[k]);
		}
		
		myOptions.series.push({'name': categoryName, 'data': categoryData});
	}
		
	return myOptions;
}

function getBubbleChart(dataArray, metaData) {
	var chartTitle = metaData[0];
	var xAxisTitle = metaData[1];
	var yAxisTitle = metaData[2];
	
	var myOptions = {
		chart: {
			renderTo: 'container',
			type: 'bubble',
			zoomType: 'xy',
			plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
		},
		colors: Highcharts.map(Highcharts.getOptions().colors, function(color) {
		    return {
		        radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
		        stops: [
		            [0, color],
		            [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
		        ]
		    };
		}),
		title: {
			text: chartTitle
		},
		
		plotOptions: {
			bubble: {
				tooltip: {
					pointFormat: '{point.y:.2f}'
				}
			}
		},
		
		series:[]
	};
	
	var headers = [];
	
	headers = dataArray[0];

	
	for(var i = 1; i < dataArray.length; i++) {
		var currentArray = [];
		currentArray = dataArray[i];
		var categoryName = currentArray[0];
		var categoryData = [];
		//console.log('CategoryName: ' + categoryName + ' for data: ' + dataArray[i]);
		for(var j = 1; j < currentArray.length; j++) {
			categoryData.push(currentArray[j]);
			//console.log('Category Data: ' + currentArray[j]);
		}
		
		myOptions.series.push({'name': categoryName, 'data': categoryData});
	}
	
	//console.log('Bubble Chart Options: ' + JSON.stringify(myOptions));
	
	return myOptions;
}

/*function getTimeSeries(dataArray, metaData) {
	var chartTitle = metaData[0];
	var xAxisTitle = metaData[1];
	var yAxisTitle = metaData[2];
	
	var myOptions = {
		chart: {
			renderTo: 'container',
			zoomType: 'x'
		},
		title: {
			text: chartTitle
		},
		xAxis: {
			categories: [],
			labels:{
				formatter: function(){
					if (this.value.length > 10){
						return this.value.substr(0,5) + '...';
					}else{
						 return this.value;   
					}                        
				}
			}
		},
		yAxis: {
			title: {
				text: yAxisTitle
			},

		},
		tooltip: {
                shared: true
        },
		plotOptions: {
			 area: {
                    fillColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    lineWidth: 1,
                    marker: {
                        enabled: false
                    },
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
		},
		
		series:[{
			type: 'area',
			pointInterval: 24 * 3600 * 1000
		}]
	};
	
	var headers = [];
	
	headers = dataArray[0];

	for(var i = 1; i < headers.length; i++) {
		myOptions.xAxis.categories.push(headers[i]);
	}
	
	for(var i = 1; i < dataArray.length; i++) {
		var currentArray = [];
		currentArray = dataArray[i];
		var categoryName = currentArray[0];
		var categoryData = [];
		//console.log('CategoryName: ' + categoryName + ' for data: ' + dataArray[i]);
		for(var j = 1; j < currentArray.length; j++) {
			categoryData.push(currentArray[j]);
			//console.log('Category Data: ' + currentArray[j]);
		}
		
		myOptions.series.push({'data': categoryData});
	}
	
	//console.log('Bar Chart Options: ' + JSON.stringify(myOptions));
	
	return myOptions;
}*/

function getChart(chartType, dataArray, metaData) {

	switch(chartType) {
		case 'bar':
			return getBarChart(dataArray, metaData);
			//break;
		
		case 'column':
			return getColumnChart(dataArray, metaData);
			//break;
			
		case 'stackedcolumn':
			return getStackedColumnChart(dataArray, metaData);
			//break;
			
		case 'line':
			return getLineChart(dataArray, metaData);
			//break;
			
		case 'area':
			return getAreaChart(dataArray, metaData);
			//break;
			
		case 'pie':
			return getPieChart(dataArray, metaData);
			//break;
			
		case 'scatter':
			return getScatterPlot(dataArray, metaData);
			//break;
			
		case 'bubbles':
			return getBubbleChart(dataArray, metaData);
			//break;
			
		/*case 'time':
			return getTimeSeries(dataArray, metaData);
			break;*/
			
		case 'box':
			return getBoxPlot(dataArray, metaData);
			//break;
		default:
			break;
	}
				
}