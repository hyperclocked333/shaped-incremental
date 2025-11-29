addLayer("pentaline", {
    startData() { 
        return {                  
            unlocked: true,                     
            points: new Decimal(0),
            unlockOrder: ["c","t","l","mc"],
        }
    },
    layerShown() { return player.c.points.gte(1e51) },
    row: 3,
    position: 2,
    symbol: "P",                       
    resource: "pentagons",  
    baseResource: "squares",
    baseAmount() { return player.c.points },
    requires: new Decimal(1e51),              
    type: "normal",                         
    exponent: 0.1,    
    branches: ["t", "c"],                      

    gainMult() {
        let mult = buildScaleableValue()
            // add multipliers here as needed
        return mult.get()
    },

    gainExp() {
        let exp = buildScaleableValue()
            // add exponent modifiers here as needed
            .times(true, 1) // default to 1
        return exp.get()
    },

    layerShown() { return true },         

    milestones: {
        0: {
            requirementDescription: "123 waffles",
            effectDescription: "blah",
            done() { return player[this.layer].points.gte(123) }
        }
    },
    microtabs: {
        milestoneTabs: {

        }
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                ["infobox", "staticTip"],
            ]
        },
        "Upgrades": {
            content: [
                "main-display",
                ["display-text", function() {
                    return "Upgrades"   
                }, {"font-size": "32px",}],
                "upgrades",
            ]
        },
        "Milestones": {
            content: [
                "main-display",
                ["display-text", function() {
                    return "Upgrades"   
                }, {"font-size": "32px",}],
                "milestones",
            ]
        },
    }
})
