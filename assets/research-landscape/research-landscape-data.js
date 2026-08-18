const RESEARCH_LANDSCAPE = {

    fields: [

        {
            id: "computer-graphics",
            name: "Computer Graphics",
            status: "exploring",

            path: [
                [5, 24],
                [18, 20],
                [32, 23],
                [47, 19],
                [63, 24],
                [78, 21],
                [94, 27]
            ]
        },

        {
            id: "animation",
            name: "Animation",
            status: "exploring",

            path: [
                [5, 39],
                [18, 35],
                [32, 40],
                [47, 36],
                [63, 41],
                [79, 37],
                [94, 42]
            ]
        },

        {
            id: "causal-inference",
            name: "Causal Inference",
            status: "exploring",

            path: [
                [5, 61],
                [19, 57],
                [34, 62],
                [49, 58],
                [65, 63],
                [80, 59],
                [94, 64]
            ]
        },

        {
            id: "machine-learning",
            name: "Machine Learning",
            status: "exploring",

            path: [
                [5, 50],
                [18, 46],
                [32, 51],
                [47, 47],
                [63, 52],
                [79, 48],
                [94, 53]
            ]
        },

        {
            id: "causal-ml",
            name: "Causal ML",
            status: "exploring",

            path: [
                [5, 72],
                [19, 68],
                [34, 73],
                [49, 69],
                [65, 74],
                [80, 70],
                [94, 75]
            ]
        },

        {
            id: "bioinformatics",
            name: "Bioinformatics",
            status: "exploring",

            path: [
                [5, 14],
                [19, 18],
                [34, 13],
                [49, 17],
                [65, 12],
                [80, 18],
                [94, 14]
            ]
        },

        {
            id: "xai",
            name: "Explainable AI",
            status: "exploring",

            path: [
                [5, 84],
                [19, 80],
                [34, 85],
                [49, 81],
                [65, 86],
                [80, 82],
                [94, 87]
            ]
        },

        {
            id: "nlp",
            name: "NLP",
            status: "emerging",

            path: [
                [5, 30],
                [19, 26],
                [34, 31],
                [49, 27],
                [65, 32],
                [80, 28],
                [94, 33]
            ]
        },

        {
            id: "speech-processing",
            name: "Speech Processing",
            status: "emerging",

            path: [
                [5, 56],
                [19, 52],
                [34, 57],
                [49, 53],
                [65, 58],
                [80, 54],
                [94, 59]
            ]
        },

        {
            id: "reinforcement-learning",
            name: "Reinforcement Learning",
            status: "emerging",

            path: [
                [5, 92],
                [19, 88],
                [34, 93],
                [49, 89],
                [65, 94],
                [80, 90],
                [94, 95]
            ]
        },

        {
            id: "continual-learning",
            name: "Continual Learning",
            status: "emerging",

            path: [
                [5, 68],
                [19, 64],
                [34, 69],
                [49, 65],
                [65, 70],
                [80, 66],
                [94, 71]
            ]
        },

        {
            id: "procedural-generation",
            name: "Procedural Generation",
            status: "emerging",

            path: [
                [5, 19],
                [19, 23],
                [34, 18],
                [49, 22],
                [65, 17],
                [80, 23],
                [94, 19]
            ]
        }

    ],


    intersections: [

        {
            id: "causal-ml-bioinformatics-ml-xai",

            name: "Intersecting Works",

            fields: [
                "machine-learning",
                "causal-ml",
                "bioinformatics",
                "xai"
            ],

            x: 48,
            y: 50
        },


        {
            id: "cg-animation",

            name: "Intersecting Works",

            fields: [
                "computer-graphics",
                "animation"
            ],

            x: 73,
            y: 35
        }

    ]

};