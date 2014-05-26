(function() {
    var width = 200;
    var height = width;
    
    var centre = {x: width / 2, y: height / 2};
    
    renderAngleWidgets();
    
    function renderAngleWidgets() {
        $("*[data-widget='display-angle']").each(function() {
            renderAngleWidget(this);
        });
    }
    
    function renderAngleWidget(element) {
        var angleDegrees = element.getAttribute("data-angle");
        var angle = angleDegrees / 180 * Math.PI;
        var armLength = width / 2 * 0.8;
        
        var svg = d3.select(element)
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        
        drawVertex(svg);
        drawArm(svg, {x: centre.x + armLength, y: centre.y});
        drawArm(svg, {
            x: centre.x + Math.cos(angle) * armLength,
            y: centre.y - Math.sin(angle) * armLength
        });
        drawMarker(svg, angle);
    }
    
    function drawArm(svg, to) {
        svg.append("line")
            .attr("x1", centre.x)
            .attr("y1", centre.y)
            .attr("x2", to.x)
            .attr("y2", to.y)
            .style("stroke", "#3366ff");
    }
    
    function drawVertex(svg) {
        var vertexFillColour = "#003399";
        
        svg.append("circle")
            .attr("cx", centre.x)
            .attr("cy", centre.y)
            .attr("r", 5)
            .style("fill", vertexFillColour);
    }
    
    function drawMarker(svg, angle) {
        var arc = d3.svg.arc()
            .innerRadius(20)
            .outerRadius(21)
            .startAngle(Math.PI / 2)
            .endAngle(-angle + Math.PI / 2);
            
        svg.append("path")
            .attr("d", arc)
            .attr("transform", "translate(" + centre.x + "," + centre.y + ")");
    }
})();
