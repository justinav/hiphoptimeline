d3.csv("rappersByYear.csv", function(error, data) {
  if (error) return console.warn(error);

  var parseDate = d3.time.format("%Y").parse,
    formatDate = d3.time.format("%Y");

  var margin = {top: 10, right: 10, bottom: 30, left: 40};
  var width = (window.innerWidth * .75) - margin.left - margin.right,
      height = (window.innerHeight * .75) - margin.top - margin.bottom;

  var xScale = d3.scale.ordinal()
      .rangeRoundBands([0,width], .5)
      .domain(data.map(function(d){return d.USRegion}))

  var x2Scale = d3.scale.linear()
      .domain([0,12])
      .range([0,width])

  var y1Scale = d3.scale.linear()
      .domain([0,68]).nice()
      .range([height,0])

  var y2Scale = d3.time.scale()
      .domain(d3.extent(data, function(d) {return parseDate(d.Year); })).nice()
      .range([height,0])

  var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")

  var x2Axis = d3.svg.axis()
      .scale(x2Scale)
      .orient("bottom")
      .ticks(6)

  var y1Axis = d3.svg.axis()
      .scale(y1Scale)
      .orient("left")
      .tickSize(-width)

  var y2Axis = d3.svg.axis()
      .scale(y2Scale)
      .orient("left")
      .tickSize(-width)
      .tickFormat(d3.time.format("%Y"))

  var regionGraph = d3.select(".content")
      .append("section")
      .attr("class", "regionGraph")
      .attr("id", "region")

  regionGraph.append("h2")
      .attr("class", "sectionTitle")
      .text("Rappers by Region")
  regionGraph.append("p")
      .attr('class', 'description')
      .text("This graph represents where these MC's originated. East Coast includes DC and Baltimore. All of Virginia and Arizona are included in the South category. The bulk of the East Coast category is represented by MC's from New York, New Jersey and Philadelphia over a 40 year span.")

  var regionSvg = d3.select(".regionGraph").append("svg")
      .attr("class", "chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  regionSvg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "x axis")
      .call(xAxis)

  regionSvg.append("g")
      .attr("class", "y axis")
      .call(y2Axis)

  reverseSort = data.sort(function(a,b) {return parseDate(b.Year) - parseDate(a.Year); })

  var barGroups = regionSvg.selectAll(".barGroups")
      .data(reverseSort)
    .enter().append("g")
      .attr("class", function(d) {return "barGroups " + d.Name})

  var barWidth = (width/6) - 24

  barGroups.on("mouseenter", function(){
    var selection = d3.select(this)
      d3.selectAll(".bars").classed("inactive", true)
      selection.select(".bars").classed("inactive", false)
      selection
        .append("text")
          .attr("class", "rapperTextOutline")
          .attr('dx', 1)
          .attr('dy', 1)
          .text(function(d) {return d.Name})
      selection.append("text")
        .attr("class", "rapperText")
        .text(function(d) {return d.Name})
  })
  .on("mouseleave", function() {
      d3.selectAll(".bars").classed("inactive", false)
      d3.select(this).select("text").remove();
      d3.select(this).select("text").remove();
  })
  barGroups.each(function() {
      var rapperDot = d3.select(this);
      rapperDot
        .attr("transform", function(d) {return "translate(" + xScale(d.USRegion) + "," + y2Scale(parseDate(d.Year)) + ")"})
        .append("rect")
        .attr("class", "bars")
        .attr("width", barWidth)
        .attr("height", 4)
  })

  var buttonToolbar = d3.select(".content").append("div")
      .attr("class","buttonToolbar")

  buttonToolbar.append("button")
      .attr("id","yearRegion")
      .text("Show by Year")

  buttonToolbar.append("button")
      .attr("id","totalRegion")
      .attr("class", "inactive")
      .text("Show Total by Region")

  buttonToolbar.append("button")
      .attr("id","total")
      .attr("class", "inactive")
      .text("Total by Year")

  d3.selectAll("#totalRegion").on("click", function(){
      d3.select("#total").classed("inactive", true)
      d3.select("#yearRegion").classed("inactive", true)
      d3.select("#totalRegion").classed("inactive", false)

      d3.select(".y.axis").call(y1Axis)
      d3.select(".x.axis").call(xAxis)

      d3.selectAll(".barGroups")
          .transition()
          .duration(2000)
          .ease("linear")
          .attr("transform", function(d) {return "translate(" + xScale(d.USRegion) + "," + y1Scale(d.RegionID) + ")"})
  })

  d3.selectAll("#yearRegion").on("click", function(){
      d3.select("#total").classed("inactive", true)
      d3.select("#totalRegion").classed("inactive", true)
      d3.select("#yearRegion").classed("inactive", false)

      d3.select(".y.axis").call(y2Axis)
      d3.select(".x.axis").call(xAxis)

      d3.selectAll(".barGroups")
          .transition()
          .duration(2000)
          .ease("linear")
          .attr("transform", function(d) {return "translate(" + xScale(d.USRegion) + "," + y2Scale(parseDate(d.Year)) + ")"})
  })

  d3.selectAll("#total").on("click", function(){
      d3.select("#totalRegion").classed("inactive", true)
      d3.select("#yearRegion").classed("inactive", true)
      d3.select("#total").classed("inactive", false)

      d3.select(".y.axis").call(y2Axis)
      d3.select(".x.axis").call(x2Axis)

      d3.selectAll(".barGroups")
          .transition()
          .duration(2000)
          .ease("linear")
          .attr("transform", function(d) {return "translate(" + x2Scale(d.GroupID) + "," + y2Scale(parseDate(d.Year)) + ")"})

      d3.selectAll(".bars")
          .attr("width", width / 12)
  })

    // LARGE Timeline
  var plainTimelineData = d3.nest()
      .key(function(d) { return d.Year })
      .entries(data)

  var largeTimeline = d3.select(".content")
      .append("section")
      .attr("class", "largeTimeline")
      .attr("id", "long")

  largeTimeline.append("h2")
      .attr("class", "sectionTitle")
      .text("The Long List")

  largeTimeline.append("p")
      .attr("class", "description")
      .text("hover over names to see first single. click on single to listen to it on YouTube.")

  var indexWrapper = largeTimeline.append("nav")
      .attr("class", "indexWrapper")
      .append("ul")

  indexWrapper.append("li").append("a")
      .attr("href", "#")
      .attr("class", "btn-top")
      .text("Top")

  indexWrapper.selectAll("li")
      .data(plainTimelineData)
    .enter().append("li")
      .append("a")
      .attr("href", function(d) {return "#" + d.key})
      .text(function(d) {return d.key})

  var yearBlock = largeTimeline.selectAll(".yearBlock")
      .data(plainTimelineData)
    .enter().append("div")
      .attr("class", "yearBlock")
      .attr("id", function(d) {return d.key})

  yearBlock.append("h2")
      .attr("class", "yearTitle")
      .text(function(d) {return d.key})

  yearBlock.each(function() {
      var rapperBlock = d3.select(this);
      rapperBlock.selectAll("div")
          .data(function(d) { return d.values; })
        .enter().append("div")
          .attr("class", "rapper")
          .append("h3")
          .text(function(d) {return d.Name; })
      rapperBlock.selectAll(".rapper")
         .append("p")
         .text(function(d) {return d.SecondaryName; })
  })

  d3.selectAll(".rapper").on("click", function(){
      d3.select(this)
      .append("a")
      .attr("class","outerUrl")
      .attr("href", function(d) {return d.Url})
      .attr("target", "_blank")
      .text(function(d) {return d.Single})
   })
  .on("mouseleave" , function() {
      d3.select(this).select(".outerUrl").remove()
   })

});

d3.select(window)
    .on("resize", function() {
      window.innerWidth
    })
