(function () {

    "use strict";


    /* =========================================================
       INITIALISATION
       ========================================================= */

    var container = document.getElementById("research-landscape");

    if (
        !container ||
        typeof RESEARCH_LANDSCAPE === "undefined"
    ) {
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

    var SVG_WIDTH = 1000;
    var SVG_HEIGHT = 600;

    var NODE_RADIUS = 6;


    var svg = document.createElementNS(NS, "svg");

    svg.setAttribute(
        "viewBox",
        "0 0 " + SVG_WIDTH + " " + SVG_HEIGHT
    );

    svg.setAttribute(
        "preserveAspectRatio",
        "none"
    );


    var edgeLayer = document.createElementNS(NS, "g");
    var nodeLayer = document.createElementNS(NS, "g");
    var labelLayer = document.createElementNS(NS, "g");


    edgeLayer.setAttribute(
        "class",
        "research-edge-layer"
    );

    nodeLayer.setAttribute(
        "class",
        "research-node-layer"
    );

    labelLayer.setAttribute(
        "class",
        "research-label-layer"
    );


    svg.appendChild(edgeLayer);
    svg.appendChild(nodeLayer);
    svg.appendChild(labelLayer);

    container.appendChild(svg);


    /* =========================================================
       HELPERS
       ========================================================= */

    function createElement(type, attributes) {

        var element =
            document.createElementNS(NS, type);

        Object.keys(attributes).forEach(function (key) {

            element.setAttribute(
                key,
                attributes[key]
            );

        });

        return element;
    }


    function isProject(node) {

        return (
            node.type === "unpublished" ||
            node.type === "published"
        );

    }


    function getPosition(node) {

        return {

            x:
                node.x / 100 *
                SVG_WIDTH,

            y:
                node.y / 100 *
                SVG_HEIGHT

        };

    }


    function clamp(value, min, max) {

        return Math.max(
            min,
            Math.min(max, value)
        );

    }


    /* =========================================================
       EDGES
       ========================================================= */

    var edgeElements = [];


    edges.forEach(function (edge) {

        var line = createElement(
            "line",
            {
                class: "research-edge"
            }
        );


        edgeLayer.appendChild(line);


        edgeElements.push({

            data: edge,

            element: line

        });

    });


    /* =========================================================
       NODES
       ========================================================= */

    var nodeElements = [];


    nodes.forEach(function (node) {

        var group = createElement(
            "g",
            {
                class:
                    "research-node " +
                    node.type
            }
        );


        group.dataset.nodeId = node.id;


        if (isProject(node)) {

            group.classList.add(
                "is-project"
            );

        }


        /* -----------------------------------------------------
           Main shape
           ----------------------------------------------------- */

        var shape;


        if (isProject(node)) {

            shape = createElement(
                "rect",
                {
                    class: "node-shape",

                    x: -NODE_RADIUS,

                    y: -NODE_RADIUS,

                    width:
                        NODE_RADIUS * 2,

                    height:
                        NODE_RADIUS * 2,

                    transform: "rotate(45)"
                }
            );

        } else {

            shape = createElement(
                "circle",
                {
                    class: "node-shape",

                    cx: 0,

                    cy: 0,

                    r: NODE_RADIUS
                }
            );

        }


        /* -----------------------------------------------------
           Larger hover shape
           ----------------------------------------------------- */

        var hoverShape;


        if (isProject(node)) {

            hoverShape = createElement(
                "rect",
                {
                    class:
                        "node-hover-shape",

                    x: -NODE_RADIUS,

                    y: -NODE_RADIUS,

                    width:
                        NODE_RADIUS * 2,

                    height:
                        NODE_RADIUS * 2,

                    transform: "rotate(45)"
                }
            );

        } else {

            hoverShape = createElement(
                "circle",
                {
                    class:
                        "node-hover-shape",

                    cx: 0,

                    cy: 0,

                    r: NODE_RADIUS
                }
            );

        }


        /*
         * Hover shape must be underneath
         * the actual node.
         */

        group.appendChild(
            hoverShape
        );

        group.appendChild(
            shape
        );


        nodeLayer.appendChild(
            group
        );


        /* -----------------------------------------------------
           Label group
           ----------------------------------------------------- */

        var labelGroup = createElement(
            "g",
            {
                class:
                    "research-label-group"
            }
        );


        var backdrop = createElement(
            "rect",
            {
                class:
                    "research-label-backdrop",

                rx: 4,

                ry: 4
            }
        );


        var label = createElement(
            "text",
            {
                class:
                    "research-label",

                "text-anchor":
                    "middle"
            }
        );


        /*
         * Interest labels contain the interest name.
         */

        if (!isProject(node)) {

            label.textContent =
                node.name;

        }


        labelGroup.appendChild(
            backdrop
        );

        labelGroup.appendChild(
            label
        );


        /*
         * Project nodes do NOT display their
         * name on hover.
         */

        var projectHint = null;


        if (isProject(node)) {

            projectHint = createElement(
                "text",
                {
                    class:
                        "research-label " +
                        "research-project-hint",

                    "text-anchor":
                        "middle"
                }
            );


            projectHint.textContent =
                "click to explore related projects";


            labelGroup.appendChild(
                projectHint
            );

        }


        labelLayer.appendChild(
            labelGroup
        );


        nodeElements.push({

            data: node,

            group: group,

            shape: shape,

            hoverShape: hoverShape,

            labelGroup: labelGroup,

            backdrop: backdrop,

            label: label,

            projectHint: projectHint,

            dragging: false,

            pointerDownPosition: null

        });

    });


    /* =========================================================
       LABEL POSITIONING
       ========================================================= */

    function positionLabel(item) {

        var node =
            item.data;

        var position =
            getPosition(node);


        /*
         * Labels try several nearby positions.
         *
         * The first candidate is directly above
         * the node, which gives the cleanest
         * appearance in most cases.
         */

        var candidates = [

            {
                x: position.x,
                y: position.y - 22
            },

            {
                x: position.x + 58,
                y: position.y
            },

            {
                x: position.x - 58,
                y: position.y
            },

            {
                x: position.x,
                y: position.y + 30
            },

            {
                x: position.x + 48,
                y: position.y - 25
            },

            {
                x: position.x - 48,
                y: position.y - 25
            }

        ];


        var bestCandidate =
            candidates[0];

        var bestScore =
            Infinity;


        candidates.forEach(
            function (candidate) {

                var score = 0;


                /*
                 * Penalise nearby nodes.
                 */

                nodes.forEach(
                    function (otherNode) {

                        if (
                            otherNode.id ===
                            node.id
                        ) {
                            return;
                        }


                        var otherPosition =
                            getPosition(
                                otherNode
                            );


                        var dx =
                            candidate.x -
                            otherPosition.x;

                        var dy =
                            candidate.y -
                            otherPosition.y;


                        var distance =
                            Math.sqrt(
                                dx * dx +
                                dy * dy
                            );


                        if (
                            distance < 80
                        ) {

                            score +=
                                80 -
                                distance;

                        }

                    }
                );


                /*
                 * Penalise edges crossing
                 * the candidate.
                 */

                edges.forEach(
                    function (edge) {

                        var source =
                            getPosition(
                                nodeMap[
                                    edge.source
                                ]
                            );

                        var target =
                            getPosition(
                                nodeMap[
                                    edge.target
                                ]
                            );


                        var distance =
                            pointToSegmentDistance(
                                candidate.x,
                                candidate.y,

                                source.x,
                                source.y,

                                target.x,
                                target.y
                            );


                        if (
                            distance < 30
                        ) {

                            score +=
                                (30 - distance) *
                                0.5;

                        }

                    }
                );


                if (
                    score <
                    bestScore
                ) {

                    bestScore =
                        score;

                    bestCandidate =
                        candidate;

                }

            }
        );


        item.label.setAttribute(
            "x",
            bestCandidate.x
        );

        item.label.setAttribute(
            "y",
            bestCandidate.y
        );


        /*
         * Project hint sits directly underneath
         * the project instruction.
         */

        if (
            item.projectHint
        ) {

            item.projectHint.setAttribute(
                "x",
                bestCandidate.x
            );

            item.projectHint.setAttribute(
                "y",
                bestCandidate.y + 17
            );

        }


        /*
         * Label background.
         */

        var box =
            item.label.getBBox();


        /*
         * For project nodes, the background
         * needs to cover both lines.
         */

        if (
            item.projectHint
        ) {

            var hintBox =
                item.projectHint.getBBox();


            var left =
                Math.min(
                    box.x,
                    hintBox.x
                );

            var top =
                Math.min(
                    box.y,
                    hintBox.y
                );

            var right =
                Math.max(
                    box.x + box.width,
                    hintBox.x +
                    hintBox.width
                );

            var bottom =
                Math.max(
                    box.y + box.height,
                    hintBox.y +
                    hintBox.height
                );


            item.backdrop.setAttribute(
                "x",
                left - 7
            );

            item.backdrop.setAttribute(
                "y",
                top - 5
            );

            item.backdrop.setAttribute(
                "width",
                right - left + 14
            );

            item.backdrop.setAttribute(
                "height",
                bottom - top + 10
            );

        } else {

            item.backdrop.setAttribute(
                "x",
                box.x - 7
            );

            item.backdrop.setAttribute(
                "y",
                box.y - 5
            );

            item.backdrop.setAttribute(
                "width",
                box.width + 14
            );

            item.backdrop.setAttribute(
                "height",
                box.height + 10
            );

        }

    }


    /* =========================================================
       POSITION EVERYTHING
       ========================================================= */

    function updatePositions() {

        nodeElements.forEach(
            function (item) {

                var position =
                    getPosition(
                        item.data
                    );


                item.group.setAttribute(
                    "transform",

                    "translate(" +
                    position.x +
                    " " +
                    position.y +
                    ")"
                );


                positionLabel(
                    item
                );

            }
        );


        edgeElements.forEach(
            function (item) {

                var source =
                    getPosition(
                        nodeMap[
                            item.data.source
                        ]
                    );

                var target =
                    getPosition(
                        nodeMap[
                            item.data.target
                        ]
                    );


                item.element.setAttribute(
                    "x1",
                    source.x
                );

                item.element.setAttribute(
                    "y1",
                    source.y
                );

                item.element.setAttribute(
                    "x2",
                    target.x
                );

                item.element.setAttribute(
                    "y2",
                    target.y
                );

            }
        );

    }


    /* =========================================================
       GEOMETRY
       ========================================================= */

    function pointToSegmentDistance(
        px,
        py,
        x1,
        y1,
        x2,
        y2
    ) {

        var dx =
            x2 - x1;

        var dy =
            y2 - y1;


        if (
            dx === 0 &&
            dy === 0
        ) {

            return Math.hypot(
                px - x1,
                py - y1
            );

        }


        var t =
            (
                (px - x1) * dx +
                (py - y1) * dy
            ) /
            (
                dx * dx +
                dy * dy
            );


        t =
            Math.max(
                0,
                Math.min(
                    1,
                    t
                )
            );


        var x =
            x1 + t * dx;

        var y =
            y1 + t * dy;


        return Math.hypot(
            px - x,
            py - y
        );

    }


    /* =========================================================
       DIM ELEMENTS BEHIND LABEL
       ========================================================= */

    function clearObscured() {

        nodeElements.forEach(
            function (item) {

                item.group.classList.remove(
                    "is-obscured"
                );

            }
        );


        edgeElements.forEach(
            function (item) {

                item.element.classList.remove(
                    "is-obscured"
                );

            }
        );

    }


    function dimBehindLabel(item) {

        clearObscured();


        var box =
            item.label.getBBox();


        var padding = 6;


        var labelBox = {

            x:
                box.x - padding,

            y:
                box.y - padding,

            width:
                box.width +
                padding * 2,

            height:
                box.height +
                padding * 2

        };


        /*
         * Project instruction is also part
         * of the label area.
         */

        if (
            item.projectHint
        ) {

            var hintBox =
                item.projectHint.getBBox();


            var left =
                Math.min(
                    labelBox.x,
                    hintBox.x -
                    padding
                );

            var top =
                Math.min(
                    labelBox.y,
                    hintBox.y -
                    padding
                );

            var right =
                Math.max(
                    labelBox.x +
                    labelBox.width,

                    hintBox.x +
                    hintBox.width +
                    padding
                );

            var bottom =
                Math.max(
                    labelBox.y +
                    labelBox.height,

                    hintBox.y +
                    hintBox.height +
                    padding
                );


            labelBox = {

                x: left,

                y: top,

                width:
                    right - left,

                height:
                    bottom - top

            };

        }


        /*
         * Nodes under label.
         */

        nodeElements.forEach(
            function (other) {

                if (
                    other === item
                ) {
                    return;
                }


                var position =
                    getPosition(
                        other.data
                    );


                if (
                    pointInsideBox(
                        position.x,
                        position.y,
                        labelBox
                    )
                ) {

                    other.group.classList.add(
                        "is-obscured"
                    );

                }

            }
        );


        /*
         * Edges under label.
         */

        edgeElements.forEach(
            function (edge) {

                var source =
                    getPosition(
                        nodeMap[
                            edge.data.source
                        ]
                    );

                var target =
                    getPosition(
                        nodeMap[
                            edge.data.target
                        ]
                    );


                if (
                    lineIntersectsBox(
                        source.x,
                        source.y,

                        target.x,
                        target.y,

                        labelBox
                    )
                ) {

                    edge.element.classList.add(
                        "is-obscured"
                    );

                }

            }
        );

    }


    function pointInsideBox(
        x,
        y,
        box
    ) {

        return (
            x >= box.x &&
            x <= box.x + box.width &&
            y >= box.y &&
            y <= box.y + box.height
        );

    }


    function lineIntersectsBox(
        x1,
        y1,
        x2,
        y2,
        box
    ) {

        if (
            pointInsideBox(
                x1,
                y1,
                box
            ) ||
            pointInsideBox(
                x2,
                y2,
                box
            )
        ) {

            return true;

        }


        var left =
            box.x;

        var right =
            box.x +
            box.width;

        var top =
            box.y;

        var bottom =
            box.y +
            box.height;


        return (

            segmentsIntersect(
                x1,
                y1,
                x2,
                y2,

                left,
                top,
                right,
                top
            )

            ||

            segmentsIntersect(
                x1,
                y1,
                x2,
                y2,

                right,
                top,
                right,
                bottom
            )

            ||

            segmentsIntersect(
                x1,
                y1,
                x2,
                y2,

                right,
                bottom,
                left,
                bottom
            )

            ||

            segmentsIntersect(
                x1,
                y1,
                x2,
                y2,

                left,
                bottom,
                left,
                top
            )

        );

    }


    function segmentsIntersect(
        x1,
        y1,
        x2,
        y2,
        x3,
        y3,
        x4,
        y4
    ) {

        function direction(
            ax,
            ay,
            bx,
            by,
            cx,
            cy
        ) {

            return (
                (cx - ax) *
                (by - ay)

                -

                (cy - ay) *
                (bx - ax)
            );

        }


        var d1 =
            direction(
                x3,
                y3,
                x4,
                y4,
                x1,
                y1
            );

        var d2 =
            direction(
                x3,
                y3,
                x4,
                y4,
                x2,
                y2
            );

        var d3 =
            direction(
                x1,
                y1,
                x2,
                y2,
                x3,
                y3
            );

        var d4 =
            direction(
                x1,
                y1,
                x2,
                y2,
                x4,
                y4
            );


        return (

            (
                (d1 > 0 && d2 < 0) ||
                (d1 < 0 && d2 > 0)
            )

            &&

            (
                (d3 > 0 && d4 < 0) ||
                (d3 < 0 && d4 > 0)
            )

        );

    }


    /* =========================================================
       HOVER
       ========================================================= */

    function showHover(item) {

        /*
         * Hide any other active label first.
         */

        nodeElements.forEach(
            function (other) {

                if (
                    other !== item
                ) {

                    other.group.classList.remove(
                        "is-hovered"
                    );

                    other.label.classList.remove(
                        "is-visible"
                    );

                    other.backdrop.classList.remove(
                        "is-visible"
                    );


                    if (
                        other.projectHint
                    ) {

                        other.projectHint.classList.remove(
                            "is-visible"
                        );

                    }

                }

            }
        );


        item.group.classList.add(
            "is-hovered"
        );


        /*
         * Interest name.
         */

        item.label.classList.add(
            "is-visible"
        );


        /*
         * Project instruction.
         */

        if (
            item.projectHint
        ) {

            item.projectHint.classList.add(
                "is-visible"
            );

        }


        item.backdrop.classList.add(
            "is-visible"
        );


        dimBehindLabel(
            item
        );

    }


    function hideHover(item) {

        /*
         * Don't hide while dragging.
         */

        if (
            item.dragging
        ) {
            return;
        }


        item.group.classList.remove(
            "is-hovered"
        );


        item.label.classList.remove(
            "is-visible"
        );


        item.backdrop.classList.remove(
            "is-visible"
        );


        if (
            item.projectHint
        ) {

            item.projectHint.classList.remove(
                "is-visible"
            );

        }


        clearObscured();

    }


    /* =========================================================
       DRAGGING
       ========================================================= */

    var activeDrag = null;


    function getPointerPosition(
        event
    ) {

        var rect =
            svg.getBoundingClientRect();


        return {

            x:
                (
                    event.clientX -
                    rect.left
                ) /
                rect.width *
                SVG_WIDTH,

            y:
                (
                    event.clientY -
                    rect.top
                ) /
                rect.height *
                SVG_HEIGHT

        };

    }


    nodeElements.forEach(
        function (item) {


            /* -------------------------------------------------
               Hover
               ------------------------------------------------- */

            item.group.addEventListener(
                "mouseenter",
                function () {

                    if (
                        !item.dragging
                    ) {

                        showHover(
                            item
                        );

                    }

                }
            );


            item.group.addEventListener(
                "mouseleave",
                function () {

                    if (
                        !item.dragging
                    ) {

                        hideHover(
                            item
                        );

                    }

                }
            );


            /* -------------------------------------------------
               Pointer down
               ------------------------------------------------- */

            item.group.addEventListener(
                "pointerdown",
                function (event) {

                    event.preventDefault();


                    activeDrag =
                        item;

                    item.dragging =
                        false;


                    item.pointerDownPosition = {
                        x:
                            event.clientX,

                        y:
                            event.clientY
                    };


                    item.group.setPointerCapture(
                        event.pointerId
                    );


                    showHover(
                        item
                    );

                }
            );


            /* -------------------------------------------------
               Pointer move
               ------------------------------------------------- */

            item.group.addEventListener(
                "pointermove",
                function (event) {

                    if (
                        activeDrag !==
                        item
                    ) {
                        return;
                    }


                    var start =
                        item.pointerDownPosition;


                    var movement =
                        Math.hypot(
                            event.clientX -
                            start.x,

                            event.clientY -
                            start.y
                        );


                    /*
                     * Small movement is still a click.
                     * Larger movement becomes dragging.
                     */

                    if (
                        movement > 4
                    ) {

                        item.dragging =
                            true;

                    }


                    if (
                        !item.dragging
                    ) {
                        return;
                    }


                    var pointer =
                        getPointerPosition(
                            event
                        );


                    item.data.x =
                        clamp(
                            pointer.x /
                            SVG_WIDTH *
                            100,

                            2,

                            98
                        );


                    item.data.y =
                        clamp(
                            pointer.y /
                            SVG_HEIGHT *
                            100,

                            4,

                            94
                        );


                    updatePositions();


                    dimBehindLabel(
                        item
                    );

                }
            );


            /* -------------------------------------------------
               Pointer up
               ------------------------------------------------- */

            item.group.addEventListener(
                "pointerup",
                function (event) {

                    if (
                        activeDrag !==
                        item
                    ) {
                        return;
                    }


                    activeDrag =
                        null;


                    try {

                        item.group.releasePointerCapture(
                            event.pointerId
                        );

                    } catch (error) {}


                    /*
                     * If it wasn't actually dragged,
                     * handle project click.
                     */

                    if (
                        !item.dragging &&
                        isProject(item.data)
                    ) {

                        var projectsTab =
                            document.getElementById(
                                "tab-projects"
                            );


                        if (
                            projectsTab
                        ) {

                            projectsTab.click();

                        }

                    }


                    item.dragging =
                        false;

                }
            );


            item.group.addEventListener(
                "pointercancel",
                function () {

                    activeDrag =
                        null;

                    item.dragging =
                        false;

                }
            );

        }
    );


    /* =========================================================
       RESIZE
       ========================================================= */

    window.addEventListener(
        "resize",
        function () {

            updatePositions();


            nodeElements.forEach(
                function (item) {

                    if (
                        item.group.classList.contains(
                            "is-hovered"
                        )
                    ) {

                        dimBehindLabel(
                            item
                        );

                    }

                }
            );

        }
    );


    /* =========================================================
       START
       ========================================================= */

    updatePositions();

})();