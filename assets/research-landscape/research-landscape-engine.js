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


    var SVG_WIDTH = 1000;
    var SVG_HEIGHT = 600;


    var fields =
        RESEARCH_LANDSCAPE.fields || [];

    var intersections =
        RESEARCH_LANDSCAPE.intersections || [];


    /*
     * ==================================================
     * SVG
     * ==================================================
     */

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


    var contourLayer =
        document.createElementNS(
            NS,
            "g"
        );

    contourLayer.setAttribute(
        "class",
        "research-contour-layer"
    );


    var interactionLayer =
        document.createElementNS(
            NS,
            "g"
        );

    interactionLayer.setAttribute(
        "class",
        "research-interaction-layer"
    );


    var labelLayer =
        document.createElementNS(
            NS,
            "g"
        );

    labelLayer.setAttribute(
        "class",
        "research-label-layer"
    );


    svg.appendChild(
        contourLayer
    );

    svg.appendChild(
        interactionLayer
    );

    svg.appendChild(
        labelLayer
    );


    container.appendChild(
        svg
    );


    /*
     * ==================================================
     * FIELD TAG BAR
     * ==================================================
     */

    var fieldBar =
        document.createElement(
            "div"
        );


    fieldBar.className =
        "research-field-bar";


    container.appendChild(
        fieldBar
    );


    var fieldTags = {};


    fields.forEach(
        function (field) {

            var tag =
                document.createElement(
                    "span"
                );


            tag.className =
                "research-field-tag " +
                field.status;


            tag.dataset.fieldId =
                field.id;


            tag.textContent =
                field.name;


            fieldBar.appendChild(
                tag
            );


            fieldTags[field.id] =
                tag;


            tag.addEventListener(
                "mouseenter",
                function () {

                    if (
                        activeIntersection
                    ) {
                        return;
                    }


                    highlightField(
                        field.id
                    );

                }
            );


            tag.addEventListener(
                "mouseleave",
                function () {

                    if (
                        activeIntersection
                    ) {
                        return;
                    }


                    clearFieldHighlight();

                }
            );

        }
    );


    /*
     * ==================================================
     * FIELD CONTOURS
     * ==================================================
     */

    var contourElements = {};


    fields.forEach(
        function (field) {

            var path =
                document.createElementNS(
                    NS,
                    "path"
                );


            path.setAttribute(
                "class",
                "research-contour " +
                field.status
            );


            path.setAttribute(
                "d",
                createContourPath(
                    field.path
                )
            );


            path.setAttribute(
                "data-field-id",
                field.id
            );


            contourLayer.appendChild(
                path
            );


            contourElements[field.id] = {
                field:
                    field,

                element:
                    path
            };

        }
    );


    /*
     * ==================================================
     * INTERSECTION NODES
     * ==================================================
     */

    var intersectionElements = [];


    intersections.forEach(
        function (intersection) {

            var group =
                document.createElementNS(
                    NS,
                    "g"
                );


            group.setAttribute(
                "class",
                "research-intersection"
            );


            group.dataset.intersectionId =
                intersection.id;


            var point =
                toSVGPoint(
                    [
                        intersection.x,
                        intersection.y
                    ]
                );


            group.setAttribute(
                "transform",
                "translate(" +
                point.x +
                " " +
                point.y +
                ")"
            );


            /*
             * Invisible hit target.
             */

            var hit =
                document.createElementNS(
                    NS,
                    "circle"
                );


            hit.setAttribute(
                "class",
                "research-intersection-hit"
            );


            hit.setAttribute(
                "r",
                "18"
            );


            /*
             * Diamond.
             */

            var diamond =
                document.createElementNS(
                    NS,
                    "rect"
                );


            diamond.setAttribute(
                "class",
                "research-intersection-shape"
            );


            diamond.setAttribute(
                "x",
                -6
            );


            diamond.setAttribute(
                "y",
                -6
            );


            diamond.setAttribute(
                "width",
                12
            );


            diamond.setAttribute(
                "height",
                12
            );


            diamond.setAttribute(
                "transform",
                "rotate(45)"
            );


            group.appendChild(
                hit
            );


            group.appendChild(
                diamond
            );


            interactionLayer.appendChild(
                group
            );


            /*
             * Label.
             */

            var label =
                document.createElementNS(
                    NS,
                    "text"
                );


            label.setAttribute(
                "class",
                "research-intersection-label"
            );


            label.setAttribute(
                "x",
                point.x
            );


            label.setAttribute(
                "y",
                point.y - 25
            );


            label.setAttribute(
                "text-anchor",
                "middle"
            );


            label.textContent =
                "Intersecting Works";


            labelLayer.appendChild(
                label
            );


            var intersectionItem = {

                data:
                    intersection,

                group:
                    group,

                diamond:
                    diamond,

                label:
                    label,

                point:
                    point,

                hit:
                    hit,

                stringState:
                    null

            };

            intersectionElements.push(
                intersectionItem
            );

            intersectionItem.stringState =
                createStringElements(
                    intersectionItem
                );


            hit.addEventListener(
                "mouseenter",
                function () {

                    activateIntersection(
                        intersection
                    );

                }
            );


            hit.addEventListener(
                "mouseleave",
                function () {

                    deactivateIntersection();

                }
            );


            hit.addEventListener(
                "click",
                function () {

                    if (
                        typeof window.openProjectsPanel ===
                        "function"
                    ) {

                        window.openProjectsPanel(
                            intersection.fields
                        );

                    }

                }
            );

        }
    );


    /*
     * ==================================================
     * CONTOUR PATH GENERATION
     * ==================================================
     */

    function toSVGPoint(
        point
    ) {

        return {

            x:
                point[0] /
                100 *
                SVG_WIDTH,

            y:
                point[1] /
                100 *
                SVG_HEIGHT

        };

    }


    function createContourPath(
        points
    ) {

        if (
            !points ||
            points.length === 0
        ) {
            return "";
        }


        var converted =
            points.map(
                toSVGPoint
            );


        var d =
            "M " +
            converted[0].x +
            " " +
            converted[0].y;


        for (
            var i = 1;
            i < converted.length;
            i++
        ) {

            var previous =
                converted[i - 1];

            var current =
                converted[i];


            var midpointX =
                (
                    previous.x +
                    current.x
                ) / 2;


            var midpointY =
                (
                    previous.y +
                    current.y
                ) / 2;


            d +=
                " Q " +
                previous.x +
                " " +
                previous.y +
                " " +
                midpointX +
                " " +
                midpointY;

        }


        var last =
            converted[
                converted.length - 1
            ];


        d +=
            " T " +
            last.x +
            " " +
            last.y;


        return d;

    }


    /*
     * ==================================================
     * FIELD TAG HIGHLIGHTING
     * ==================================================
     */

    function highlightField(
        fieldId
    ) {

        Object.keys(
            contourElements
        ).forEach(
            function (id) {

                var contour =
                    contourElements[id];


                if (
                    id === fieldId
                ) {

                    contour.element.classList.add(
                        "is-highlighted"
                    );

                } else {

                    contour.element.classList.add(
                        "is-dimmed"
                    );

                }

            }
        );


        Object.keys(
            fieldTags
        ).forEach(
            function (id) {

                if (
                    id === fieldId
                ) {

                    fieldTags[id].classList.add(
                        "is-highlighted"
                    );

                }

            }
        );

    }


    function clearFieldHighlight() {

        Object.keys(
            contourElements
        ).forEach(
            function (id) {

                contourElements[id]
                    .element
                    .classList.remove(
                        "is-highlighted"
                    );


                contourElements[id]
                    .element
                    .classList.remove(
                        "is-dimmed"
                    );

            }
        );


        Object.keys(
            fieldTags
        ).forEach(
            function (id) {

                fieldTags[id].classList.remove(
                    "is-highlighted"
                );

            }
        );

    }


    /*
     * ==================================================
     * INTERSECTION ANIMATION
     * ==================================================
     */

    var activeIntersection =
        null;


    var animationFrame =
        null;


    var animationStart =
        0;


    function getField(
        fieldId
    ) {

        return fields.find(
            function (field) {

                return (
                    field.id ===
                    fieldId
                );

            }
        );

    }


    function countMatchingProjects(
        fieldIds
    ) {

        if (
            typeof PROJECTS === "undefined" ||
            !Array.isArray(PROJECTS)
        ) {
            return 0;
        }


        return PROJECTS.filter(
            function (project) {

                var projectFields =
                    project.fields || [];


                return fieldIds.every(
                    function (fieldId) {

                        var field =
                            getField(
                                fieldId
                            );


                        if (!field) {
                            return false;
                        }


                        return (
                            projectFields.includes(
                                fieldId
                            ) ||
                            projectFields.includes(
                                field.name
                            )
                        );

                    }
                );

            }
        ).length;

    }


