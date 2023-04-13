let jsonObject = {};
let w = 1200; //Will be calculated later
let h = 600;
let padding = 60;
let barWidth = 4.2;


document.addEventListener('DOMContentLoaded', function() {
  const req = new XMLHttpRequest();
  req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
  req.send();
  req.onload = function() {
    jsonObject = JSON.parse(req.responseText);
    showBarChart();
  };
});



function showBarChart() {
  let dataset = jsonObject.data;
  let allDates = dataset.map((element) => {return new Date(element[0])});
  
  let xScale = d3.scaleTime()
    .domain([d3.min(allDates), d3.max(allDates)])
    .range([padding, w - padding]);
  let yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([h - padding, padding]);
  
  let tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .attr("class", "tooltip")
    .style("opacity", 0);
  
  let svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
  
  svg.append("text")
    .attr("id", "title")
    .attr("x", w / 2)
    .attr("y", padding)
    .attr("text-anchor", "middle")
    .style("font-size", 32)
    .style("font-weight", "bold")
    .style("text-decoration", "underline")
    .text("United States GDP");
  
  svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d, i) => d[0])
    .attr("data-gdp", (d, i) => d[1])
    .attr("x", (d, i) => xScale(allDates[i]))
    .attr("y", (d, i) => yScale(d[1]))
    .attr("width", (w - (padding * 2)) / dataset.length)
    .attr("height", (d, i) => h - padding - yScale(d[1]))
    .attr("fill", "#008ac5")
    .on("mouseover", function(event, d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0.9);
    tooltip
      .html("Date: " + d[0] + "<br>GDP: " + d[1])
      .style("left", event.pageX + 20 + "px")
      .style("top", event.pageY - 40 + "px");
    tooltip.attr("data-date", d[0]);
  })
  .on("mouseout", function(event, d) {
    tooltip
      .transition()
      .duration(400)
      .style("opacity", 0);
  });
  
  let xAxis = d3.axisBottom(xScale);
  let yAxis = d3.axisLeft(yScale);
  
  svg.append("g")
    .attr("id", "x-axis")
    .attr("class", "tick")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis)
  
  svg.append("g")
    .attr("id", "y-axis")
    .attr("class", "tick")
    .attr("transform", "translate(" + padding + "," + "0)")
    .call(yAxis);
}