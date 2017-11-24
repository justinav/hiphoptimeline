d3.csv("timeline.csv", function(error, data) {
  if (error) return console.warn(error);

  var timelineData = d3.nest()
      .key(function(d) {return d.Decade})
      .key(function(d) { return d.Year })
      .entries(data)

  var timeline = d3.select(".content").selectAll("section")
      .data(timelineData)
    .enter().append("section")
      .attr("class", "section-decade")
      .attr("id", function(d) {return "section-" + d.key})

  var yearBlock = timeline.selectAll(".section-decade")
      .data(function(d) { return d.values })
    .enter().append("div")
      .attr("class", function(d) {return "year-" + d.key})

   var yearHeader = yearBlock
        .append("h2")
        .text(function(d) {return (d.key)})

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
         .append("p")
         .append("a")
        .attr("class","outerUrl")
        .attr("href", function(d) {return d.Url})
        .attr("target", "_blank")
        .text(function(d) {return d.Single})
      })
});
