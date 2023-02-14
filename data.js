var trajectoryData = [
    {
        "title" : "Actin Force Constant Matrix",
        "filePrefix" : "actin_force_constants_matrix",
        "variables" : [  // in the order they are in the file name
            "bonds",
            "angles",
            "dihedrals",
            "repulsions",
        ],
        "layerVariables" : [
            {
                "ix" : 0,
                "values" : [
                    "0.1",
                    "0.2",
                ],
            },
            {
                "ix" : 3,
                "values" : [
                    "T",
                    "F",
                ],
            },
        ],
        "rowVariableIX" : 1,
        "rowValues" : [
            "0",
            "100",
            "500",
            "1000",
            "5000",
        ],
        "colVariableIX" : 2,
        "colValues" : [
            "0",
            "100",
            "500",
            "1000",
            "5000",
        ],
        "plotNames" : [  // max = 5
            "Total filament axis twist",
            "Filament length",
            "Bond stretch",
            "Angle stretch",
            "Dihedral stretch",
        ],
    },
]