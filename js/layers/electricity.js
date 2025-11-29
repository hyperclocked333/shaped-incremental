let electricity = addLayer("e", {
    name: "electricity", // This is optional, only used in a few places, If absent it just uses the layer id.
    // symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    icon: "resources/electricityIcon.png",
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        wattcap: new Decimal(10),
    }},
    color: "#f2ff00ff",
    baseResource: "watts",
    requires: new Decimal(1),
    baseAmount() { return player.e.points},
    resource: "watts", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() {

        mult = buildScaleableValue()
        .times( hasUpgrade("l", 32), 2 )
        .times( hasMilestone("t", 3), 1.5 )
        .times( hasUpgrade("t", 42), 1.15 )
        .times( hasUpgrade("t", 33), 3 )
        .times( hasUpgrade("t", 32), upgradeEffect("t", 32) )
		.times( hasUpgrade("c", 14), 3 )
        .times( hasUpgrade("c", 23), upgradeEffect("c", 23) )
		.div(hasUpgrade("c", 34), 3)
        .div(hasUpgrade("c", 42), upgradeEffect("c", 42).log2())
        .times(hasUpgrade("c", 53) && hasUpgrade("c", 33), 3)

        return mult.get()
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){
        return player.e.unlocked
    },
    directMult() {
        mult = new Decimal(1)
        return mult
    },
    update(diff) {
        let out;
        switch (true) {
            case (hasUpgrade("c", 51)):
                out = dec(575)
                break;
            case (hasUpgrade("l", 42)):
                out = dec(250)
                break;
            case (hasUpgrade("l", 32)):
                out = dec(75)
                break;
            default:
                out = dec(10)
                break;
        }
        if (hasUpgrade("c", 53) && hasUpgrade("c", 33)) { out = out.times(upgradeEffect("c", 53)[1]) }
        player[this.layer].wattcap = out.floor()
    },
    clickables: {
        11: {
            title: "Wind Up Generator",
            display: "[HOLD BUTTON]",
            style: {
                margin: "25px 0px",
                width: "250px",
                height: "100px",
                "font-size": "20px",
                "border-radius": "2px",
            },
            canClick() {return true},
            onHold() {
                function gainElectricity() {
                    let gm = layers["e"]?.gainMult || null
                    let ge = layers["e"]?.gainExp || null
                    let dr = layers["e"]?.directMult || null

                    if ((gm && ge && dr) && (typeof gm === "function" && typeof ge === "function" && typeof dr === "function")) {
                        let next;
                        const getDevSpeed = () => {
                            return Decimal.max(dec(player.devSpeed), 1)
                        }
                        let gain = 
                        new Decimal(0.01)
                            .times(gm())
                            .pow(ge())
                            .times(dr())
                            .times(getDevSpeed())     
                                              
                        switch (true) {
                            case hasUpgrade("t",11): 
                                next = softcap((player["e"].points).plus(gain), player["e"].wattcap.times(1.33), new Decimal(0.9));
                                break;

                            default:
                                next = softcap((player["e"].points).plus(gain), player["e"].wattcap, new Decimal(0.5));
                                break;
                        }
                        return next.gt(player["e"].points)
                                ? player.e.points = next
                                : player.e.points = player.e.points
                    }

                }
                gainElectricity()
            }
        }
    },
    milestones: {
        1: {
            requirementDescription: "Milestone 1: 5W",
            effectDescription: "5x Circle gain.",
            done() { return player[this.layer].points.gte(5) }
        },
        2: {
            requirementDescription: "Milestone 2: 10W",
            effectDescription() {return `Circles very slightly boost Merged Circles.<br>Effect: ${format(player.points.pow(0.1))}x`},
            done() { return player[this.layer].points.gte(10) }
        },
        3: {
            requirementDescription: "Milestone 3: 25W",
            effectDescription() {return `1.1x Lines`},
            done() { return player[this.layer].points.gte(25) }
        },
        4: {
            requirementDescription: "Milestone 4: 50W",
            effectDescription() {return `3x Merged Circles`},
            done() { return player[this.layer].points.gte(50) }
        },
        5: {
            requirementDescription: "Milestone 5: 100W",
            effectDescription() {return `Unlocks the <b>Automation</b> tab, along with basic Merged Circle automation.`},
            done() { return player[this.layer].points.gte(100) },
            onComplete() { player.a.unlocked = true },
        },
        6: {
            requirementDescription: "Milestone 6: 175W",
            effectDescription() {return `4x Merged Circles and Squares.`},
            done() { return player[this.layer].points.gte(175) }
        },
        7: {
            requirementDescription: "Milestone 7: 265W",
            effectDescription() {return `Unlocks Linify buyable automation.`},
            done() { return player[this.layer].points.gte(265) },
            onComplete() { player.a.automation.l.unlocked = true, player.a.automation.l.buyables = true }
        },
        8: {
            requirementDescription: "Milestone 8: 500W",
            effectDescription() {return `Unlocks Linify upgrade automation. 1.33x Squares and Trianlges`},
            done() { return player[this.layer].points.gte(500) },
            onComplete() { player.a.automation.l.upgrades = true }
        },
    },
    tabFormat: {
        "Generator": {
            content: [["display-text",
                    function() {
                        let str = `Watts: <h2 style="color:yellow" id="points">${format(player[this.layer].points)}</h2>`
                        if ((player[this.layer].points).gte(player[this.layer].wattcap)) {
                            str += " (OVERCHARGED)"
                        }; return str
                }],
                "clickables", 
                ["display-text", function() {
                    return `Average Wire Watt Handing Capacity: ${player[this.layer].wattcap}W`
                }],
            ]
        },
        "Milestones": {
            content: [["display-text",
                    function() {
                        let str = `Watts: <h2 style="color:yellow" id="points">${format(player[this.layer].points)}</h2>`
                        if (player[this.layer].points.gte(player[this.layer].wattcap)) {
                            str += " (OVERCHARGED)"
                        }; return str
                }],
                "blank",
                "milestones",
            ]
        },
    }
});