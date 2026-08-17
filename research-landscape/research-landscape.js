(function () {

    "use strict";


    /* =========================================================
       INITIALISE
       ========================================================= */

    var container = document.getElementById("research-landscape");

    if (!container || typeof RESEARCH_LANDSCAPE === "undefined") {
        return;
    }


    var NS = "http://www.w3.org/2000/svg";

    var nodes = RESEARCH_LANDSCAPE.nodes;
    var edges = RESEARCH_LANDSCAPE.edges;

    var nodeMap = {};

    nodes.forEach(function (node) {
        nodeMap[node.id] = node;
    });


    /* =========================================================
       SVG
       ========================================================= */

    var svg = document.createElementNS(NS, "svg");

    svg.setAttribute("viewBox", "0 0 1000 600");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");

    container.appendChild(svg);


    var edgeLayer = document.createElementNS(NS, "g");
    var nodeLayer = document.createElementNS(NS, "g");
    var labelLayer = document.createElementNS(NS, "g");

    edgeLayer.setAttribute("class", "research-edges");
    nodeLayer.setAttribute("class", "research-nodes");
    labelLayer.setAttribute("class", "research-labels");

    svg.appendChild(edgeLayer);
    svg.appendChild(nodeLayer);
    svg.appendChild(labelLayer);


    /* =========================================================
       HELPERS
       ========================================================= */

    var RADIUS = 7;

    var SVG_WIDTH = 1000;
    var SVG_HEIGHT = 600;


    function position(node) {
        return {
            x: node.x * SVG_WIDTH / 100,
            y: node.y * SVG_HEIGHT / 100
        };
    }


    function makeElement(type, attributes) {

        var element = document.createElementNS(NS, type);

        Object.keys(attributes).forEach(function (key) {
            element.setAttribute(key, attributes[key]);
        });

        return element;
    }


    function isProject(node) {
        return (
            node.type === "unpublished" ||
            node.type === "published"
        );
    }


    /* =========================================================
       EDGES
       ========================================================= */

    var edgeElements = [];

    edges.forEach(function (edge) {

        var line = makeElement("line", {
            class: "research-edge"
        });

        line.dataset.source = edge.source;
        line.dataset.target = edge.target;

        edgeLayer.appendChild(line);

        edgeElements.push({
            data: edge,
            element: line
        });

    });


    /* =========================================================
       NODE CREATION
       ========================================================= */

    var nodeElements = [];


    nodes.forEach(function (node) {

        var group = makeElement("g", {
            class: "research-node " + node.type
        });

        group.dataset.nodeId = node.id;

        if (isProject(node)) {
            group.classList.add("is-project");
        }


        /*
         * Main shape
         */

        var shape;

        if (
            node.type === "unpublished" ||
            node.type === "published"
        ) {

            shape = makeElement("rect", {
                class: "node-shape",
                x: -RADIUS,
                y: -RADIUS,
                width: RADIUS * 2,
                height: RADIUS * 2,
                transform: "rotate(45)"
            });

        } else {

            shape = makeElement("circle", {
                class: "node-shape",
                cx: 0,
                cy: 0,
                r: RADIUS
            });

        }


        /*
         * Hover shape
         */

        var hoverShape;

        if (
            node.type === "unpublished" ||
            node.type === "published"
        ) {

            hoverShape = makeElement("rect", {
                class: "node-hover-shape",
                x: -RADIUS,
                y: -RADIUS,
                width: RADIUS * 2,
                height: RADIUS * 2,
                transform: "rotate(45)"
            });

        } else {

            hoverShape = makeElement("circle", {
                class: "node-hover-shape",
                cx: 0,
                cy: 0,
                r: RADIUS
            });

        }


        group.appendChild(hoverShape);
        group.appendChild(shape);

        nodeLayer.appendChild(group);


        /*
         * Label
         */

        var labelGroup = makeElement("g", {
            class: "research-label-group"
        });


        var backdrop = makeElement("rect", {
            class: "research-label-backdrop",
            rx: 4,
            ry: 4
        });


        var text = makeElement("text", {
            class: "research-label",
            "text-anchor": "middle"
        });


        text.textContent = node.name;


        labelGroup.appendChild(backdrop);
        labelGroup.appendChild(text);

        labelLayer.appendChild(labelGroup);


        /*
         * Project instruction
         */

        var hint = null;

        if (isProject(node)) {

            hint = makeElement("text", {
                class: "research-label research-project-hint",
                "text-anchor": "middle"
            });

            hint.textContent = "click to explore related projects";

            labelGroup.appendChild(hint);
        }


        nodeElements.push({
            data: node,
            group: group,
            shape: shape,
            hoverShape: hoverShape,
            labelGroup: labelGroup,
            backdrop: backdrop,
            text: text,
            hint: hint,
            dragging: false
        });

    });


    /* =========================================================
       POSITIONING
       ========================================================= */

    function updatePositions() {

        nodeElements.forEach(function (item) {

            var p = position(item.data);

            item.group.setAttribute(
                "transform",
                "translate(" + p.x + " " + p.y + ")"
            );

            positionLabel(item);

        });


        edgeElements.forEach(function (item) {

            var source = nodeMap[item.data.source];
            var target = nodeMap[item.data.target];

            var a = position(source);
            var b = position(target);

            item.element.setAttribute("x1", a.x);
            item.element.setAttribute("y1", a.y);
            item.element.setAttribute("x2", b.x);
            item.element.setAttribute("y2", b.y);

        });

    }


    /* =========================================================
       LABEL PLACEMENT
       ========================================================= */

    function positionLabel(item) {

        var node = item.data;
        var p = position(node);

        var candidates = [

            { x: p.x, y: p.y - 22 },

            { x: p.x + 58, y: p.y },

            { x: p.x - 58, y: p.y },

            { x: p.x, y: p.y + 30 },

            { x: p.x + 45, y: p.y - 25 },

            { x: p.x - 45, y: p.y - 25 }

        ];


        var candidate = candidates[0];

        /*
         * Pick the candidate with the fewest nearby
         * nodes / edges.
         */

        var bestScore = Infinity;


        candidates.forEach(function (candidatePosition) {

            var score = 0;


            nodes.forEach(function (other) {

                if (other.id === node.id) return;

                var otherPosition = position(other);

                var dx = candidatePosition.x - otherPosition.x;
                var dy = candidatePosition.y - otherPosition.y;

                var distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 75) {
                    score += (75 - distance);
                }

            });


            edges.forEach(function (edge) {

                if (
                    edge.source === node.id ||
                    edge.target === node.id
                ) {
                    return;
                }

                var a = position(nodeMap[edge.source]);
                var b = position(nodeMap[edge.target]);

                var distance = pointToSegmentDistance(
                    candidatePosition.x,
                    candidatePosition.y,
                    a.x,
                    a.y,
                    b.x,
                    b.y
                );

                if (distance < 35) {
                    score += (35 - distance) * 0.5;
                }

            });


            if (score < bestScore) {
                bestScore = score;
                candidate = candidatePosition;
            }

        });


        item.text.setAttribute("x", candidate.x);
        item.text.setAttribute("y", candidate.y);

        /*
         * Give the text backdrop the same approximate dimensions.
         */

        var box = item.text.getBBox();

        item.backdrop.setAttribute(
            "x",
            box.x - 6
        );

        item.backdrop.setAttribute(
            "y",
            box.y - 4
        );

        item.backdrop.setAttribute(
            "width",
            box.width + 12
        );

        item.backdrop.setAttribute(
            "height",
            box.height + 8
        );


        if (item.hint) {

            item.hint.setAttribute(
                "x",
                candidate.x
            );

            item.hint.setAttribute(
                "y",
                candidate.y + 17
            );

        }

    }


    function pointToSegmentDistance(px, py, x1, y1, x2, y2) {

        var dx = x2 - x1;
        var dy = y2 - y1;

        if (dx === 0 && dy === 0) {
            return Math.hypot(px - x1, py - y1);
        }

        var t = (
            (px - x1) * dx +
            (py - y1) * dy
        ) / (dx * dx + dy * dy);

        t = Math.max(0, Math.min(1, t));

        var x = x1 + t * dx;
        var y = y1 + t * dy;

        return Math.hypot(px - x, py - y);
    }


    /* =========================================================
       LABEL COLLISION / DIMMING
       ========================================================= */

    function clearObscured() {

        nodeElements.forEach(function (item) {
            item.group.classList.remove("is-obscured");
        });

        edgeElements.forEach(function (item) {
            item.element.classList.remove("is-obscured");
        });

    }


    function dimElementsBehindLabel(activeItem) {

        clearObscured();


        var box = activeItem.text.getBBox();

        var expandedBox = {
            x: box.x - 5,
            y: box.y - 5,
            width: box.width + 10,
            height: box.height + 10
        };


        /*
         * Nodes beneath the label become quieter.
         */

        nodeElements.forEach(function (item) {

            if (item === activeItem) return;

            var p = position(item.data);

            if (
                p.x >= expandedBox.x &&
                p.x <= expandedBox.x + expandedBox.width &&
                p.y >= expandedBox.y &&
                p.y <= expandedBox.y + expandedBox.height
            ) {
                item.group.classList.add("is-obscured");
            }

        });


        /*
         * Edges crossing the label become quieter.
         */

        edgeElements.forEach(function (edge) {

            var source = position(nodeMap[edge.data.source]);
            var target = position(nodeMap[edge.data.target]);

            if (
                lineIntersectsBox(
                    source.x,
                    source.y,
                    target.x,
                    target.y,
                    expandedBox
                )
            ) {
                edge.element.classList.add("is-obscured");
            }

        });

    }


    function lineIntersectsBox(x1, y1, x2, y2, box) {

        if (
            pointInsideBox(x1, y1, box) ||
            pointInsideBox(x2, y2, box)
        ) {
            return true;
        }


        var left = box.x;
        var right = box.x + box.width;
        var top = box.y;
        var bottom = box.y + box.height;


        return (
            segmentsIntersect(x1, y1, x2, y2, left, top, right, top) ||
            segmentsIntersect(x1, y1, x2, y2, right, top, right, bottom) ||
            segmentsIntersect(x1, y1, x2, y2, right, bottom, left, bottom) ||
            segmentsIntersect(x1, y1, x2, y2, left, bottom, left, top)
        );

    }


    function pointInsideBox(x, y, box) {

        return (
            x >= box.x &&
            x <= box.x + box.width &&
            y >= box.y &&
            y <= box.y + box.height
        );

    }


    function segmentsIntersect(
        x1, y1, x2, y2,
        x3, y3, x4, y4
    ) {

        function direction(ax, ay, bx, by, cx, cy) {
            return (
                (cx - ax) * (by - ay) -
                (cy - ay) * (bx - ax)
            );
        }

        var d1 = direction(x3, y3, x4, y4, x1, y1);
        var d2 = direction(x3, y3, x4, y4, x2, y2);
        var d3 = direction(x1, y1, x2, y2, x3, y3);
        var d4 = direction(x1, y1, x2, y2, x4, y4);

        return (
            ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
            ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))
        );

    }


    /* =========================================================
       HOVER
       ========================================================= */

    function showHover(item) {

        nodeElements.forEach(function (other) {

            if (other !== item) {
                other.group.classList.remove("is-hovered");
            }

        });

        item.group.classList.add("is-hovered");

        item.text.classList.add("is-visible");
        item.backdrop.classList.add("is-visible");

        if (item.hint) {
            item.hint.classList.add("is-visible");
        }

        dimElementsBehindLabel(item);

    }


    function hideHover(item) {

        item.group.classList.remove("is-hovered");

        item.text.classList.remove("is-visible");
        item.backdrop.classList.remove("is-visible");

        if (item.hint) {
            item.hint.classList.remove("is-visible");
        }

        clearObscured();

    }


    nodeElements.forEach(function (item) {

        item.group.addEventListener("mouseenter", function () {
            if (!item.dragging) {
                showHover(item);
            }
        });


        item.group.addEventListener("mouseleave", function () {

            if (!item.dragging) {
                hideHover(item);
            }

        });

    });


    /* =========================================================
       DRAGGING
       ========================================================= */

    var activeDrag = null;


    function pointerPosition(event) {

        var rect = svg.getBoundingClientRect();

        return {
            x: (event.clientX - rect.left) / rect.width * SVG_WIDTH,
            y: (event.clientY - rect.top) / rect.height * SVG_HEIGHT
        };

    }


    nodeElements.forEach(function (item) {

        item.group.addEventListener("pointerdown", function (event) {

            event.preventDefault();

            activeDrag = item;

            item.dragging = true;

            item.group.setPointerCapture(event.pointerId);

            showHover(item);

        });


        item.group.addEventListener("pointermove", function (event) {

            if (activeDrag !== item) {
                return;
            }

            var p = pointerPosition(event);

            item.data.x = Math.max(
                2,
                Math.min(98, p.x / SVG_WIDTH * 100)
            );

            item.data.y = Math.max(
                4,
                Math.min(92, p.y / SVG_HEIGHT * 100)
            );

            updatePositions();

            dimElementsBehindLabel(item);

        });


        item.group.addEventListener("pointerup", function (event) {

            if (activeDrag !== item) {
                return;
            }

            activeDrag = null;
            item.dragging = false;

            try {
                item.group.releasePointerCapture(event.pointerId);
            } catch (error) {}

        });


        item.group.addEventListener("pointercancel", function () {

            activeDrag = null;
            item.dragging = false;

        });


        /*
         * Project nodes lead to the Projects panel.
         */

        if (isProject(item.data)) {

            item.group.addEventListener("click", function (event) {

                /*
                 * Ignore a click that was actually a drag.
                 */

                if (item.dragging) {
                    return;
                }

                var projectsTab =
                    document.getElementById("tab-projects");

                if (projectsTab) {
                    projectsTab.click();
                }

            });

        }

    });


    /* =========================================================
       RESIZE
       ========================================================= */

    window.addEventListener("resize", function () {

        updatePositions();

        nodeElements.forEach(function (item) {
            if (item.group.classList.contains("is-hovered")) {
                dimElementsBehindLabel(item);
            }
        });

    });


    /* =========================================================
       INITIALISE
       ========================================================= */

    updatePositions();

})();