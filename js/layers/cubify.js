function upgInc(amount) {
    return player.c.upgBase.pow(dec(amount))
};

addLayer("c", {
    resetDescription: "Cubify for ",
    marked: "resources//redStar.png",
    startData() { return {   
        upgBase: dec(3),       
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        permUnlocked: false,   // "points" is the internal name for the main resource of the layer.
         // "points" is the internal name for the main resource of the layer.
    }},
    resource: "squares",            // The name of this layer's main prestige resource.
    row: 2,                                 // The row this layer is on (0 is the first row).
    position: 3,
    baseResource: "lines",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.l.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(4e6),              // The amount of the base needed to  gain 1 of the prestige currency.
    color: "#ffffffff",
    branches: ["l"],
    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.25,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let mult = buildScaleableValue()
            .times(hasUpgrade("c", 25), upgradeEffect("c", 25))
            .times(hasUpgrade("c", 33), 3)
            .times(hasUpgrade("c", 45), upgradeEffect("c", 45))
            .times(hasMilestone("mc", 9), getMilestoneEffect("mc", 9))
            .times(hasMilestone("c", 3), 1.5)
            .times(hasMilestone("l", 4), getMilestoneEffect("l", 4))
            .times(hasMilestone("c", 4), getMilestoneEffect("c", 4))
            .times(hasMilestone("t", 10), getMilestoneEffect("t", 10))
            .times(hasUpgrade("c", 52), hasUpgrade("c", 33) ? 15 : 5)
            // .times(hasUpgrade("c", 53) && hasUpgrade("c", 33), dec(upgradeEffect("c", 53)[0]).times(15))
            .times(hasUpgrade("c", 53), () => {
                if (hasUpgrade("c", 33)) {
                    return safedec(upgradeEffect("c", 53)[0]).times(15)
                } else {
                    return 5
                }})
            .times(hasUpgrade("c", 54), upgradeEffect("c", 54))
            .times(hasUpgrade("c", 55), upgradeEffect("c", 55))
            .times(hasBuyable("l", 11), buyableEffect("l", 11))
            .times(hasMilestone("l", 7), 3)
            .times(hasMilestone("e", 8), 1.33)
            .times(hasMilestone("l", 8), getMilestoneEffect("l", 8))
            .times(hasUpgrade("c", 31), 2)
            .times(hasMilestone("t", 12), getMilestoneEffect("t", 12))
            .times(hasMilestone("t", 12), 7)
            .times(hasMilestone("t", 13), 10)
            .times(hasMilestone("c", 9), getMilestoneEffect("c", 9))

        return mult.get()
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    layerShown() { return player["c"].unlocked },          // Returns a bool for if this layer's node should be visible in the tree.

    upgrades: {
        11: {
            title: "Upgrade 1:1",
            description: "3x Circles",
            cost() { return upgInc(1) },
        },
        12: {
            title: "Upgrade 1:2",
            description: "3x Merged Circles",
            cost() { return upgInc(2) },
        },
        13: {
            title: "Upgrade 1:3",
            description: "3x Lines",
            cost() { return upgInc(3) },
        },
        14: {
            title: "Upgrade 1:4",
            description: "3x Watts",
            cost() { return upgInc(4) },
        },
        15: {
            title: "Upgrade 1:5",
            description: "3x Triangles.",
            cost() { return upgInc(5) },
        },
        21: {
            title: "Upgrade 2:1",
            effect() {
                return safedec(softcap(player.points.pow(.4), dec(100), dec(0.5)))
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
            description: "Circles boost Merged Circles.",
            cost() { return upgInc(7) },
        },
        22: {
            title: "Upgrade 2:2",
            effect() {
                return safedec(softcap(player.mc.points.pow(0.3), dec(50), dec(0.6)))
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
            description: "Merged Circles boost Lines.",
            cost() { return upgInc(9) },
        },
        23: {
            title: "Upgrade 2:3",
            effect() {
                return safedec(softcap(player.l.points.pow(0.2), dec(25), dec(0.01)))
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
            description: "Lines boost Watts.",
            cost() { return upgInc(11) },
        },
        24: {
            title: "Upgrade 2:4",
            effect() {
                return safedec(softcap(player.e.points.pow(0.1), dec(10), dec(0.8)))
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
            description: "Watts boost Triangles.",
            cost() { return upgInc(13) },
        },
        25: {
            title: "Upgrade 2:5",
            effect() {
                return safedec(softcap(player.t.points.pow(0.05), dec(3), dec(0.9)))
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
            description: "Triangles boost Squares.",
            cost() { return upgInc(15) },
        },
        31: {
            title: "Upgrade 3:1",
            description: "/5 Circles. ^1.25 Merged Circles",
            cost() { return upgInc(67) },
            branches: [32],
        },
        32: {
            title: "Upgrade 3:2",
            description: "/12 Merged Circles. 5x Lines and Triangles.",
            cost() { return upgInc(81) },
            canAfford() {return hasUpgrade("c", 31)},
            branches: [33],
        },
        33: {
            title: "[THE CORE]<br>Upgrade 3:3",
            description: "Unlocks Pentaline. 33kx Circles.<br>3333x Merged Circles.<br>333x Lines.<br>33x Triangles.<br>3x Squares",
            cost() { return upgInc(100) },
            branches: [32,23,43,34],
            style: {
                "width": "200px",
                "height": "200px",
            },
            canAfford() {
                return (
                    hasUpgrade("c", 23) &&
                    hasUpgrade("c", 32) &&
                    hasUpgrade("c", 34) &&
                    hasUpgrade("c", 43)
                )
            },
            tooltip: "Requires all attached upgrades to buy.",
        },
        34: {
            title: "Upgrade 3:4",
            description: "/3 Watts. 5x Merged Circles. 20x Circles.",
            cost() { return upgInc(89) },
            canAfford() {return hasUpgrade("c", 35)},
            branches: [33],
        },
        35: {
            title: "Upgrade 3:5",
            description: "/5 Triangles. 9x Squares.",
            cost() { return upgInc(75) },
            branches: [34],
        },

        41: {
            title: "Upgrade 4:1",
            description: "Circles boost Triangles, but divide Merged Circles at 1/3 of the effect.",
            effect() {
                return safedec(player.points.pow(0.5).log2())
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
            cost() { return upgInc(18) },
        },
        42: {
            title: "Upgrade 4:2",
            description: "Merged Circles boost Lines, but divide Watts at log(effect).",
            effect() {
                return safedec(player.mc.points.log2().pow(2))
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
            cost() { return upgInc(21) },
        },
        43: {
            title: "Upgrade 4:3",
            description: "Triangles boost Merged Circles, but divide Circles at 1/100 of the effect.",
            effect() {
                return safedec(player.t.points.log2().pow(8))
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
            cost() { return upgInc(24) },
        },
        44: {
            title: "Upgrade 4:4",
            description: "Watts boost Circles, but divide Triangles at log(effect)/3",
            effect() {
                return safedec(player.e.points.log2().pow(20))
        
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
            cost() { return upgInc(27) },
        },
        45: {
            title: "Upgrade 4:5",
            description: "Circles, Merged Circles, Lines, and Triangles combined boost Squares.",
            effect() {
                return safedec(
                    softcap(
                        (player.points.plus(player.mc.points).plus(player.l.points).plus(player.t.points)).log2(),
                        dec(500),
                        dec(.2)
                    )
                )
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
            cost() { return upgInc(31) },
        },

        51: {
            title: "Upgrade 5:1",
            description: "All the Squares finally let you buy more proficient wire. Increases Watt Cap to 575W.",
            cost() { return upgInc(35) },
        },
        52: {
            title: "Upgrade 5:2",
            description: "^1.1 Lines. Linify no longer resets anything.",

            cost() { return upgInc(39) },
        },
        53: {
            title: "Upgrade 5:3",
            description() {
                let e = upgradeEffect("c", 53)
                return hasUpgrade("c", 33)
                ? `15x Circles and Squares.<br>Watts now boost Squares.<br>Squares, starting from ${format(2.5e50)}, now BARELY increase the Watt Cap.<br>3x Watts.<br><br>Square Boost: ${format(e[0])}x<br>Watt Cap Boost: ${format(e[1])}x`
                : "5x Circles and Squares, improves with cubic energy from [THE CORE]."
            },
            effect() {
                let s = player.c.points
                
                return [player.e.points.log2(), safedec(softcap(Decimal.max(s.div(2.5e50).log10().div(25), 1), dec(50), dec(0.33)))]
            },
            cost() { return upgInc(43) },
        },
        54: {
            title: "Upgrade 5:4",
            description: "Squares now borrow multipliers from Triangles.",
            effect() {
                return safedec(layers.t.gainMult())
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
            cost() { return upgInc(48) },
        },
        55: {
            title: "Upgrade 5:5",
            description: "Squares are boosted by your playtime in seconds.",
            effect() {
                return safedec(player.timePlayed)
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
            cost() { return upgInc(53) },
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
            requirementDescription: "Milestone 1: 1 S",
            effectDescription: "2.5x Triangles. 1.2x Lines.",
            done() { return player[this.layer].points.gte(1) }
        },
        2: {
            requirementDescription: "Milestone 2: 7 S",
            effectDescription: "Unlock two new milestones in Merged Circles. 3x Circles.",
            done() { return player[this.layer].points.gte(7) }
        },
        3: {
            requirementDescription: "Milestone 3: 300 S",
            effectDescription: "1.5x Squares. 40x Merged Circles.",
            done() { return player[this.layer].points.gte(300) }
        },
        4: {
            requirementDescription: "Milestone 4: 8.5k S",
            effect() {
                return safedec(player.t.points.log2())
                
            },
            effectDescription()  {return `Triangles boost Squares.<br>Effect: ${format(getMilestoneEffect(this.layer, this.id))}x`},
            done() { return player[this.layer].points.gte(8500) }
        },
        5: {
            requirementDescription: "Milestone 5: 5M S",
            effect() {
                return safedec(player.mc.points.log2().div(50))
                
            },
            effectDescription()  {return `Squares slighty boost Merged Circles.<br>Effect: ${format(getMilestoneEffect(this.layer, this.id))}x`},
            done() { return player[this.layer].points.gte(5e6) }
        },
        6: {
            requirementDescription: "Milestone 6: 12B S",
            effect() {
                return safedec(player.mc.points.log2().div(50))
            },
            effectDescription()  {return `3x Merged Circles, 1.5x Triangles`},
            done() { return player[this.layer].points.gte(1.2e10) }
        },
        7: {
            requirementDescription: "Milestone 7: 195Qn S",
            effectDescription()  {return `10x Merged Circles.`},
            done() { return player[this.layer].points.gte(1.95e20) }
        },
        8: {
            requirementDescription: "Milestone 8: 40N S",
            effectDescription()  {return `4.5x Triangles and Merged Circles. Merged Circles 2nd buyable is now more effective.`},
            done() { return player[this.layer].points.gte(4e30) }
        },
        9: {
            requirementDescription: "Milestone 9: 740tdD S",
            effect() {
                return safedec(player.l.best.log10().sqrt())
            },
            effectDescription()  {return `Squares are lightly boosted based off your highest Lines ever achieved.<br>Effect: ${format(getMilestoneEffect(this.layer, this.id))}x`},
            done() { return player[this.layer].points.gte(7.40e44) }
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
                "blank",
                "main-display",
                "milestones",
            ]
        },
    },
})

