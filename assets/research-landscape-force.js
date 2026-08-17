var RESEARCH_LANDSCAPE_FORCE = {

    enabled: true,

    /*
     * How strongly nearby nodes repel one another.
     */

    repulsion: 0.55,

    /*
     * How strongly connected nodes move toward
     * their preferred edge length.
     */

    attraction: 0.008,

    /*
     * Preferred distance between connected nodes.
     */

    idealEdgeLength: 150,

    /*
     * Higher = more momentum.
     * Lower = settles faster.
     */

    damping: 0.72,

    /*
     * Nodes only repel one another inside this distance.
     */

    minDistance: 55,


    /*
     * Number of physics steps per animation frame.
     */

    iterationsPerFrame: 1

};