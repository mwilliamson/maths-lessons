(function() {
    var width = 200;
    var height = width;
    
    var centre = {x: width / 2, y: height / 2};
    
    renderAngleWidgets();
    
    function renderAngleWidgets() {
        $("*[data-widget='display-angle']").each(function() {
            renderAngleWidget(this);
        });
        $("*[data-widget='angle-example']").each(function() {
            renderAngleExamplesWidget(this);
        });
    }
    
    function renderAngleExamplesWidget(element) {
        var initialHeading = readInitialHeading(element);
        var angle = readAngleAttribute(element, "data-angle");
        var finalHeading = initialHeading + angle;
        
        var svg = d3.select(element)
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        
        drawVertex(svg);
        drawArm(svg, initialHeading);
        drawArm(svg, finalHeading);
        drawMarker(svg, initialHeading, finalHeading);
    }
    
    function readInitialHeading(element) {
        var angle = readAngleAttribute(element, "data-initial-heading");
        if (angle === null) {
            return randomAngle();
        } else {
            return angle
        }
    }
    
    function readAngleAttribute(element, name) {
        if (element.hasAttribute(name)) {
            var angleDegrees = element.getAttribute(name);
            return angleDegrees / 180 * Math.PI;
        } else {
            return null;
        }
    }
    
    function randomAngle() {
        return Math.random() * Math.PI * 2;
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
        drawArm(svg, 0);
        drawArm(svg, angle);
        drawMarker(svg, 0, angle);
    }
    
    function drawArm(svg, angle) {
        var to = calculateArmEnd(angle);
        svg.append("line")
            .attr("x1", centre.x)
            .attr("y1", centre.y)
            .attr("x2", to.x)
            .attr("y2", to.y)
            .style("stroke", "#3366ff");
    }
    
    function calculateArmEnd(angle) {
        var armLength = width / 2 * 0.8;
        return {
            x: centre.x + Math.cos(angle) * armLength,
            y: centre.y - Math.sin(angle) * armLength
        };
    }
    
    function drawVertex(svg) {
        var vertexFillColour = "#003399";
        
        svg.append("circle")
            .attr("cx", centre.x)
            .attr("cy", centre.y)
            .attr("r", 5)
            .style("fill", vertexFillColour);
    }
    
    function drawMarker(svg, startAngle, endAngle) {
        var arc = d3.svg.arc()
            .innerRadius(20)
            .outerRadius(21)
            .startAngle(polarAngleToD3Angle(startAngle))
            .endAngle(polarAngleToD3Angle(endAngle));
            
        svg.append("path")
            .attr("d", arc)
            .attr("transform", "translate(" + centre.x + "," + centre.y + ")");
    }
    
    function polarAngleToD3Angle(angle) {
        return -angle + Math.PI / 2;
    }
})();
