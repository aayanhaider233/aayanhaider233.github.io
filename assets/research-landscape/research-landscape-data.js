const RESEARCH_LANDSCAPE = {

    nodes: [

        /* ----------------------------------------------------
           CURRENTLY EXPLORING
           ---------------------------------------------------- */
        {
            id: "computer-graphics",
            name: "Computer Graphics",
            type: "exploring",
            x: 70,
            y: 60
        },

        {
            id: "animation",
            name: "Animation",
            type: "exploring",
            x: 60,
            y: 38
        },

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
            x: 16,
            y: 26
        },

        {
            id: "speech-processing",
            name: "Speech Processing",
            type: "emerging",
            x: 10,
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
            x: 85,
            y: 51
        },


        /* ----------------------------------------------------
           UNPUBLISHED WORK
           ---------------------------------------------------- */

        {
            id: "causal-ml-bioinformatics-ml",
            name: "Intersecting Works",
            type: "work",
            fields: [
                "Machine Learning",
                "Causal ML",
                "Bioinformatics"
            ],
            x: 48,
            y: 47
        },

        {
            id: "cg-animation",
            name: "Intersecting Works",
            type: "work",
            fields: [
                "Computer Graphics",
                "Animation",
            ],
            x: 75,
            y: 39
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

        /* Computer Graphics → Proc Gen */

        {
            source: "computer-graphics",
            target: "procedural-generation"
        },

        /* Causal ML + ML + Bioinformatics */
        
        {
            source: "causal-ml",
            target: "causal-ml-bioinformatics-ml"
        },
        
        {
            source: "machine-learning",
            target: "causal-ml-bioinformatics-ml"
        },
        
        {
            source: "bioinformatics",
            target: "causal-ml-bioinformatics-ml"
        },
        
        /* CG + Animation */

        {
            source: "animation",
            target: "cg-animation"
        },

        {
            source: "computer-graphics",
            target: "cg-animation"
        }
    ]

};