addLayer("l", {
    symbol: "L", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        best: new Decimal(0),
        milestonesUnlocked: false,
    }},
    color: "#ffffffff",
    branches: ["mc"],
    requires: new Decimal(1e6), // Can be a function that takes requirement increases into account
    resetDescription: "Linify for ",
    resource: "lines", // Name of prestige currency
    baseResource: "circles", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = buildScaleableValue()
            .times(hasUpgrade("l", 23), 20)
            .times(hasMilestone("e", 4), 1.1)
            .times(
                hasMilestone("l", 1),
                Decimal.max(player.l.points.pow(0.05).log10(), 0).plus(1)
            )
            .times(hasUpgrade("t", 22), 1.4)
            .times(hasMilestone("t", 4), 1.2)
            .times(hasMilestone("t", 6), 1.1)
            .times(hasUpgrade("c", 13), 3)
            .times(hasUpgrade("l", 22), 1.5)
            .times(hasMilestone("c", 1), 1.2)
            .times(hasMilestone("t", 4), 1.2)

        return mult.get()
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Upgrade 1:1",
            description: "3x Circle gain.",
            cost: new Decimal(1),
        },
        12: {
            title: "Upgrade 1:2",
            description: "Circles are lightly boosted based on the highest amount of lines you have this reset.",
            effect() {
                return new Decimal(1).plus(player[this.layer].best.pow(0.25))
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
            cost: new Decimal(3),
        },
        13: {
            title: "Upgrade 1:3",
            description: "^1.2 Merged Circles.",
            cost: new Decimal(10),
        },
        21: {
            title: "Upgrade 2:1",
            description: "33x Circles.",
            cost: new Decimal(33),
        },
        22: {
            title: "Upgrade 2:2",
            description: "Unlocks Electricity. 1.5x Lines",
            cost: new Decimal(50),
            tooltip: "You probably want to get into this as soon as possible.",
            onPurchase() {
                player["e"].unlocked = true
            },
        },
        23: {
            title: "Upgrade 2:3",
            description: "/10 Merged Circle and Circles. 20x Lines",
            cost: new Decimal(175),
        },
        31: {
            title: "Upgrade 3:1",
            description: "Circles slightly boost themselves.",
            cost: new Decimal(750),
            effect() {
                return new Decimal(1).plus(player.points.pow(0.1).div(3))
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
        },
        32: {
            title: "Upgrade 3:2",
            description: "Higher tier wire increases Watt Cap to 75W. 2x Watts.",
            cost: new Decimal(1600),
        },
        33: {
            title: "Upgrade 3:3",
            description: "Unlocks Triangulate and Cubify. 3x Circle, Merged Circle, and Watts.",
            cost: new Decimal(9999),
            onPurchase() {
                player['c'].unlocked = true
                player['t'].unlocked = true
            },
        },

        // triangulate milestone 7+

        41: {
            title: "Upgrade 4:1",
            description: "Unlocks Linify Milestones.",
            cost: new Decimal(5e6),
            onPurchase() {
                player[this.layer].milestonesUnlocked = true
            },
            unlocked() { return hasMilestone("t", 6)},
        },
        42: {
            title: "Upgrade 4:2",
            description: "Even HIGHER tier wire increases Watt Cap to 250W. 1.15x Watts",
            cost: new Decimal(1.5e8),
            unlocked() { return hasMilestone("t", 6)},
        },
        43: {
            title: "Upgrade 4:3",
            description: "Unlock a new upgrade in the Merged Circle layer.",
            cost: new Decimal(5e9),
            unlocked() { return hasMilestone("t", 6)},
        },

        
    },
    // update() {
    //     console.log(.toString() === "NaN")
    // },
    getM4Gain() {
        // see m4 desc
        let circles = player.points
        let mc = player.mc.points
        let cap = dec(10)
        let out = softcap(
            Decimal.max(mc.div(circles, 1).log10(), 1),
            cap,
            dec(1e-1)
        )
        
        return out
    },
    milestones: {
        1: {
            requirementDescription: "Milestone 1: 10M L",
            effectDescription() {return `Lines VERY slightly boost themselves.<br>Effect: ${ 
                (function() {
                    let formula = Decimal.max(player.l.points.pow(0.05).log10(), 0).plus(1)
                    let out
                    formula.toString() === "NaN" 
                        ? out = "None"
                        : out = format(formula)+"x"

                    return out
                    
                })()
            }`},
            done() { return player[this.layer].points.gte(1e7) },
            unlocked() { return player[this.layer].milestonesUnlocked },
        },
        2: {
            requirementDescription: "Milestone 2: 70M L",
            effectDescription: "111x Merged Circles",
            done() { return player[this.layer].points.gte(7e7) },
            unlocked() { return player[this.layer].milestonesUnlocked },
        },
        3: {
            requirementDescription: "Milestone 3: 200M L",
            effectDescription: "8.1x Circles",
            done() { return player[this.layer].points.gte(2e8) },
            unlocked() { return player[this.layer].milestonesUnlocked },
        },
        4: {
            requirementDescription: "Milestone 4: 1.4B L",
            effectDescription() {
            let mult = layers["l"].getM4Gain()
            return `Merged Circles significantly boost Triangles. This boost, however, is divided by Circles. This effect can't go under 1x.<br>Effect: ${format(mult)}x`},
            done() { return player[this.layer].points.gte(1.4e9) },
            unlocked() { return player[this.layer].milestonesUnlocked },
        },
        5: {
            requirementDescription: "Milestone 5: 9.99B L",
            effectDescription: "Merged Circle's buyables no longer take away MC.",
            done() { return player[this.layer].points.gte(9.99e9) },
            unlocked() { return player[this.layer].milestonesUnlocked },
        },
        // 3: {
        //     requirementDescription: "Milestone 3: 3M L",
        //     effectDescription: "2x Circles",
        //     done() { return player[this.layer].points.gte(3e6) },
        //     unlocked() { return player[this.layer].milestonesUnlocked },
        // },
        // 4: {
        //     requirementDescription: "Milestone 4: 20M L",
        //     effectDescription: "2x Circles",
        //     done() { return player[this.layer].points.gte(100000) },
        //     unlocked() { return player[this.layer].milestonesUnlocked },
        // },
        // 5: {
        //     requirementDescription: "Milestone 5: 650M L",
        //     effectDescription: "2x Circles",
        //     done() { return player[this.layer].points.gte(100000) },
        //     unlocked() { return player[this.layer].milestonesUnlocked },
        // },
    },
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
                "main-display",
                "milestones",
            ],
            unlocked() { return player.l.milestonesUnlocked },
        }
    }
})