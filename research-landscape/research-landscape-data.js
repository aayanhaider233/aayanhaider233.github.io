/*
 * ============================================================
 * RESEARCH LANDSCAPE — CONFIGURATION
 * ============================================================
 *
 * NODE TYPES
 *
 * exploring  = filled circle
 * emerging   = hollow circle
 * unpublished = hollow diamond
 * published   = filled diamond
 *
 * Positions are percentages of the graph:
 * x: 0–100
 * y: 0–100
 *
 * These are only starting positions.
 * Nodes can be freely dragged in the browser.
 * ============================================================
 */

const RESEARCH_LANDSCAPE = {

    nodes: [

        // ----------------------------------------------------
        // CURRENTLY EXPLORING
        // ----------------------------------------------------

        {
            id: "causal-inference",
            name: "Causal Inference",
            type: "exploring",
            x: 31,
            y: 39
        },

        {
            id: "machine-learning",
            name: "Machine Learning",
            type: "exploring",
            x: 50,
            y: 28
        },

        {
            id: "causal-ml",
            name: "Causal ML",
            type: "exploring",
            x: 41,
            y: 57
        },

        {
            id: "bioinformatics",
            name: "Bioinformatics",
            type: "exploring",
            x: 57,
            y: 67
        },


        // ----------------------------------------------------
        // EMERGING INTERESTS
        // ----------------------------------------------------

        {
            id: "nlp",
            name: "NLP",
            type: "emerging",
            x: 76,
            y: 27
        },

        {
            id: "speech-processing",
            name: "Speech Processing",
            type: "emerging",
            x: 87,
            y: 49
        },

        {
            id: "reinforcement-learning",
            name: "Reinforcement Learning",
            type: "emerging",
            x: 76,
            y: 75
        },

        {
            id: "continual-learning",
            name: "Continual Learning",
            type: "emerging",
            x: 24,
            y: 76
        },

        {
            id: "procedural-generation",
            name: "Procedural Generation",
            type: "emerging",
            x: 11,
            y: 51
        },


        // ----------------------------------------------------
        // PROJECT / PUBLICATION
        // ----------------------------------------------------

        {
            id: "thesis-project",
            name: "Thesis",
            type: "unpublished",
            x: 48,
            y: 48
        }

    ],


    // --------------------------------------------------------
    // EDGES
    // --------------------------------------------------------
    //
    // Only relationships that currently exist go here.
    //
    // Causal inference + ML → Causal ML
    // Causal ML + ML + Bioinformatics → Thesis
    //
    // --------------------------------------------------------

    edges: [

        {
            source: "causal-inference",
            target: "causal-ml"
        },

        {
            source: "machine-learning",
            target: "causal-ml"
        },

        {
            source: "causal-ml",
            target: "thesis-project"
        },

        {
            source: "machine-learning",
            target: "thesis-project"
        },

        {
            source: "bioinformatics",
            target: "thesis-project"
        }

    ]

};