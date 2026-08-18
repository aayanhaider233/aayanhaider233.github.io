(function () {
    "use strict";
    var container =
        document.getElementById(
            "research-landscape"
        );
    if (
        !container ||
        typeof RESEARCH_LANDSCAPE === "undefined"
    ) {
        return;
    }
    var NS =
        "http://www.w3.org/2000/svg";
    var nodes =
        RESEARCH_LANDSCAPE.nodes;
    var edges =
        RESEARCH_LANDSCAPE.edges;
    var nodeMap = {};
    nodes.forEach(function (node) {
        nodeMap[node.id] = node;
    });
    var SVG_WIDTH = 1000;
    var SVG_HEIGHT = 600;
    var NODE_RADIUS = 8;
    var DIAMOND_SIZE = 16;
    var svg =
        document.createElementNS(
            NS,
            "svg"
        );
    svg.setAttribute(
        "viewBox",
        "0 0 " +
        SVG_WIDTH +
        " " +
        SVG_HEIGHT
    );
    svg.setAttribute(
        "preserveAspectRatio",
        "xMidYMid meet"
    );
    var edgeLayer =
        document.createElementNS(
            NS,
            "g"
        );
    var nodeLayer =
        document.createElementNS(
            NS,
            "g"
        );
    var labelLayer =
        document.createElementNS(
            NS,
            "g"
        );
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
    svg.appendChild(
        edgeLayer
    );
    svg.appendChild(
        nodeLayer
    );
    svg.appendChild(
        labelLayer
    );
    container.appendChild(
        svg
    );
    var fieldIndicator =
        document.createElement(
            "div"
        );
    fieldIndicator.className =
        "research-field-indicator";
    container.appendChild(
        fieldIndicator
    );
    fieldIndicator.addEventListener(
        "transitionend",
        function (event) {
            if (
                event.propertyName !== "transform"
            ) {
                return;
            }
            if (
                fieldIndicator.classList.contains(
                    "is-hidden-right"
                ) &&
                !fieldIndicator.classList.contains(
                    "is-visible"
                )
            ) {
                fieldIndicator.style.transition =
                    "none";
                fieldIndicator.classList.remove(
                    "is-hidden-right"
                );
                void fieldIndicator.offsetWidth;
                fieldIndicator.style.transition =
                    "";
            }
        }
    );
    function populateFieldIndicator(
        fields
    ) {
        fieldIndicator.innerHTML =
            "";
        fields.forEach(
            function (fieldName) {
                var row =
                    document.createElement(
                        "div"
                    );
                row.className =
                    "research-field-indicator-item";
                row.textContent =
                    fieldName;
                fieldIndicator.appendChild(
                    row
                );
            }
        );
    }
    function showFieldIndicator(
        node
    ) {
        if (
            !isWorkNode(node) ||
            !node.fields ||
            !node.fields.length
        ) {
            return;
        }
        populateFieldIndicator(
            node.fields
        );
        fieldIndicator.classList.remove(
            "is-hidden-right"
        );
        fieldIndicator.classList.add(
            "is-visible"
        );
    }
    function hideFieldIndicator() {
        fieldIndicator.classList.remove(
            "is-visible"
        );
        fieldIndicator.classList.add(
            "is-hidden-right"
        );
    }
    var workCount =
        document.createElement(
            "div"
        );
    workCount.className =
        "research-work-count";
    container.appendChild(
        workCount
    );
    workCount.addEventListener(
        "transitionend",
        function (event) {
            if (
                event.propertyName !== "transform"
            ) {
                return;
            }
            if (
                workCount.classList.contains(
                    "is-hidden-left"
                ) &&
                !workCount.classList.contains(
                    "is-visible"
                )
            ) {
                workCount.style.transition =
                    "none";
                workCount.classList.remove(
                    "is-hidden-left"
                );
                void workCount.offsetWidth;
                workCount.style.transition =
                    "";
            }
        }
    );
    function countMatchingProjects(
        fields
    ) {
        if (
            typeof PROJECTS === "undefined" ||
            !Array.isArray(PROJECTS)
        ) {
            return 0;
        }
        return PROJECTS.filter(
            function (project) {
                return fields.every(
                    function (field) {
                        return (
                            project.fields || []
                        ).includes(
                            field
                        );
                    }
                );
            }
        ).length;
    }
    function showWorkCount(
        node
    ) {
        if (
            !isWorkNode(node) ||
            !node.fields ||
            !node.fields.length
        ) {
            return;
        }
        var count =
            countMatchingProjects(
                node.fields
            );
        workCount.textContent =
            count +
            (
                count === 1 ?
                    " work" :
                    " works"
            );
        workCount.classList.remove(
            "is-hidden-left"
        );
        workCount.classList.add(
            "is-visible"
        );
    }
    function hideWorkCount() {
        workCount.classList.remove(
            "is-visible"
        );
        workCount.classList.add(
            "is-hidden-left"
        );
    }
    function createElement(
        type,
        attributes
    ) {
        var element =
            document.createElementNS(
                NS,
                type
            );
        Object.keys(
            attributes
        ).forEach(
            function (key) {
                element.setAttribute(
                    key,
                    attributes[key]
                );
            }
        );
        return element;
    }
    function isWorkNode(node) {
        return node.type === "work";
    }
    function getPosition(node) {
        return {
            x:
                node.x /
                100 *
                SVG_WIDTH,
            y:
                node.y /
                100 *
                SVG_HEIGHT
        };
    }
    function clamp(
        value,
        min,
        max
    ) {
        return Math.max(
            min,
            Math.min(
                max,
                value
            )
        );
    }
    function nodeBoundaryDistance(
        node,
        dx,
        dy
    ) {
        var length =
            Math.hypot(
                dx,
                dy
            );
        if (
            length === 0
        ) {
            return 0;
        }
        var ux =
            dx / length;
        var uy =
            dy / length;
        if (
            node.type === "exploring" ||
            node.type === "emerging"
        ) {
            return NODE_RADIUS;
        }
        var halfSide =
            DIAMOND_SIZE / 2;
        return (
            halfSide /
            (
                Math.abs(ux) +
                Math.abs(uy)
            )
        );
    }
    function getClippedEdge(
        source,
        target
    ) {
        var sourcePosition =
            getPosition(
                source
            );
        var targetPosition =
            getPosition(
                target
            );
        var dx =
            targetPosition.x -
            sourcePosition.x;
        var dy =
            targetPosition.y -
            sourcePosition.y;
        var length =
            Math.hypot(
                dx,
                dy
            );
        if (
            length === 0
        ) {
            return {
                x1:
                    sourcePosition.x,
                y1:
                    sourcePosition.y,
                x2:
                    targetPosition.x,
                y2:
                    targetPosition.y
            };
        }
        var ux =
            dx / length;
        var uy =
            dy / length;
        var sourceOffset =
            nodeBoundaryDistance(
                source,
                dx,
                dy
            );
        var targetOffset =
            nodeBoundaryDistance(
                target,
                -dx,
                -dy
            );
        var inset = 0.8;
        sourceOffset += inset;
        targetOffset += inset;
        return {
            x1:
                sourcePosition.x +
                ux *
                sourceOffset,
            y1:
                sourcePosition.y +
                uy *
                sourceOffset,
            x2:
                targetPosition.x -
                ux *
                targetOffset,
            y2:
                targetPosition.y -
                uy *
                targetOffset
        };
    }
    var edgeElements = [];
    edges.forEach(function (edge) {
        var sourceNode =
            nodeMap[edge.source];
        var targetNode =
            nodeMap[edge.target];
        var isFieldEdge =
            !isWorkNode(sourceNode) &&
            !isWorkNode(targetNode);
        var line =
            createElement(
                "line",
                {
                    class:
                        "research-edge" +
                        (
                            isFieldEdge ?
                                " is-field-edge" :
                                ""
                        )
                }
            );
        edgeLayer.appendChild(
            line
        );
        edgeElements.push({
            data:
                edge,
            element:
                line
        });
    });
    var nodeElements = [];
    nodes.forEach(function (node) {
        var group =
            createElement(
                "g",
                {
                    class:
                        "research-node " +
                        node.type
                }
            );
        group.dataset.nodeId =
            node.id;
        if (
            isWorkNode(node)
        ) {
            group.classList.add(
                "is-project"
            );
        }
        var shape;
        if (
            isWorkNode(node)
        ) {
            shape =
                createElement(
                    "rect",
                    {
                        class:
                            "node-shape",
                        x:
                            -DIAMOND_SIZE / 2,
                        y:
                            -DIAMOND_SIZE / 2,
                        width:
                            DIAMOND_SIZE,
                        height:
                            DIAMOND_SIZE,
                        transform:
                            "rotate(45)"
                    }
                );
        } else {
            shape =
                createElement(
                    "circle",
                    {
                        class:
                            "node-shape",
                        cx: 0,
                        cy: 0,
                        r:
                            NODE_RADIUS
                    }
                );
        }
        var hoverShape;
        if (
            isWorkNode(node)
        ) {
            hoverShape =
                createElement(
                    "rect",
                    {
                        class:
                            "node-hover-shape",
                        x:
                            -DIAMOND_SIZE / 2,
                        y:
                            -DIAMOND_SIZE / 2,
                        width:
                            DIAMOND_SIZE,
                        height:
                            DIAMOND_SIZE,
                        transform:
                            "rotate(45)"
                    }
                );
        } else {
            hoverShape =
                createElement(
                    "circle",
                    {
                        class:
                            "node-hover-shape",
                        cx: 0,
                        cy: 0,
                        r:
                            NODE_RADIUS
                    }
                );
        }
        group.appendChild(
            hoverShape
        );
        group.appendChild(
            shape
        );
        nodeLayer.appendChild(
            group
        );
        var labelGroup =
            createElement(
                "g",
                {
                    class:
                        "research-label-group"
                }
            );
        var backdrop =
            createElement(
                "rect",
                {
                    class:
                        "research-label-backdrop",
                    rx: 3,
                    ry: 3
                }
            );
        var label =
            createElement(
                "text",
                {
                    class:
                        "research-label",
                    "text-anchor":
                        "middle"
                }
            );
        if (
            !isWorkNode(node)
        ) {
            label.textContent =
                node.name;
        }
        labelGroup.appendChild(
            backdrop
        );
        labelGroup.appendChild(
            label
        );
        var projectHint =
            null;
        if (
            isWorkNode(node)
        ) {
            projectHint =
                createElement(
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
                "Click to explore related projects";
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
            isHovered: false,
            pointerDownPosition: null,
            vx: 0,
            vy: 0
        });
    });
    function updateEdges() {
        edgeElements.forEach(
            function (item) {
                var source =
                    nodeMap[
                    item.data.source
                    ];
                var target =
                    nodeMap[
                    item.data.target
                    ];
                var clipped =
                    getClippedEdge(
                        source,
                        target
                    );
                item.element.setAttribute(
                    "x1",
                    clipped.x1
                );
                item.element.setAttribute(
                    "y1",
                    clipped.y1
                );
                item.element.setAttribute(
                    "x2",
                    clipped.x2
                );
                item.element.setAttribute(
                    "y2",
                    clipped.y2
                );
            }
        );
    }
    function positionLabel(
        item
    ) {
        var position =
            getPosition(
                item.data
            );
        var candidates = [
            {
                x:
                    position.x,
                y:
                    position.y - 25
            },
        ];
        var best =
            candidates[0];
        var bestScore =
            Infinity;
        candidates.forEach(
            function (candidate) {
                var score =
                    0;
                nodes.forEach(
                    function (other) {
                        if (
                            other.id ===
                            item.data.id
                        ) {
                            return;
                        }
                        var otherPosition =
                            getPosition(
                                other
                            );
                        var distance =
                            Math.hypot(
                                candidate.x -
                                otherPosition.x,
                                candidate.y -
                                otherPosition.y
                            );
                        if (
                            distance < 55
                        ) {
                            score +=
                                55 -
                                distance;
                        }
                    }
                );
                if (
                    score <
                    bestScore
                ) {
                    bestScore =
                        score;
                    best =
                        candidate;
                }
            }
        );
        item.label.setAttribute(
            "x",
            best.x
        );
        item.label.setAttribute(
            "y",
            best.y
        );
        if (
            item.projectHint
        ) {
            item.projectHint.setAttribute(
                "x",
                best.x
            );
            item.projectHint.setAttribute(
                "y",
                best.y
            );
        }
        var labelBox =
            item.label.getBBox();
        if (
            item.projectHint
        ) {
            var hintBox =
                item.projectHint.getBBox();
            var left =
                Math.min(
                    labelBox.x,
                    hintBox.x
                );
            var top =
                Math.min(
                    labelBox.y,
                    hintBox.y
                );
            var right =
                Math.max(
                    labelBox.x +
                    labelBox.width,
                    hintBox.x +
                    hintBox.width
                );
            var bottom =
                Math.max(
                    labelBox.y +
                    labelBox.height,
                    hintBox.y +
                    hintBox.height
                );
            item.backdrop.setAttribute(
                "x",
                left - 5
            );
            item.backdrop.setAttribute(
                "y",
                top - 3
            );
            item.backdrop.setAttribute(
                "width",
                right -
                left +
                10
            );
            item.backdrop.setAttribute(
                "height",
                bottom -
                top +
                6
            );
        } else {
            item.backdrop.setAttribute(
                "x",
                labelBox.x - 5
            );
            item.backdrop.setAttribute(
                "y",
                labelBox.y - 3
            );
            item.backdrop.setAttribute(
                "width",
                labelBox.width + 10
            );
            item.backdrop.setAttribute(
                "height",
                labelBox.height + 6
            );
        }
    }
    function pointInsideBox(
        x,
        y,
        box
    ) {
        return (
            x >= box.x &&
            x <=
            box.x +
            box.width &&
            y >= box.y &&
            y <=
            box.y +
            box.height
        );
    }
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
            x1 +
            t * dx;
        var y =
            y1 +
            t * dy;
        return Math.hypot(
            px - x,
            py - y
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
    function dimBehindLabel(
        item
    ) {
        clearObscured();
        var textBoxes = [];
        if (
            item.label &&
            item.label.textContent.trim() !== ""
        ) {
            textBoxes.push(
                item.label.getBBox()
            );
        }
        if (
            item.projectHint &&
            item.projectHint.textContent.trim() !== ""
        ) {
            textBoxes.push(
                item.projectHint.getBBox()
            );
        }
        if (
            textBoxes.length === 0
        ) {
            return;
        }
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
                var overlaps =
                    textBoxes.some(
                        function (box) {
                            return pointInsideBox(
                                position.x,
                                position.y,
                                box
                            );
                        }
                    );
                if (
                    overlaps
                ) {
                    other.group.classList.add(
                        "is-obscured"
                    );
                }
            }
        );
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
                var overlaps =
                    textBoxes.some(
                        function (box) {
                            return lineIntersectsBox(
                                source.x,
                                source.y,
                                target.x,
                                target.y,
                                box
                            );
                        }
                    );
                if (
                    overlaps
                ) {
                    edge.element.classList.add(
                        "is-obscured"
                    );
                }
            }
        );
    }
    function showHover(
        item
    ) {
        nodeElements.forEach(
            function (other) {
                if (
                    other === item
                ) {
                    return;
                }
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
        );
        item.group.classList.add(
            "is-hovered"
        );
        item.label.classList.add(
            "is-visible"
        );
        item.backdrop.classList.add(
            "is-visible"
        );
        if (
            item.projectHint
        ) {
            item.projectHint.classList.add(
                "is-visible"
            );
        }
        dimBehindLabel(
            item
        );
        showFieldIndicator(
            item.data
        );
        showWorkCount(
            item.data
        );
    }
    function hideHover(
        item
    ) {
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
        hideFieldIndicator();
        hideWorkCount();
    }
    var activeDrag =
        null;
    function getPointerPosition(
        event
    ) {
        var rect =
            svg.getBoundingClientRect();
        var scale =
            Math.min(
                rect.width /
                SVG_WIDTH,
                rect.height /
                SVG_HEIGHT
            );
        var renderedWidth =
            SVG_WIDTH *
            scale;
        var renderedHeight =
            SVG_HEIGHT *
            scale;
        var offsetX =
            (
                rect.width -
                renderedWidth
            ) / 2;
        var offsetY =
            (
                rect.height -
                renderedHeight
            ) / 2;
        return {
            x:
                (
                    event.clientX -
                    rect.left -
                    offsetX
                ) /
                scale,
            y:
                (
                    event.clientY -
                    rect.top -
                    offsetY
                ) /
                scale
        };
    }
    nodeElements.forEach(
        function (item) {
            item.group.addEventListener(
                "mouseenter",
                function () {
                    item.isHovered = true;
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
                    item.isHovered = false;
                    if (
                        !item.dragging
                    ) {
                        hideHover(
                            item
                        );
                    }
                }
            );
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
                }
            );
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
                    if (
                        movement > 4 &&
                        !item.dragging
                    ) {
                        item.dragging =
                            true;
                        item.vx = 0;
                        item.vy = 0;
                        hideHover(
                            item
                        );
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
                }
            );
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
                    } catch (error) { }
                    if (
                        !item.dragging &&
                        isWorkNode(item.data)
                    ) {
                        window.openProjectsPanel(
                            item.data.fields || []
                        );
                    }
                    item.dragging =
                        false;
                    startForceSimulation();
                    clearObscured();
                    if (
                        item.isHovered
                    ) {
                        showHover(
                            item
                        );
                    }
                }
            );
            item.group.addEventListener(
                "pointercancel",
                function () {
                    activeDrag =
                        null;
                    item.dragging =
                        false;
                    clearObscured();
                    if (
                        item.isHovered
                    ) {
                        showHover(
                            item
                        );
                    }
                }
            );
        }
    );
    var forceAnimation = null;
    var forceRunning = false;
    var FORCE_SETTLE_THRESHOLD = 0.08;
    var FORCE_SETTLE_FRAMES = 12;
    var forceStableFrames = 0;
    function getNodeElement(nodeId) {
        return nodeElements.find(
            function (item) {
                return (
                    item.data.id ===
                    nodeId
                );
            }
        );
    }
    function applyNodeRepulsion() {
        var config =
            RESEARCH_LANDSCAPE_FORCE;
        for (
            var i = 0;
            i < nodeElements.length;
            i++
        ) {
            for (
                var j = i + 1;
                j < nodeElements.length;
                j++
            ) {
                var a =
                    nodeElements[i];
                var b =
                    nodeElements[j];
                if (
                    a.dragging ||
                    b.dragging
                ) {
                    continue;
                }
                var aPosition =
                    getPosition(
                        a.data
                    );
                var bPosition =
                    getPosition(
                        b.data
                    );
                var dx =
                    aPosition.x -
                    bPosition.x;
                var dy =
                    aPosition.y -
                    bPosition.y;
                var distance =
                    Math.hypot(
                        dx,
                        dy
                    );
                if (
                    distance < 0.001
                ) {
                    distance = 0.001;
                }
                if (
                    distance >=
                    config.minDistance
                ) {
                    continue;
                }
                var strength =
                    (
                        config.minDistance -
                        distance
                    ) /
                    config.minDistance;
                strength *=
                    config.repulsion;
                var ux =
                    dx /
                    distance;
                var uy =
                    dy /
                    distance;
                a.vx +=
                    ux *
                    strength;
                a.vy +=
                    uy *
                    strength;
                b.vx -=
                    ux *
                    strength;
                b.vy -=
                    uy *
                    strength;
            }
        }
    }
    function applyEdgeAttraction() {
        var config =
            RESEARCH_LANDSCAPE_FORCE;
        edges.forEach(
            function (edge) {
                var source =
                    getNodeElement(
                        edge.source
                    );
                var target =
                    getNodeElement(
                        edge.target
                    );
                if (
                    !source ||
                    !target ||
                    source.dragging ||
                    target.dragging
                ) {
                    return;
                }
                var sourcePosition =
                    getPosition(
                        source.data
                    );
                var targetPosition =
                    getPosition(
                        target.data
                    );
                var dx =
                    targetPosition.x -
                    sourcePosition.x;
                var dy =
                    targetPosition.y -
                    sourcePosition.y;
                var distance =
                    Math.hypot(
                        dx,
                        dy
                    );
                if (
                    distance < 0.001
                ) {
                    return;
                }
                var difference =
                    distance -
                    config.idealEdgeLength;
                var force =
                    difference *
                    config.attraction;
                force =
                    clamp(
                        force,
                        -1.5,
                        1.5
                    );
                var ux =
                    dx /
                    distance;
                var uy =
                    dy /
                    distance;
                source.vx +=
                    ux *
                    force;
                source.vy +=
                    uy *
                    force;
                target.vx -=
                    ux *
                    force;
                target.vy -=
                    uy *
                    force;
            }
        );
    }
    function updateForceSimulation() {
        var config =
            RESEARCH_LANDSCAPE_FORCE;
        applyNodeRepulsion();
        applyEdgeAttraction();
        var totalMovement =
            0;
        nodeElements.forEach(
            function (item) {
                if (
                    item.dragging
                ) {
                    item.vx = 0;
                    item.vy = 0;
                    return;
                }
                item.vx *= config.damping;
                item.vy *= config.damping;
                item.vx = clamp(item.vx, -2, 2);
                item.vy = clamp(item.vy, -2, 2);
                var movement =
                    Math.hypot(
                        item.vx,
                        item.vy
                    );
                totalMovement +=
                    movement;
                var position =
                    getPosition(
                        item.data
                    );
                var newX =
                    position.x +
                    item.vx;
                var newY =
                    position.y +
                    item.vy;
                newX =
                    clamp(
                        newX,
                        20,
                        SVG_WIDTH - 20
                    );
                newY =
                    clamp(
                        newY,
                        20,
                        SVG_HEIGHT - 20
                    );
                item.data.x =
                    newX /
                    SVG_WIDTH *
                    100;
                item.data.y =
                    newY /
                    SVG_HEIGHT *
                    100;
            }
        );
        updatePositions();
        if (
            totalMovement <
            FORCE_SETTLE_THRESHOLD
        ) {
            forceStableFrames++;
        } else {
            forceStableFrames = 0;
        }
        if (
            forceStableFrames >=
            FORCE_SETTLE_FRAMES
        ) {
            stopForceSimulation();
        }
    }
    function startForceSimulation() {
        if (
            !RESEARCH_LANDSCAPE_FORCE.enabled
        ) {
            return;
        }
        if (
            forceRunning
        ) {
            return;
        }
        forceRunning =
            true;
        forceStableFrames =
            0;
        forceAnimation =
            requestAnimationFrame(
                forceLoop
            );
    }
    function stopForceSimulation() {
        forceRunning =
            false;
        forceStableFrames =
            0;
        if (
            forceAnimation !== null
        ) {
            cancelAnimationFrame(
                forceAnimation
            );
            forceAnimation =
                null;
        }
        nodeElements.forEach(
            function (item) {
                item.vx = 0;
                item.vy = 0;
            }
        );
    }
    function forceLoop() {
        if (
            !forceRunning
        ) {
            return;
        }
        var iterations =
            RESEARCH_LANDSCAPE_FORCE
                .iterationsPerFrame;
        for (
            var i = 0;
            i < iterations;
            i++
        ) {
            updateForceSimulation();
            if (
                !forceRunning
            ) {
                return;
            }
        }
        forceAnimation =
            requestAnimationFrame(
                forceLoop
            );
    }
    updatePositions();
    startForceSimulation();
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
        updateEdges();
    }
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
    updatePositions();
})();