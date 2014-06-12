var d3 = require("d3");

exports.create = createGeometryDiagram;

function createGeometryDiagram(options) {
    var parentElement = options.parentElement;
    var padding = options.padding;
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
    this._paddingTransform = "translate(" + padding + "," + padding + ")";
}

GeometryDiagram.prototype.drawPath = function(path, options) {
    this._svg.append("path")
        .datum(path)
        .attr("d", d3.svg.line())
        .attr("transform", this._paddingTransform)
        .style("stroke", options.strokeColor)
        .style("fill", "none");
};

GeometryDiagram.prototype.drawAngleMarker = function(vertex, azimuths) {
    var startAzimuth = Math.min(azimuths.start, azimuths.end);
    var endAzimuth = Math.max(azimuths.start, azimuths.end);
    
    var innerRadius = 20;
    
    if (isRightAngle(startAzimuth, endAzimuth)) {
        var squareWidth = innerRadius / 4 * 3;
        
        this._svg.append("line")
            .attr("x1", vertex.x + Math.sin(startAzimuth) * squareWidth)
            .attr("y1", vertex.y - Math.cos(startAzimuth) * squareWidth)
            .attr("x2", vertex.x + Math.sin(startAzimuth) * squareWidth + Math.cos(startAzimuth) * squareWidth)
            .attr("y2", vertex.y - Math.cos(startAzimuth) * squareWidth + Math.sin(startAzimuth) * squareWidth)
            .attr("transform", this._paddingTransform)
            .style("stroke", "#000");
        
        this._svg.append("line")
            .attr("x1", vertex.x + Math.cos(startAzimuth) * squareWidth)
            .attr("y1", vertex.y + Math.sin(startAzimuth) * squareWidth)
            .attr("x2", vertex.x + Math.cos(startAzimuth) * squareWidth + Math.sin(startAzimuth) * squareWidth)
            .attr("y2", vertex.y + Math.sin(startAzimuth) * squareWidth - Math.cos(startAzimuth) * squareWidth)
            .attr("transform", this._paddingTransform)
            .style("stroke", "#000");
    }
};


function isRightAngle(startAngle, endAngle) {
    return Math.abs(endAngle - startAngle - Math.PI / 2) < 0.000001;
}
