/*
 * ============================================================
 * RESEARCH LANDSCAPE — DATA
 * ============================================================
 *
 * Node types:
 *
 * exploring   = filled circle
 * emerging    = hollow circle
 * unpublished = hollow diamond
 * published   = filled diamond
 *
 * x / y = initial position as percentages.
 *
 * Edit this file when adding/removing/repositioning nodes.
 * ============================================================
 */

const RESEARCH_LANDSCAPE = {

    nodes: [

        /* ----------------------------------------------------
           CURRENTLY EXPLORING
           ---------------------------------------------------- */

        {
            id: "causal-inference",
            name: "Causal Inference",
            type: "exploring",
            x: 31,
            y: 38
        },

        {
            id: "machine-learning",
            name: "Machine Learning",
            type: "exploring",
            x: 50,
            y: 27
        },

        {
            id: "causal-ml",
            name: "Causal ML",
            type: "exploring",
            x: 41,
            y: 56
        },

        {
            id: "bioinformatics",
            name: "Bioinformatics",
            type: "exploring",
            x: 57,
            y: 67
        },


        /* ----------------------------------------------------
           EMERGING INTERESTS
           ---------------------------------------------------- */

        {
            id: "nlp",
            name: "NLP",
            type: "emerging",
            x: 76,
            y: 26
        },

        {
            id: "speech-processing",
            name: "Speech Processing",
            type: "emerging",
            x: 87,
            y: 48
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


        /* ----------------------------------------------------
           UNPUBLISHED WORK
           ---------------------------------------------------- */

        {
            id: "thesis",
            name: "Thesis",
            type: "unpublished",
            x: 48,
            y: 47
        }

    ],


    /* --------------------------------------------------------
       EDGES
       -------------------------------------------------------- */

    edges: [

        /* Causal Inference + ML → Causal ML */

        {
            source: "causal-inference",
            target: "causal-ml"
        },

        {
            source: "machine-learning",
            target: "causal-ml"
        },


        /* Causal ML + ML + Bioinformatics → Thesis */

        {
            source: "causal-ml",
            target: "thesis"
        },

        {
            source: "machine-learning",
            target: "thesis"
        },

        {
            source: "bioinformatics",
            target: "thesis"
        }

    ]

};