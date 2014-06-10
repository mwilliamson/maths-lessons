(function() {
    var width = 200;
    var height = width;
    
    var centre = {x: width / 2, y: height / 2};
    
    renderRectangleAngleWidgets();
    
    function renderRectangleAngleWidgets() {
        $("*[data-widget='rectangle-angle-example']").each(function() {
            renderRectangleAngleExampleWidget(this);
        });
    }
    
    function renderRectangleAngleExampleWidget(element) {
        var padding = 20;
        var width = 1 * element.getAttribute("data-width");
        var height = 1 * element.getAttribute("data-height");
        
        var svg = d3.select(element)
            .append("svg")
            .attr("width", width + 2 * padding)
            .attr("height", height + 2 * padding);
        
        var rectanglePath = [
            [0, 0],
            [width, 0],
            [width, height],
            [0, height],
            [0, 0]
        ];
        svg.append("path")
            .datum(rectanglePath)
            .attr("d", d3.svg.line())
            .attr("transform", "translate(" + padding + "," + padding + ")")
            .style("stroke", "#3366ff")
            .style("fill", "none");
        
        drawMarker(svg, {x: padding, y: padding}, Math.PI * 3 / 2, Math.PI * 2);
        drawMarker(svg, {x: padding + width, y: padding}, Math.PI, Math.PI * 3 / 2);
        drawMarker(svg, {x: padding, y: padding + height}, 0, Math.PI / 2);
        drawMarker(svg, {x: padding + width, y: padding + height}, Math.PI / 2, Math.PI);
    }
    
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
        drawMarker(svg, centre, initialHeading, finalHeading);
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
        drawMarker(svg, centre, 0, angle);
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
    
    function drawMarker(svg, position, startAngle, endAngle) {
        var innerRadius = 20;
        var strokeWidth = 1;
        
        if (isRightAngle(startAngle, endAngle)) {
            var squareWidth = innerRadius / 4 * 3;
            svg.append("line")
                .attr("x1", position.x + Math.cos(endAngle) * squareWidth)
                .attr("y1", position.y - Math.sin(endAngle) * squareWidth)
                .attr("x2", position.x + Math.cos(endAngle) * squareWidth + Math.cos(startAngle) * squareWidth)
                .attr("y2", position.y - Math.sin(endAngle) * squareWidth - Math.sin(startAngle) * squareWidth)
                .style("stroke", "#000");
                
            svg.append("line")
                .attr("x1", position.x + Math.cos(startAngle) * squareWidth)
                .attr("y1", position.y - Math.sin(startAngle) * squareWidth)
                .attr("x2", position.x + Math.cos(endAngle) * squareWidth + Math.cos(startAngle) * squareWidth)
                .attr("y2", position.y - Math.sin(endAngle) * squareWidth - Math.sin(startAngle) * squareWidth)
                .style("stroke", "#000");
        } else {
            var arc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(innerRadius + strokeWidth)
                .startAngle(polarAngleToD3Angle(startAngle))
                .endAngle(polarAngleToD3Angle(endAngle));
                
        svg.append("path")
            .attr("d", arc)
            .attr("transform", "translate(" + position.x + "," + position.y + ")");
        }
    }
    
    function polarAngleToD3Angle(angle) {
        return -angle + Math.PI / 2;
    }
    
    function isRightAngle(startAngle, endAngle) {
        return Math.abs(Math.abs(endAngle - startAngle) - Math.PI / 2) < 0.000001;
    }
})();
