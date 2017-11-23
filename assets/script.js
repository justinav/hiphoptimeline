d3.csv("rappersByYear.csv", function(error, data) {
  if (error) return console.warn(error);

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

  d3.selectAll(".rapper").on("mouseenter", function(){
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
