

addLayer("t", {
    resetDescription: "Triangulate for ",
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        permUnlocked: false,         // "points" is the internal name for the main resource of the layer.
    }},
    resource: "triangles",            // The name of this layer's main prestige resource.
    row: 2,                                 // The row this layer is on (0 is the first row).
    position: 1,
    baseResource: "lines",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.l.points },  // A function to return the current amount of baseResource.
    getM4Softcap() {
        // triangles boost circles
        let t = player.t.points
        let gain = dec( ).plus(softcap(
            t,
            t.log10(),
            new Decimal(0.33))
        )
        return gain
    },
    requires: new Decimal(30000),              // The amount of the base needed to  gain 1 of the prestige currency.
    color: "#ffffffff",                                // Also the amount required to unlock the layer.
    branches: ["l"],
    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let mult = buildScaleableValue()
            .times(hasUpgrade("t", 31), upgradeEffect("t", 31))
            .times(hasUpgrade("c", 15), 3)
            .times(hasMilestone("t", 2), 5)
            .times(hasMilestone("t", 4), layers["l"].getM4Gain())
            .times(hasMilestone("mc", 8), layers["mc"].getM8Gain())
            .times(hasMilestone("c", 1), 2.5)

        return mult.get()
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return player['t'].unlocked },          // Returns a bool for if this layer's node should be visible in the tree.

    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
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

    upgrades: {
        11: {
            title: "Upgrade 1:1",
            description: "Electricity throughput efficiency increased. (the softcap is slightly weaker).",
            cost: new Decimal(1),
        },
        21: {
            title: "Upgrade 2:1",
            description: "1.4x Merged Circles.",
            cost: new Decimal(5),
        },
        22: {
            title: "Upgrade 2:2",
            description: "1.4x Lines.",
            cost: new Decimal(50),
        },
        31: {
            title: "Upgrade 3:1",
            description: "Lines very slightly boost Triangles.",
            cost: new Decimal(35),
            effect() {
                let formula = softcap(
                    (player.l.points.plus(1)).log10().sqrt().div(3).plus(1),
                    new Decimal(25),
                    new Decimal(0.33)
                );
                return formula
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
        },
        32: {
            title: "Upgrade 3:2",
            description: `Circles BARELY boost electricity.`,
            tooltip: "What? What do you mean its a waste? It does say BARELY..",
            effect() {
                let formula = softcap(
                    new Decimal(1).plus(player.points.pow(0.01).log10().div(2)),
                    new Decimal(2),
                    new Decimal(0.5)
                );

                return formula
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
            cost: new Decimal(20),
        },
        33: {
            title: "Upgrade 3:3",
            description: `Triangles boost Circles.`,
            effect() {
                let formula = softcap(
                    new Decimal(1).plus(player[this.layer].points.log2().pow(1.5)),
                    new Decimal(25),
                    new Decimal(0.5)
                );

                return formula
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
            cost: new Decimal(100),
        },
    },

    milestones: {
        1: {
            requirementDescription: `Milestone 1: 1 T`,
            effectDescription: "Milestone 0 unlocked for Merged Circles.",
            done() { return player[this.layer].points.gte(1) },
            onComplete() { return player["mc"].milestone0 = true},
        },
        2: {
            requirementDescription: `Milestone 2: 5 T`,
            effectDescription: "12x Circles. 5x Triangles.",
            done() { return player[this.layer].points.gte(5) },
        },
        3: {
            requirementDescription: `Milestone 3: 20 T`,
            effectDescription() {   
                return `1.5x Watts. Triangles boost Circles.<br>Effect: ${
                    format(layers[this.layer].getM4Softcap())
                }x` 
            },
            done() { return player[this.layer].points.gte(20) },
        },
        4: {
            requirementDescription: `Milestone 4: 35 T`,
            effectDescription: "1.2x Lines and Triangles.",
            done() { return player[this.layer].points.gte(35) },
        },
        5: {
            requirementDescription: `Milestone 5: 90 T`,
            effectDescription: "5x Merged Circles",
            done() { return player[this.layer].points.gte(90) },
        },
        6: {
            requirementDescription: `Milestone 6: 500 T`,
            effectDescription: "Unlocks three Linify upgrades. 1.1x Lines",
            done() { return player[this.layer].points.gte(500) },
        },
        7: {
            requirementDescription: `Milestone 7: 2.5k T`,
            effectDescription: "Merged Circles unlocks a new upgrade.",
            done() { return player[this.layer].points.gte(2500) },
        },
        8: {
            requirementDescription: `Milestone 8: 10k T`,
            effectDescription: "Merged Circle's Milestone 5 effect is much stronger.",
            done() { return player[this.layer].points.gte(10000) },
        },
    }
})

