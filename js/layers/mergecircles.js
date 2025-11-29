addLayer("mc", {
    name: "merge_circles", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "MC", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 99, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        total: new Decimal(0),
    }},
    milestone0: false,
    color: "#ffffffff",
    resetDescription: "Merge for ",
    passiveGeneration() { if (player[this.layer].milestone0) {
        if (hasUpgrade("mc", 23)) {return 0.02}
        
        return 0.01
    } else {return 0}},
    canReset() { return (!player[this.layer].milestone0) },
    milestonePopups() { return (!player[this.layer].milestone0) },
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
    requires: new Decimal(2), // Can be a function that takes requirement increases into account
    resource: "merged circles", // Name of prestige currency
    baseResource: "circles", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() {
        let mult = buildScaleableValue()
            .times(hasUpgrade("mc", 12), 1.33)
            .times(hasMilestone("mc", 1), 1.5)
            .times(hasMilestone("e", 2), dec().plus(player.points.pow(0.1)))
            .times(hasMilestone("mc", 3), 5)
            .times(hasUpgrade("mc", 21), dec().plus(player[this.layer].total.pow(0.15)))
            .times(hasUpgrade("mc", 22), 4.1)
            .times(hasBuyable("mc", 12), buyableEffect("mc", 12))
            .div(hasUpgrade("l", 23), 10)
            .times(hasUpgrade("l", 33), 3)
            .div(hasMilestone("mc", 5), 3)
            .times(hasMilestone("l", 2), 111)
            .times(hasMilestone("t", 5), 5)
            .times(hasMilestone("t", 2) && hasMilestone("mc", 5), 9)
            .times(hasUpgrade("t", 21), 1.4)
			.times(hasUpgrade("c", 12), 3)
            .times(hasUpgrade("c", 21), upgradeEffect("c", 21))
            .times(hasUpgrade("c", 33), 3333)
			.div(hasUpgrade("c", 32), 12)
            .times(hasUpgrade("c", 34), 5)
            .div(hasUpgrade("c", 41), upgradeEffect("c", 41).div(3))
            .times(hasUpgrade("c", 43), upgradeEffect("c", 43))
            .times(hasMilestone("c", 3), 40)
            .times(hasMilestone("c", 6), 3)
            .times(hasMilestone("c", 7), 10)
            .times(hasMilestone("t", 8), 4.5)
            .times(hasMilestone("t", 12), getMilestoneEffect("t", 12))
			.times(hasMilestone("t", 13), 10)

        return mult.get()
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if (hasUpgrade("l", 13)) {exp = exp.add(0.2)}
        if (hasUpgrade("c", 31)) {exp = exp.add(0.25)}
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Upgrade 1:1",
            description: "5x Circle gain.",
            cost: new Decimal(1),
        },
        12: {
            title: "Upgrade 1:2",
            description: "1.33x Merged Circle gain.",
            cost: new Decimal(20),
        },
        21: {
            title: "Upgrade 2:1",
            description: `Slightly boosts Merged Circle gain based on total Merged Circles.`,
            effect() {
                return softcap(player[this.layer].total.pow(0.15), dec(1e5), dec(0.1))
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
            cost: new Decimal(80),
        },
        22: {
            title: "Upgrade 2:2",
            description: "4.1x Circle and Merged Circle gain.",
            cost: new Decimal(385),
        },
        23: {
            title: "Upgrade 2:3",
            description: "The passive MC punishment is reduced to /50 Merged Circles.",
            cost: new Decimal(1e35),
            unlocked() { return hasUpgrade("l", 43) },
        },
        31: {
            title: "Upgrade 3:1",
            description: "2x Squares. 22x Triangles.",
            cost: new Decimal(2.5e137),
            unlocked() { return hasUpgrade("l", 43) && hasUpgrade("mc", 23) },
        },
        32: {
            title: "Upgrade 3:2",
            description: "Unlocks three Triangulate milestones.",
            cost: new Decimal(8.1e139),
            unlocked() { return hasUpgrade("l", 43) && hasUpgrade("mc", 23) },
        },
        // 12: {
        //     title: "Circular Intersection",
        //     description: "Circles are lightly boosted based on the current amount of lines you have.",
        //     effect() {
        //         return player[this.layer].points.add(0.5).pow(0.5)
        //     },
        //     effectDisplay() {
        //         return format(upgradeEffect(this.layer, this.id))+"x"
        //     },
        //     cost: new Decimal(3),
        // }
    },
    infoboxes: {
        buyableTip: {
            title: "Tip",
            body() { return "Focus on your upgrades, as they usually provide you with more benefits, then go for your buyables as a second priority." },
        },
    },
    milestones: {
        0: {
            requirementDescription: `[ETERNAL] Milestone 0: 100M MC`,
            effectDescription: "Passively gain the amount of MC you would get if you merged, at the cost of a /100 MC debuff. The prestige button is now disabled.<br>This milestone is eternal, meaning its effects do not get reset unless strictly stated.",
            done() { return player[this.layer].points.gte(1e8) || player[this.layer].milestone0 },
            unlocked() { return player[this.layer].milestone0 || hasMilestone("t", 1) },
            onComplete() { return player[this.layer].milestone0 = true},
        },
        1: {
            requirementDescription: `Milestone 1: 10 MC`,
            effectDescription: "1.5x Circle and Merged Circles.",
            
            done() { return player[this.layer].points.gte(10) }
        },
        2: {
            requirementDescription: `Milestone 2: 25 MC`,
            effect() {
                let sc, cap;
                if (hasMilestone("mc", 6)) {
                    cap = dec(300)
                    sc = softcap(
                        dec(1.01).times(player["mc"].points), 
                        dec(cap), 
                        dec(.005))
                } else if (hasMilestone("mc", 2)) {
                    cap = dec(50)
                    sc = softcap(
                        dec(1.01).times(player["mc"].points), 
                        cap, 
                        dec(.005))
                }
                return [sc, cap]
            },
            effectDescription() {
                let [sc, cap] = getMilestoneEffect("mc", 2  )
                
                return `Circles boosted by 1.01x for each Merged Circle you have.<br>(Softcaps at ${format(cap)}x)<br>Effect: ${format(sc)}x Circles`},
            done() { return player[this.layer].points.gte(25) }
            },
        3: {
            requirementDescription: `Milestone 3: 500 MC`,
            effectDescription: "5x Merged Circles.",
            done() { return player[this.layer].points.gte(500) }
        },
        4: {
            requirementDescription: `Milestone 4: 10k MC`,
            effectDescription: "2.5x Circles.",
            done() { return player[this.layer].points.gte(10000) }
        },
        5: {
            requirementDescription: `Milestone 5: 75k MC`,
            effectDescription() {
                let ms = hasMilestone("t", 8);
                switch (true) {
                    case ms:
                        return "9x Circle, MC, and Lines.";
                
                    default:
                        return "9x Circles. This milestone is impoved later in the game...";
                }
            },
            done() { return player[this.layer].points.gte(75000) }
        },
        6: {
            requirementDescription: `Milestone 6: 235k MC`,
            effectDescription: "Milestone 2's softcap is now 300x.",
            done() { return player[this.layer].points.gte(235000) }
        },
        7: {
            requirementDescription: `Milestone 7: 5M MC`,
            effectDescription: "/3 Merged Circles. 15x Circles",
            done() { return player[this.layer].points.gte(5000000) }
        },
        8: {
            requirementDescription: `Milestone 8: ${format(1e25)} MC`,
            effect() {
                let cap = dec(15)
                let t = player.t.points
                let c = player.c.points
                let combined = t.plus(c)
                return softcap(
                    combined.log10().div(10), 
                    dec(cap), 
                    dec(.01)).plus(1) 
            },
            effectDescription() { return `Merged Circles boost Triangles.<br>Effect: ${format(getMilestoneEffect(this.layer, this.id))}x` },
            done() { return player[this.layer].points.gte(1e25) },
            unlocked() { return hasMilestone("c", 2)},
        },

        9: {
            requirementDescription: `Milestone 9: ${format(5e30)} MC`,
            effect() {
                return safedec(softcap(
                    player.mc.points.log10().log2(), 
                    dec(50), 
                    dec(.01)
                ))
            },
            effectDescription() { return `Merged Circles boost Squares.<br>Effect: ${format(getMilestoneEffect("mc", 9))}x` },
            done() { return player[this.layer].points.gte(5e30) },
            unlocked() { return hasMilestone("c", 2)},
        },
    },
    

    buyables: {
        11: {
            base: dec(100),
            growth: dec(1.1),
            cost(x) { return safedec(
                this.base.mul(this.growth.pow(x)))
            },
            title() { return `Merging Effectiveness (${format(getBuyableAmount(this.layer, this.id))})`},
            display() { return `[Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id)))} MC]\nEffect: ${format(this.effect())}x Circles` },
            effect(x) { return x.gte(1) ?  softcap(x.times(1.05), new Decimal(5), new Decimal(0.5)) : new Decimal(1) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (!(hasMilestone("l", 5))) {
                    player[this.layer].points = player[this.layer].points.sub(this.cost())
                }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax() {
                geometricBuyMax(this, hasMilestone("l", 5))  
            },

            purchaseLimit() {return new Decimal(100)},
        },
        12: {
            base: dec(10),
            growth: dec(2),
            scale: dec(1.2),
            cost(x) { return safedec(
                this.base.mul(this.growth.pow(x))).mul(this.scale.mul(x))
            },
            title() { return `Merging Factory (${format(getBuyableAmount(this.layer, this.id))})`},
            display() { return `[Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id)))} MC]\nEffect: ${format(this.effect())}x Merged Circles` },
            effect(x) { 
                let ms1 = hasMilestone("c", 8)
                let out 
                // if (ms1) {}

                switch (true) {
                    case ms1:
                        out = softcap(x.times(1.2), dec(5), dec(0.5))
                        break;

                    default:
                        out = softcap(x.times(1.01), dec(5), dec(0.1))
                };

                return out
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (!hasMilestone("l", 5)) {
                    player[this.layer].points = player[this.layer].points.sub(this.cost())
                }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit() {return new Decimal(25)},
            buyMax() {
                geometricBuyMax(this, hasMilestone("l", 5))
            },
        },
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
            ],

            
        },
        "Upgrades": {
            content: [
                "main-display",
                ["display-text", function() {
                    return "Upgrades"   
                }, {"font-size": "32px",}],
                "upgrades",
                "blank",
                ["display-text", function() {
                    return "Buyables"   
                }, {"font-size": "32px",}],
                "buyables",
                ["infobox", "buyableTip"],
            ],
        },
        "Milestones": {
            content: [
                "blank",
                "milestones",
            ]
        },
    },
})