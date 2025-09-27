addLayer("c", {
    resetDescription: "Cubify for ",
    marked: "resources//redStar.png",
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        permUnlocked: false,         // "points" is the internal name for the main resource of the layer.
         // "points" is the internal name for the main resource of the layer.
    }},
    resource: "squares",            // The name of this layer's main prestige resource.
    row: 2,                                 // The row this layer is on (0 is the first row).
    position: 2,
    baseResource: "lines",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.l.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(4e6),              // The amount of the base needed to  gain 1 of the prestige currency.
    color: "#ffffffff",
    branches: ["l"],
    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.25,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return player["c"].unlocked },          // Returns a bool for if this layer's node should be visible in the tree.

    upgrades: {
        11: {
            title: "Upgrade 1:1",
            description: "3x Circles",
            cost: new Decimal(3),
        },
        12: {
            title: "Upgrade 1:2",
            description: "3x Merged Circles",
            cost: new Decimal(3**2),
        },
        13: {
            title: "Upgrade 1:3",
            description: "3x Lines",
            cost: new Decimal(3**3),
        },
        14: {
            title: "Upgrade 1:4",
            description: "3x Watts",
            cost: new Decimal(3**4),
        },
        15: {
            title: "Upgrade 1:5",
            description: "3x Triangles",
            cost: new Decimal(3**5),
        },
    },
    infoboxes: {
        staticTip: {
            title: "What does that red star mean?",
            body() { return "A red star on a reset layer indicates that it is a <b>static</b> layer.<br>The cost to reset is dependent on your total after reset.<br>The formula before bonuses is: base<sup>x^exponent</sup>.<br>These layers are harder to progress through than regular layers." },
        },
    },
    milestones: {
        1: {
            requirementDescription: "Milestone 1: 1 C",
            effectDescription: "2.5x Triangles. 1.2x Lines.",
            done() { return player[this.layer].points.gte(1) }
        },
        2: {
            requirementDescription: "Milestone 2: 7 C",
            effectDescription: "Unlock two new milestones in Merged Circles. 3x Circles.",
            done() { return player[this.layer].points.gte(7) }
        },
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
        "Upgades": {
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
                "blank",
                "milestones",
            ]
        },
    },
})