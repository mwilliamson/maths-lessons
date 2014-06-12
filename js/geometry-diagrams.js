var d3 = require("d3");

exports.create = createGeometryDiagram;

var defaultLineStrokeColor = "#3366ff";

function createGeometryDiagram(options) {
    var parentElement = options.parentElement;
    var padding = options.padding || 0;
    var width = options.width;
    var height = options.height;
    
    var svg = d3.select(parentElement)
        .append("svg")
        .attr("width", width + 2 * padding)
        .attr("height", height + 2 * padding);
    
    return new GeometryDiagram(svg, padding);
}

function GeometryDiagram(svg, padding) {
    this._svg = svg;
    this._padding = padding;
}

GeometryDiagram.prototype.drawPath = function(path) {
    this._svg.append("path")
        .datum(path)
        .attr("d", d3.svg.line())
        .attr("transform", this._translation(0, 0))
        .style("stroke", defaultLineStrokeColor)
        .style("fill", "none");
};

GeometryDiagram.prototype.drawVertex = function(centre) {
    this._svg.append("circle")
        .attr("cx", centre.x)
        .attr("cy", centre.y)
        .attr("r", 5)
        .style("fill", defaultLineStrokeColor);
};

GeometryDiagram.prototype.drawArm = function(options) {
    var start = options.start;
    var azimuth = options.azimuth;
    var length = options.length;
    
    var end = calculateArmEnd(start, azimuth, length);
    this._svg.append("line")
        .attr("x1", start.x)
        .attr("y1", start.y)
        .attr("x2", end.x)
        .attr("y2", end.y)
        .style("stroke", defaultLineStrokeColor);
};

function calculateArmEnd(start, azimuth, length) {
    return {
        x: start.x + Math.sin(azimuth) * length,
        y: start.y - Math.cos(azimuth) * length
    };
}


GeometryDiagram.prototype.drawAngleMarker = function(vertex, azimuths) {
    var startAzimuth = Math.min(azimuths.start, azimuths.end);
    var endAzimuth = Math.max(azimuths.start, azimuths.end);
    
    var innerRadius = 20;
    var strokeWidth = 1;
    
    if (isRightAngle(startAzimuth, endAzimuth)) {
        var squareWidth = innerRadius / 4 * 3;
        
        this._svg.append("line")
            .attr("x1", vertex.x + Math.sin(startAzimuth) * squareWidth)
            .attr("y1", vertex.y - Math.cos(startAzimuth) * squareWidth)
            .attr("x2", vertex.x + Math.sin(startAzimuth) * squareWidth + Math.cos(startAzimuth) * squareWidth)
            .attr("y2", vertex.y - Math.cos(startAzimuth) * squareWidth + Math.sin(startAzimuth) * squareWidth)
            .attr("transform", this._translation(0, 0))
            .style("stroke", "#000");
        
        this._svg.append("line")
            .attr("x1", vertex.x + Math.cos(startAzimuth) * squareWidth)
            .attr("y1", vertex.y + Math.sin(startAzimuth) * squareWidth)
            .attr("x2", vertex.x + Math.cos(startAzimuth) * squareWidth + Math.sin(startAzimuth) * squareWidth)
            .attr("y2", vertex.y + Math.sin(startAzimuth) * squareWidth - Math.cos(startAzimuth) * squareWidth)
            .attr("transform", this._translation(0, 0))
            .style("stroke", "#000");
    } else {
        var arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(innerRadius + strokeWidth)
            .startAngle(startAzimuth)
            .endAngle(endAzimuth);
            
        this._svg.append("path")
            .attr("d", arc)
            .attr("transform", this._translation(vertex.x, vertex.y));
    }
};

    
GeometryDiagram.prototype._translation = function(x, y) {
    return "translate(" + (this._padding + x) + "," + (this._padding + y) + ")";
};

function isRightAngle(startAngle, endAngle) {
    return Math.abs(endAngle - startAngle - Math.PI / 2) < 0.000001;
}
