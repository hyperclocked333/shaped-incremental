addLayer("l", {
    symbol: "L", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: dec(0),
        best: dec(0),
        milestonesUnlocked: false,
    }},
    color: "#ffffffff",
    branches: ["mc"],
    milestonePopups() { return (!player.c.unlocked) },
    resetsNothing() { return hasUpgrade("c", 52) },
    autoUpgrade() { return player.a.automation[this.layer].upgrades },
    automate() {
        if (player.a.automation[this.layer].buyables) {
            let b = this.buyables
            Object.values(b).forEach(element => {
                if (typeof element === "object") {
                    element.buyMax()
                }
                
            });
        }
    },
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
            .times(hasUpgrade("c", 22), upgradeEffect("c", 22))
            .times(hasUpgrade("c", 33), 333)
            .times(hasUpgrade("c", 32), 5)
            .times(hasUpgrade("c", 42), upgradeEffect("c", 42))
            .times(hasMilestone("t", 9), getMilestoneEffect("t", 9))
            .times(hasMilestone("t", 11), 5)
			.times(hasMilestone("t", 13), 10)

        return mult.get()
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = dec()
        if (hasUpgrade("c", 52)) {exp = exp.plus(0.1)}

        return exp
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Upgrade 1:1",
            description: "3x Circle gain.",
            cost: dec(),
        },
        12: {
            title: "Upgrade 1:2",
            description: "Circles are lightly boosted based on the highest amount of lines you have this reset.",
            effect() {
                return dec().plus(player[this.layer].best.pow(0.25))
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
                return dec().plus(player.points.pow(0.1).div(3))
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
            effect() {
                let circles = player.points
                let mc = player.mc.points
                let cap = dec(10)
                let out = softcap(
                    Decimal.max(mc.div(circles, 1).log10(), 1),
                    cap,
                    dec(1e-1)
                );
                return out
            },
            effectDescription() {return `Merged Circles significantly boost Triangles and Squares. This boost, however, is divided by Circles. This effect can't go under 1x.<br>Effect: ${format(getMilestoneEffect(this.layer, this.id))}x`},
            done() { return player[this.layer].points.gte(1.4e9) },
            unlocked() { return player[this.layer].milestonesUnlocked },
        },
        5: {
            requirementDescription: "Milestone 5: 99.99B L",
            effectDescription: "Merged Circle's buyables no longer take away MC.",
            done() { return player[this.layer].points.gte(99.99e9) },
            unlocked() { return player[this.layer].milestonesUnlocked },
        },
        6: {
            requirementDescription: "Milestone 6: 50T L",
            effectDescription: "Linify unlocks a new buyable.",
            done() { return player[this.layer].points.gte(5e13) },
            unlocked() { return player[this.layer].milestonesUnlocked },
        },
        7: {
            requirementDescription: "Milestone 7: 700qd L",
            effectDescription: "3x Squares.",
            done() { return player[this.layer].points.gte(7e17) },
            unlocked() { return player[this.layer].milestonesUnlocked },
        },
        8: {
            requirementDescription: "Milestone 8: 25sx L",
            effectDescription() {return `Lines barely boost Squares.<br>Effect: ${format(getMilestoneEffect(this.layer, this.id))}x`},
            effect() {
                let l = player.l.points
                return softcap(
                    l.log10().div(25),
                    5, 0.1
                )
            },
            done() { return player[this.layer].points.gte(2.5e22) },
            unlocked() { return player[this.layer].milestonesUnlocked },
        },
        9: {
            requirementDescription: "Milestone 9: 120O L",
            effectDescription: `Unlocks two Merged Circle upgrades. Must own MC's Upgrade 2:3 to view.`,
            done() { return player[this.layer].points.gte(1.2e29) },
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
    buyables: {
        11: {
            base: dec(500),
            growth: dec(1.5),
            scale: dec(1.05),
            cost(x) { return safedec(
                this.base.mul(this.growth.pow(x))).mul(this.scale.mul(x))
            },
            title() { return `Perfect Squares (${format(getBuyableAmount(this.layer, this.id))})`},
            display() { return `[Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id)))} L]\nEffect: ${format(this.effect())}x Squares` },
            effect(x) { return x.gte(1) ?  softcap(x.times(2), new Decimal(5), new Decimal(0.25)) : dec() },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                // if (!(hasMilestone("l", 5))) {
                    player[this.layer].points = player[this.layer].points.sub(this.cost())
                // }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax() {
                geometricBuyMax(this)
            },

            purchaseLimit() {return new Decimal(500)},
        },
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
            ]
        },
        "Upgrades": {
            content: [
                "main-display",
                ["display-text", function() {
                    return "Upgrades"   
                }, {"font-size": "32px",}],
                "upgrades",
                ["display-text", function() {
                    return hasMilestone("l", 5) ? "Buyables" : null   
                }, {"font-size": "32px",}],
                "buyables"
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