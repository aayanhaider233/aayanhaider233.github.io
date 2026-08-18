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


    var stringLayer =
        document.createElementNS(
            NS,
            "g"
        );

    stringLayer.setAttribute(
        "class",
        "research-string-layer"
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
        stringLayer
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
                createSmoothPath(
                    field.path.map(
                        toSVGPoint
                    ),
                    false
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

            var point =
                toSVGPoint(
                    [
                        intersection.x,
                        intersection.y
                    ]
                );


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


            group.setAttribute(
                "transform",
                "translate(" +
                point.x +
                " " +
                point.y +
                ")"
            );


            /*
             * Hit area.
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
                intersection.name ||
                "Intersecting Works";


            labelLayer.appendChild(
                label
            );


            /*
             * Persistent string state.
             */

            var stringState =
                createStringElements(
                    intersection,
                    point
                );


            var item = {

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
                    stringState

            };


            intersectionElements.push(
                item
            );


            /*
             * Hover.
             */

            hit.addEventListener(
                "mouseenter",
                function () {

                    activateIntersection(
                        item
                    );

                }
            );


            hit.addEventListener(
                "mouseleave",
                function () {

                    deactivateIntersection(
                        item
                    );

                }
            );


            /*
             * Click.
             */

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


    /*
     * ==================================================
     * HELPERS
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


    function easeInOutCubic(
        value
    ) {

        value =
            clamp(
                value,
                0,
                1
            );


        return value < 0.5

            ? 4 *
                value *
                value *
                value

            : 1 -
                Math.pow(
                    -2 *
                    value +
                    2,
                    3
                ) /
                2;

    }


    function lerp(
        a,
        b,
        amount
    ) {

        return (
            a +
            (
                b - a
            ) *
            amount
        );

    }


    /*
     * ==================================================
     * SMOOTH PATH
     * ==================================================
     *
     * Uses quadratic curves through the midpoints
     * of the supplied points.
     *
     * This gives both the passive contours and the
     * active strings the same visual language.
     */

    function createSmoothPath(
        points,
        closed
    ) {

        if (
            !points ||
            points.length === 0
        ) {
            return "";
        }


        if (
            points.length === 1
        ) {

            return (
                "M " +
                points[0].x +
                " " +
                points[0].y
            );

        }


        var d = "";


        if (closed) {

            var previous =
                points[
                    points.length - 1
                ];

            var first =
                points[0];


            var startX =
                (
                    previous.x +
                    first.x
                ) / 2;


            var startY =
                (
                    previous.y +
                    first.y
                ) / 2;


            d =
                "M " +
                startX +
                " " +
                startY;


            for (
                var i = 0;
                i < points.length;
                i++
            ) {

                var current =
                    points[i];


                var next =
                    points[
                        (
                            i + 1
                        ) %
                        points.length
                    ];


                var midpointX =
                    (
                        current.x +
                        next.x
                    ) / 2;


                var midpointY =
                    (
                        current.y +
                        next.y
                    ) / 2;


                d +=
                    " Q " +
                    current.x +
                    " " +
                    current.y +
                    " " +
                    midpointX +
                    " " +
                    midpointY;

            }


            d += " Z";


            return d;

        }


        d =
            "M " +
            points[0].x +
            " " +
            points[0].y;


        for (
            var j = 1;
            j < points.length;
            j++
        ) {

            var previousPoint =
                points[j - 1];

            var currentPoint =
                points[j];


            var midpointX2 =
                (
                    previousPoint.x +
                    currentPoint.x
                ) / 2;


            var midpointY2 =
                (
                    previousPoint.y +
                    currentPoint.y
                ) / 2;


            d +=
                " Q " +
                previousPoint.x +
                " " +
                previousPoint.y +
                " " +
                midpointX2 +
                " " +
                midpointY2;

        }


        var last =
            points[
                points.length - 1
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
     * FIELD HIGHLIGHTING
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

                fieldTags[id]
                    .classList.remove(
                        "is-highlighted"
                    );

            }
        );

    }


    /*
     * ==================================================
     * FIELD / PROJECT HELPERS
     * ==================================================
     */

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


    /*
     * ==================================================
     * STRING GENERATION
     * ==================================================
     */

    function createStringElements(
        intersection,
        center
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


        /*
         * Strings sit above normal contours.
         */

        stringLayer.appendChild(
            group
        );


        var strings = [];


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
                 * Start exactly on the passive contour.
                 */

                path.setAttribute(
                    "d",
                    createSmoothPath(
                        field.path.map(
                            toSVGPoint
                        ),
                        false
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


        /*
         * Hidden until activated.
         */

        group.style.opacity = "0";


        return {

            group:
                group,

            strings:
                strings,

            center:
                center

        };

    }


    /*
     * ==================================================
     * ACTIVE CIRCLE
     * ==================================================
     *
     * IMPORTANT:
     *
     * X and Y use the SAME radius.
     *
     * There is deliberately NO vertical compression.
     */

    function createTargetPoints(
        center,
        pointCount,
        index,
        time
    ) {

        var points = [];


        /*
         * Slightly different radii make the
         * participating strands visually distinct.
         */

        var baseRadius =
            43 +
            index *
            7;


        var phase =
            index *
            (
                Math.PI *
                2 /
                pointCount
            );


        /*
         * Very slow overall rotation.
         */

        var rotation =
            time *
            0.000055 *
            (
                index % 2 === 0
                    ? 1
                    : -1
            );


        for (
            var i = 0;
            i < pointCount;
            i++
        ) {

            var angle =
                (
                    i /
                    pointCount
                ) *
                Math.PI *
                2 +
                phase +
                rotation;


            /*
             * Small organic vibration.
             *
             * These are deliberately modest so the
             * overall geometry remains circular.
             */

            var wobble =
                Math.sin(
                    angle * 3 +
                    index * 1.7 +
                    time * 0.0011
                ) *
                5;


            var wobble2 =
                Math.sin(
                    angle * 5 -
                    index * 0.9 +
                    time * 0.00073
                ) *
                2.5;


            var radius =
                baseRadius +
                wobble +
                wobble2;


            points.push({

                x:
                    center.x +
                    Math.cos(
                        angle
                    ) *
                    radius,

                y:
                    center.y +
                    Math.sin(
                        angle
                    ) *
                    radius

            });

        }


        return points;

    }


    /*
     * ==================================================
     * STRING FRAME
     * ==================================================
     */

    function renderString(
        string,
        progress,
        time
    ) {

        var sourcePoints =
            string.field.path.map(
                toSVGPoint
            );


        var targetPoints =
            createTargetPoints(
                stringStateCenter(
                    string
                ),
                sourcePoints.length,
                string.index,
                time
            );


        /*
         * Keep the same number of points on both
         * sides of the interpolation.
         */

        var amount =
            easeInOutCubic(
                progress
            );


        var points = [];


        for (
            var i = 0;
            i < sourcePoints.length;
            i++
        ) {

            points.push({

                x:
                    lerp(
                        sourcePoints[i].x,
                        targetPoints[i].x,
                        amount
                    ),

                y:
                    lerp(
                        sourcePoints[i].y,
                        targetPoints[i].y,
                        amount
                    )

            });

        }


        /*
         * Before the circular state is reached,
         * use an open contour.
         *
         * Once active, close the path.
         */

        string.element.setAttribute(
            "d",
            createSmoothPath(
                points,
                progress > 0.96
            )
        );

    }


    function stringStateCenter(
        string
    ) {

        return string._center;

    }


    /*
     * ==================================================
     * ACTIVE INTERSECTION STATE
     * ==================================================
     */

    var activeIntersection =
        null;


    var animationFrame =
        null;


    var animationTime =
        0;


    /*
     * ==================================================
     * UPDATE STRING ANIMATION
     * ==================================================
     */

    function animationLoop(
        timestamp
    ) {

        animationTime =
            timestamp;


        if (
            !activeIntersection
        ) {

            animationFrame =
                null;

            return;

        }


        var state =
            activeIntersection
                .stringState;


        state.strings.forEach(
            function (string) {

                renderString(
                    string,
                    string.progress,
                    timestamp
                );

            }
        );


        animationFrame =
            requestAnimationFrame(
                animationLoop
            );

    }


    function startAnimation() {

        if (
            animationFrame !== null
        ) {
            return;
        }


        animationFrame =
            requestAnimationFrame(
                animationLoop
            );

    }


    function stopAnimation() {

        if (
            animationFrame !== null
        ) {

            cancelAnimationFrame(
                animationFrame
            );

            animationFrame =
                null;

        }

    }


    /*
     * ==================================================
     * ACTIVATE
     * ==================================================
     */

    function activateIntersection(
        item
    ) {

        /*
         * If another intersection is active,
         * restore it first.
         */

        if (
            activeIntersection &&
            activeIntersection !== item
        ) {

            finishDeactivate(
                activeIntersection
            );

        }


        activeIntersection =
            item;


        /*
         * Field tags.
         */

        Object.keys(
            fieldTags
        ).forEach(
            function (fieldId) {

                var tag =
                    fieldTags[fieldId];


                tag.classList.remove(
                    "is-dimmed"
                );


                tag.classList.remove(
                    "is-intersection-field"
                );


                if (
                    item.data.fields.includes(
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
         * Contours.
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
                    "is-highlighted"
                );


                contour.element.classList.remove(
                    "is-dimmed"
                );


                contour.element.classList.remove(
                    "is-obscured"
                );


                if (
                    item.data.fields.includes(
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
         * Intersection visual state.
         */

        item.group.classList.add(
            "is-active"
        );


        item.label.classList.add(
            "is-visible"
        );


        /*
         * Work count.
         */

        var count =
            countMatchingProjects(
                item.data.fields
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


        /*
         * Prepare strings.
         */

        item.stringState.strings.forEach(
            function (string) {

                /*
                 * If the user re-enters while
                 * reversing, continue from the
                 * current position.
                 */

                string._center =
                    item.point;

            }
        );


        /*
         * Show strings.
         */

        item.stringState.group.style.opacity =
            "1";


        /*
         * Start animation immediately.
         *
         * The strings are still at progress 0,
         * so they initially coincide with their
         * passive contours.
         */

        startAnimation();

        animateProgress(
            item,
            1
        );

    }


    /*
     * ==================================================
     * DEACTIVATE
     * ==================================================
     */

    function deactivateIntersection(
        item
    ) {

        /*
         * Ignore stale mouseleave events.
         */

        if (
            activeIntersection !== item
        ) {
            return;
        }


        /*
         * Keep animation running while
         * strings morph back.
         */

        animateProgress(
            item,
            0,
            function () {

                finishDeactivate(
                    item
                );

            }
        );

    }


    /*
     * ==================================================
     * FINISH DEACTIVATION
     * ==================================================
     */

    function finishDeactivate(
        item
    ) {

        if (
            activeIntersection === item
        ) {

            activeIntersection =
                null;

        }


        item.stringState.strings.forEach(
            function (string) {

                string.progress =
                    0;

                string.element.setAttribute(
                    "d",
                    createSmoothPath(
                        string.field.path.map(
                            toSVGPoint
                        ),
                        false
                    )
                );

            }
        );


        item.stringState.group.style.opacity =
            "0";


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


                contour.element.classList.remove(
                    "is-dimmed"
                );


                contour.element.classList.remove(
                    "is-highlighted"
                );

            }
        );


        /*
         * Restore tags.
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
         * Restore node.

         */

        item.group.classList.remove(
            "is-active"
        );


        item.label.classList.remove(
            "is-visible"
        );


        /*
         * Work count.

         */

        workCount.classList.remove(
            "is-visible"
        );


        /*
         * Stop animation only when no
         * intersection is active.
         */

        if (
            !activeIntersection
        ) {

            stopAnimation();

        }

    }


    /*
     * ==================================================
     * PROGRESS ANIMATION
     * ==================================================
     */

    function animateProgress(
        item,
        target,
        onComplete
    ) {

        var strings =
            item.stringState.strings;


        if (
            strings.length === 0
        ) {

            if (onComplete) {
                onComplete();
            }

            return;

        }


        /*
         * Each string retains its own progress.
         */

        var startValues =
            strings.map(
                function (string) {

                    return string.progress;

                }
            );


        var maxDifference =
            0;


        startValues.forEach(
            function (value) {

                maxDifference =
                    Math.max(
                        maxDifference,
                        Math.abs(
                            target -
                            value
                        )
                    );

            }
        );


        /*
         * Very quick if already at the
         * requested state.
         */

        if (
            maxDifference < 0.001
        ) {

            strings.forEach(
                function (string) {

                    string.progress =
                        target;

                }
            );


            if (onComplete) {
                onComplete();
            }


            return;

        }


        var duration =
            target > 0
                ? 900
                : 700;


        var startTime =
            performance.now();


        /*
         * The progress animation itself does
         * not use the continuously changing
         * circular coordinates as its clock.
         *
         * That prevents the target from moving
         * unpredictably during the transition.
         */

        function step(
            timestamp
        ) {

            /*
             * Abort this particular transition
             * if another intersection has become
             * active.
             */

            if (
                activeIntersection &&
                activeIntersection !== item &&
                target > 0
            ) {

                return;

            }


            var elapsed =
                timestamp -
                startTime;


            var ratio =
                clamp(
                    elapsed /
                    duration,
                    0,
                    1
                );


            var eased =
                easeInOutCubic(
                    ratio
                );


            strings.forEach(
                function (string, index) {

                    string.progress =
                        lerp(
                            startValues[index],
                            target,
                            eased
                        );

                }
            );


            /*
             * Render immediately.
             */

            strings.forEach(
                function (string) {

                    renderString(
                        string,
                        string.progress,
                        timestamp
                    );

                }
            );


            if (
                ratio < 1
            ) {

                requestAnimationFrame(
                    step
                );

            } else {

                strings.forEach(
                    function (string) {

                        string.progress =
                            target;

                    }
                );


                if (onComplete) {
                    onComplete();
                }

            }

        }


        requestAnimationFrame(
            step
        );

    }


    /*
     * ==================================================
     * INITIAL STRING SETUP
     * ==================================================
     */

    intersectionElements.forEach(
        function (item) {

            item.stringState.strings.forEach(
                function (string) {

                    string._center =
                        item.point;


                    string.progress =
                        0;


                    string.element.setAttribute(
                        "d",
                        createSmoothPath(
                            string.field.path.map(
                                toSVGPoint
                            ),
                            false
                        )
                    );

                }
            );

        }
    );


    /*
     * ==================================================
     * RESIZE
     * ==================================================
     */

    window.addEventListener(
        "resize",
        function () {

            /*
             * SVG coordinates are viewBox based,
             * so no positional recalculation is
             * necessary.
             */

        }
    );


})();