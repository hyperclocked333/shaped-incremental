addLayer("achivements", {
    startData() { 
        return {                  
            unlocked: true,                     
        }
    },
    
    requires: dec(0),
    row: "side",
    position: 0,
    color: "#4BDC13",
    symbol: "Ach",
    image: "resources/trophyIcon.png",                       
    type: "none",                         


    achievements: {
        11: {
            name: "Overlord",
            done() { return player.points.gte(1e39)},
            tooltip: "<b>Obtain 1DD Circles.<b><br>Reminds me of a certain experience about mining on some.. blocky sort of workspace.",
        },
        12: {
            name: "True Overlord",
            done() { return player.points.gte(1e99)},
            tooltip: "<b>Obtain 1tsTG Circles.<b><br>I mean really, these just seem familiar for some reason.",
        },
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                ["blank", "33px"],
                "achievements",
            ]
        },
    },
})
