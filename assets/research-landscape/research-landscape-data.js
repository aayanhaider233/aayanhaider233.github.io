const RESEARCH_LANDSCAPE = {

    nodes: [

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

        {
            id: "xai",
            name: "Explainable AI",
            type: "exploring",
            x: 40,
            y: 75
        },



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




        {
            id: "causal-ml-bioinformatics-ml-xai",
            name: "Intersecting Works",
            type: "work",
            fields: [
                "Machine Learning",
                "Causal ML",
                "Bioinformatics",
                "Explainable AI"
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
            source: "computer-graphics",
            target: "procedural-generation"
        },



        {
            source: "causal-ml",
            target: "causal-ml-bioinformatics-ml-xai"
        },

        {
            source: "machine-learning",
            target: "causal-ml-bioinformatics-ml-xai"
        },

        {
            source: "bioinformatics",
            target: "causal-ml-bioinformatics-ml-xai"
        },

        {
            source: "xai",
            target: "causal-ml-bioinformatics-ml-xai"
        },



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