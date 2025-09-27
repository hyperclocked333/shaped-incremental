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
    passiveGeneration() { return player[this.layer].milestone0 ? 1 : 0 },
    canReset() { return (!player[this.layer].milestone0) },
    milestonePopups() { return (!player[this.layer].milestone0) },
    autoUpgrade() { return player.a.automation[this.layer].upgrades },
    automate() {
        if (player.a.automation[this.layer].upgrades) {
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
            .times(buyableEffect("mc", 12), buyableEffect("mc", 12))
            .div(hasUpgrade("l", 23), 10)
            .times(hasUpgrade("l", 33), 3)
            .div(hasMilestone("mc", 5), 3)
            .times(hasMilestone("l", 2), 111)
            .times(hasMilestone("t", 5), 5)
            .times(hasMilestone("t", 2) && hasMilestone("mc", 5), 9)
            .times(hasUpgrade("t", 21), 1.4)
			.times(hasUpgrade("c", 12), 3)


            .div(player[this.layer].milestone0,  () => {
                if (hasUpgrade("mc", 23)) {return 50}
                return 100
            })

        return mult.get()
    },
    getM2Gain() {
        let sc, cap;
        if (hasMilestone("mc", 6)) {
            cap = 300
            sc = softcap(
                dec(1.01).times(player["mc"].points), 
                dec(cap), 
                dec(.005))
        } else if (hasMilestone("mc", 2)) {
            cap = 50
            sc = softcap(
                dec(1.01).times(player["mc"].points), 
                dec(cap), 
                dec(.005))
        }
        return [sc, cap]
    },
    getM8Gain() {
        let cap = dec(15)
        let t = player.t.points
        let c = player.c.points
        let combined = dec(1).plus(t).plus(c)
        return softcap(
            combined.log10().div(10), 
            dec(cap), 
            dec(.01))
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if (hasUpgrade("l", 13)) {exp = exp.add(0.2)}
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
            cost: new Decimal(1e45),
            unlocked() { return hasMilestone("t", 7) },
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
            requirementDescription: `[STICKY] Milestone 0: 100M MC`,
            effectDescription: "Passively gain the amount of MC you would get if you merged, at the cost of a /100 MC debuff. The prestige button is now disabled.<br>This milestone is sticky, meaning its effects do not get reset unless strictly stated.",
            done() { return player[this.layer].points.gte(1e8) },
            unlocked() { return player[this.layer].milestone0 || hasMilestone("t", 1) },
            onComplete() { return player[this.layer].milestone0 = true},
        },
        1: {
            requirementDescription: `Milestone 1: 10 MC`,
            effectDescription: "1.5x Circle and Merged Circle gain.",
            done() { return player[this.layer].points.gte(10) }
        },
        2: {
            requirementDescription: `Milestone 2: 25 MC`,
            effectDescription() {
                let [sc, cap] = layers[this.layer].getM2Gain()
                
                return `Circle gain boosted by 1.01x for each Merged Circle you have.<br>(Softcaps at ${format(cap)}x)<br>Effect: ${format(sc)}x Circles`},
            done() { return player[this.layer].points.gte(25) }
            },
        3: {
            requirementDescription: `Milestone 3: 500 MC`,
            effectDescription: "5x Merged Circle gain.",
            done() { return player[this.layer].points.gte(500) }
        },
        4: {
            requirementDescription: `Milestone 4: 10k MC`,
            effectDescription: "2.5x Circle gain.",
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
                        return "9x Circle gain. This milestone is impoved later in the game...";
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
            effectDescription: "/3 Merged Circle gain. 15x Circle gain",
            done() { return player[this.layer].points.gte(5000000) }
        },
        8: {
            requirementDescription: `Milestone 8: 1e53 MC`,
            effectDescription() { return `Merged Circles boost Triangles. Effect: ${layers[this.layer].getM8Gain()}` },
            done() { return player[this.layer].points.gte(1e53) },
            unlocked() { return hasMilestone("c", 2)},
        },

        9: {
            requirementDescription: `Milestone 9: 5e60 MC`,
            effectDescription() { return `Merged Circles boost Triangles. Effect: ${layers[this.layer].getM8Gain()}` },
            done() { return player[this.layer].points.gte(1e53) },
            unlocked() { return hasMilestone("c", 2)},
        },
    },
    

    buyables: {
        11: {
            cost(x) { return softcap(new Decimal(1).mul(x.pow(2)).plus(5), new Decimal(100), new Decimal(5)).ceil() },
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
                let cost = this.cost();
                let amount = getBuyableAmount(this.layer, this.id);
                if (player[this.layer].points.lt(cost)) return;
                while (player[this.layer].points.gte(this.cost())) {
                    if (!(hasMilestone("l", 5))) {
                        player[this.layer].points = player[this.layer].points.sub(this.cost())
                    }                    
                    amount = amount.add(1);
                    setBuyableAmount(this.layer, this.id, amount);
                }
            },

            purchaseLimit() {return new Decimal(100)},
        },
        12: {
            cost(x) { return new Decimal(10).pow(x.div(2)).ceil() },
            title() { return `Merging Factory (${format(getBuyableAmount(this.layer, this.id))})`},
            display() { return `[Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id)))} MC]\nEffect: ${format(this.effect())}x Merged Circles` },
            effect(x) { return x.gte(1) ?  softcap(x.times(1.01), new Decimal(5), new Decimal(0.1)) : new Decimal(1) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if (!(hasMilestone("l", 5))) {
                    player[this.layer].points = player[this.layer].points.sub(this.cost())
                }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit() {return new Decimal(25)},
            buyMax() {
                let cost = this.cost();
                let amount = getBuyableAmount(this.layer, this.id);
                if (player[this.layer].points.lt(cost)) return;
                while (player[this.layer].points.gte(this.cost())) {
                    if (!(hasMilestone("l", 5))) {
                        player[this.layer].points = player[this.layer].points.sub(this.cost())
                    }                    
                    amount = amount.add(1);
                    setBuyableAmount(this.layer, this.id, amount);
                }
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