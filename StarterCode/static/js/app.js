  



 

// function that populates the metadata
function demoInfo(sample)
{
  console.log(sample);

  // use d3.json inorder to get the data
  d3.json("samples.json").then((data) => {
      // grab the metadata
      let metaData = data.metadata;
      //console.log(metaData);

      // filter based on the value of sample
      let result = metaData.filter(sampleResult => sampleResult.id == sample);
      // console.log(result);

      // access index 0 from the array
      let resultData = result[0];
      // console.log(resultData);

      // clear the metadata out
      d3.select("#sample-metadata").html(""); // clears the html out

      // use object.entries to get the value key pairs
      Object.entries(resultData).forEach(([key, value]) =>{
        // add to the sampledata/ demographic section
        d3.select("#sample-metadata")
          .append("h5").text(`${key}: ${value}`);

      });
  });
}

// build the BARCHART
function buildBarChart(sample)
{
 //console.log(sample);
  //let data = d3.json("samples.json");
  //console.log(data);

  d3.json("samples.json").then((data) => {
    // grab the samples
    let sampleData = data.samples;
    

    // filter based on the value of sample
    let result = sampleData.filter(sampleResult => sampleResult.id == sample);
    

    // access index 0 from the array
    let resultData = result[0];
    

    // get the otu_ids and sample_value
    let otu_ids = resultData.otu_ids;
    let otu_labels = resultData.otu_labels;
    let sample_values = resultData.sample_values;
    

    // build the bar Chart
    // get the yTicks
    let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
    let xValues = sample_values.slice(0, 10);
    let textLabels = otu_labels.slice(0, 10);
    
    let barChart = {
        y: yticks.reverse(),
        x: xValues.reverse(),
        text: textLabels.reverse(),
        type: "bar",
        orientation: "h"
    }

    let layout = {
        title: "Top 10 Belly Button Bacteria"
    };

    Plotly.newPlot("bar", [barChart], layout);
  });

}

// build the bubble chart
function buildBubbleChart(sample)
{
  //console.log(sample);
  //let data = d3.json("samples.json");
  //console.log(data);

  d3.json("samples.json").then((data) => {
    // grab the samples
    let sampleData = data.samples;
    

    // filter based on the value of sample
    let result = sampleData.filter(sampleResult => sampleResult.id == sample);
    

    // access index 0 from the array
    let resultData = result[0];
    

    // get the otu_ids and sample_value
    let otu_ids = resultData.otu_ids;
    let otu_labels = resultData.otu_labels;
    let sample_values = resultData.sample_values;
    

    // build the bubbleChart
        
    let bubbleChart = {
        y: sample_values,
        x: otu_ids,
        text: otu_labels,
        mode: "markers",
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
        }
    }

    let layout = {
        title: "Bacteria Cultures Per Sample",
        hovermode: "closest",
        xaxis: {title: "OTU ID"}
    };

    Plotly.newPlot("bubble", [bubbleChart], layout);
  });
}

//build the guage chart
function buildGuageChart(sample)
{
  //console.log(sample);
  //let data = d3.json("samples.json");
  //console.log(data);

  d3.json("samples.json").then((data) => {
    // grab the samples
    let sampleData = data.samples;
    

    // filter based on the value of sample
    let result = sampleData.filter(sampleResult => sampleResult.id == sample);
    

    // access index 0 from the array
    let resultData = result[0];
    

    // get the otu_ids and sample_value
    let otu_ids = resultData.otu_ids;
    let otu_labels = resultData.otu_labels;
    let sample_values = resultData.sample_values;
    

    // build the GuageChart
        
    let guageChart = {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,
        type: "indicator",
        mode: "gauge+number",
        gauge: {
					  axis: { range: [null, 9] },
					  steps: [
						  { range: [0, 1], color: 'rgb(248, 243, 236)' },
						  { range: [1, 2], color: 'rgb(244, 241, 229)' },
						  { range: [2, 3], color: 'rgb(233, 230, 202)' },
						  { range: [3, 4], color: 'rgb(229, 231, 179)' },
						  { range: [4, 5], color: 'rgb(213, 228, 157)' },
						  { range: [5, 6], color: 'rgb(183, 204, 146)' },
						  { range: [6, 7], color: 'rgb(140, 191, 136)' },
						  { range: [7, 8], color: 'rgb(138, 187, 143)' },
						  { range: [8, 9], color: 'rgb(133, 180, 138)' },
					  ]
				  }
        }
    };

    let layout = {
        title: "Belly Button Washing Frequency",
        width: 600,
        height: 450,
        margin: { t: 0, b: 0 }
    };

    Plotly.newPlot("guage", [guageChart], layout);
  };
}

// function to initiates the dashboard
function initialize()
{ 
  
  // let data = d3.json("samples.json");
  // console.log(data);

  // access the dropdown
  var select = d3.select("#selDataset");

  // use d3.json inorder to get the data
  d3.json("samples.json").then((data) => {
      let sampleNames = data.names; // made array of just the names
      //console.log(sampleNames);

      // use a for each in order to create for each sample
      // selector

      sampleNames.forEach((sample) => {
          select.append("option")
              .text(sample)
              .property("value", sample);
      });

      // when initialized, pass in the info for first sample
      let sample1 = sampleNames[0];

      // call the function to build the metadata
      demoInfo(sample1);
      // call function to build the BarChart
      buildBarChart(sample1);
      // call function to build the bubble chart
      buildBubbleChart(sample1);
      // call function to build the guage chart
      buildGuageChart(sample1);
    });
}

// function that updates the dashboard
function optionChanged(item)
{
  // call the update to the metadata
  demoInfo(item);
  // call function to build the bar chart
  buildBarChart(item);
  // call function to build the bubble chart
  buildBubbleChart(item);
  // call function to build the guage chart
  buildGuageChart(item);
    
}

// initialize the function
initialize();

   