function createStringElements(
    intersectionItem
) {

    var group =
        document.createElementNS(
            NS,
            "g"
        );

    group.setAttribute(
        "class",
        "research-string-group"
    );

    var strings = [];

    var intersection =
        intersectionItem.data;

    intersection.fields.forEach(
        function (
            fieldId,
            index
        ) {

            var field =
                getField(
                    fieldId
                );

            if (!field) {
                return;
            }

            var path =
                document.createElementNS(
                    NS,
                    "path"
                );

            path.setAttribute(
                "class",
                "research-intersection-string " +
                field.status
            );

            path.dataset.fieldId =
                fieldId;

            /*
             * Start at the actual contour.
             */

            path.setAttribute(
                "d",
                createContourPath(
                    field.path
                )
            );

            group.appendChild(
                path
            );

            strings.push({

                field:
                    field,

                element:
                    path,

                index:
                    index,

                progress:
                    0

            });

        }
    );

    interactionLayer.appendChild(
        group
    );

    return {

        group:
            group,

        strings:
            strings,

        center:
            intersectionItem.point

    };

}
function interpolateContourToString(
    fieldPath,
    center,
    index,
    time,
    progress
) {

    var contourPoints =
        fieldPath.map(
            toSVGPoint
        );

    var samples =
        Math.max(
            contourPoints.length,
            48
        );

    var points = [];

    for (
        var i = 0;
        i < samples;
        i++
    ) {

        var contourIndex =
            Math.floor(
                i /
                samples *
                contourPoints.length
            );

        contourIndex =
            Math.min(
                contourIndex,
                contourPoints.length - 1
            );

        var contour =
            contourPoints[
                contourIndex
            ];

        /*
         * Generate the corresponding
         * animated circular point.
         */

        var t =
            (
                i /
                samples
            ) *
            Math.PI *
            2;

        var phase =
            index *
            2.1;

        var baseRadius =
            48 +
            index *
            8;

        var wobble =
            Math.sin(
                t * 3 +
                phase +
                time * 0.0012
            ) *
            9;

        var wobble2 =
            Math.sin(
                t * 5 -
                phase +
                time * 0.0008
            ) *
            5;

        var radius =
            baseRadius +
            wobble +
            wobble2;

        var rotation =
            time *
            0.00018 *
            (
                index % 2 === 0
                    ? 1
                    : -1
            );

        var angle =
            t +
            phase +
            rotation;

        var target = {

            x:
                center.x +
                Math.cos(angle) *
                radius,

            y:
                center.y +
                Math.sin(angle) *
                radius

        };

        points.push({

            x:
                contour.x +
                (
                    target.x -
                    contour.x
                ) *
                progress,

            y:
                contour.y +
                (
                    target.y -
                    contour.y
                ) *
                progress

        });

    }

    var d =
        "M " +
        points[0].x +
        " " +
        points[0].y;

    for (
        var i = 1;
        i < points.length;
        i++
    ) {

        var previous =
            points[i - 1];

        var current =
            points[i];

        var midpointX =
            (
                previous.x +
                current.x
            ) / 2;

        var midpointY =
            (
                previous.y +
                current.y
            ) / 2;

        d +=
            " Q " +
            previous.x +
            " " +
            previous.y +
            " " +
            midpointX +
            " " +
            midpointY;

    }

    d += " Z";

    return d;

}
function animateStrings(
    stringState
) {

    if (
        !stringState
    ) {
        animationFrame =
            null;

        return;
    }

    var now =
        performance.now();
stringState.strings.forEach(
    function (string) {

        var difference =
            stringState.targetProgress -
            string.progress;

        string.progress +=
            difference *
            0.08;

        if (
            Math.abs(difference) <
            0.002
        ) {

            string.progress =
                stringState.targetProgress;

        }

        string.element.setAttribute(
            "d",
            interpolateContourToString(
                string.field.path,
                stringState.center,
                string.index,
                now,
                string.progress
            )
        );

    }
);
    stringState.strings.forEach(
        function (string) {

            var contourPath =
                createContourPath(
                    string.field.path
                );

            var circularPath =
                createStringPath(
                    stringState.center,
                    string.index,
                    now
                );

            /*
             * SVG paths cannot be numerically
             * interpolated directly with CSS.
             *
             * Instead, the transition is handled
             * by progressively switching the path
             * through sampled points.
             */

            string.element.setAttribute(
                "d",
                interpolateContourToString(
                    string.field.path,
                    stringState.center,
                    string.index,
                    now,
                    string.progress
                )
            );

        }
    );

    /*
     * Keep animating while transitioning
     * or while the intersection remains active.
     */

    if (
        activeIntersection ||
        stringState.transitioning
    ) {

        animationFrame =
            requestAnimationFrame(
                function () {

                    animateStrings(
                        stringState
                    );

                }
            );

    } else {

        animationFrame =
            null;

    }
    var transitionComplete =
    stringState.strings.every(
        function (string) {

            return (
                Math.abs(
                    string.progress -
                    stringState.targetProgress
                ) <
                0.002
            );

        }
    );

if (
    activeIntersection ||
    !transitionComplete
) {

    animationFrame =
        requestAnimationFrame(
            function () {

                animateStrings(
                    stringState
                );

            }
        );

} else {

    animationFrame =
        null;

}

}

    function activateIntersection(
        intersection
    ) {

        if (
            activeIntersection ===
            intersection
        ) {
            return;
        }


        deactivateIntersection();


        activeIntersection =
            intersection;


        /*
         * Highlight participating field tags.
         */

        Object.keys(
            fieldTags
        ).forEach(
            function (fieldId) {

                var tag =
                    fieldTags[fieldId];


                if (
                    intersection.fields.includes(
                        fieldId
                    )
                ) {

                    tag.classList.add(
                        "is-intersection-field"
                    );

                } else {

                    tag.classList.add(
                        "is-dimmed"
                    );

                }

            }
        );


        /*
         * Dim all ordinary contours.
         */

        Object.keys(
            contourElements
        ).forEach(
            function (fieldId) {

                var contour =
                    contourElements[
                        fieldId
                    ];


                if (
                    intersection.fields.includes(
                        fieldId
                    )
                ) {

                    contour.element.classList.add(
                        "is-detaching"
                    );

                } else {

                    contour.element.classList.add(
                        "is-obscured"
                    );

                }

            }
        );


        /*
         * Highlight the intersection.
         */

        var intersectionItem =
            intersectionElements.find(
                function (item) {

                    return (
                        item.data.id ===
                        intersection.id
                    );

                }
            );


        if (intersectionItem) {

            intersectionItem.group.classList.add(
                "is-active"
            );


            intersectionItem.label.classList.add(
                "is-visible"
            );

        }


        /*
         * Work count.
         */

        var count =
            countMatchingProjects(
                intersection.fields
            );


        workCount.textContent =
            "[" +
            count +
            "] " +
            (
                count === 1
                    ? "work"
                    : "works"
            );


        workCount.classList.add(
            "is-visible"
        );


        if (
    intersectionItem &&
    intersectionItem.stringState
) {

    activeStringState =
        intersectionItem.stringState;

    activeStringState.transitioning =
        true;

    activeStringState.targetProgress =
        1;

    if (
        animationFrame === null
    ) {

        animationFrame =
            requestAnimationFrame(
                function () {

                    animateStrings(
                        activeStringState
                    );

                }
            );

    }

}

    }


    var activeStringState =
        null;


    /*
     * ==================================================
     * DEACTIVATE INTERSECTION
     * ==================================================
     */

    function deactivateIntersection() {

        if (
            animationFrame !== null
        ) {

            cancelAnimationFrame(
                animationFrame
            );

            animationFrame =
                null;

        }


if (
    activeStringState
) {

    activeStringState.transitioning =
        true;

    activeStringState.targetProgress =
        0;

}


        /*
         * Restore contours.
         */

        Object.keys(
            contourElements
        ).forEach(
            function (fieldId) {

                var contour =
                    contourElements[
                        fieldId
                    ];


                contour.element.classList.remove(
                    "is-detaching"
                );


                contour.element.classList.remove(
                    "is-obscured"
                );

            }
        );


        /*
         * Restore field tags.
         */

        Object.keys(
            fieldTags
        ).forEach(
            function (fieldId) {

                fieldTags[fieldId]
                    .classList.remove(
                        "is-intersection-field"
                    );


                fieldTags[fieldId]
                    .classList.remove(
                        "is-dimmed"
                    );

            }
        );


        /*
         * Restore intersection nodes.
         */

        intersectionElements.forEach(
            function (item) {

                item.group.classList.remove(
                    "is-active"
                );


                item.label.classList.remove(
                    "is-visible"
                );

            }
        );


        workCount.classList.remove(
            "is-visible"
        );


        activeIntersection =
            null;

    }


    /*
     * ==================================================
     * WORK COUNT
     * ==================================================
     */

    var workCount =
        document.createElement(
            "div"
        );


    workCount.className =
        "research-work-count";


    container.appendChild(
        workCount
    );


})();