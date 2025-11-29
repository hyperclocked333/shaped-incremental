addLayer("a", {
    startData() { return {                  
        unlocked: false,
        automation: {
            mc: {
                unlocked: true,
                upgrades: false,
                buyables: false,
            },
            l: {
                unlocked: false,
                upgrades: false,
                buyables: false,
            }
        },                
    }},
    
    symbol: "A",
    row: "side", // y
    position: 0, // x
    color: "#777777ff",
    tooltip() {return ""},
    // baseAmount() { return player.e.points },  

    type: "none",                         
    exponent: 0.5,                          

    gainMult() {                            
        let mult = new Decimal(1)
        
        return mult
    },
    gainExp() {                  
        let exp = new Decimal(1)    

        return exp
    },

    layerShown() { return player[this.layer].unlocked },

    clickables: {
        // // mc automation
        // 11: {
        //     canClick() {return hasMilestone("e", 5)},
        //     title: "MC Upgrade Automation",
        //     display() {

        //     },
        // },
    },

    // update(diff) {
    //     console.log(player.a.automation.mc.upgrades)
    // },
    microtabs: {
        main: {
            "Merged Circles": {
                content: [
                    "break",
                    ["display-text","Merged Circles", {"font-size": "32px"}],
                    ["row", [
                        ["display-text","Upgrades:", {"font-size": "14px"}],
                        "blank",
                        ["toggle", ["a", "automation.mc.upgrades"]],
                    ]],
                    ["row", [
                        ["display-text","Buyables:", {"font-size": "14px"}],
                        "blank",
                        ["toggle", ["a", "automation.mc.buyables"]],
                    ]],
                ]
            },
            "Linify": {
                content: [
                    "break",
                    ["display-text","Linify", {"font-size": "32px"}],
                    ["row", [
                        ["display-text","Upgrades:", {"font-size": "14px"}],
                        "blank",
                        ["toggle", ["a", "automation.l.upgrades"]],
                    ]],
                     ["row", [
                        ["display-text","Buyables:", {"font-size": "14px"}],
                        "blank",
                        ["toggle", ["a", "automation.l.buyables"]],
                    ]],
                ],
                unlocked() {
                    return player.a.automation.l.unlocked
                }
            }
        }
    },
    tabFormat: {
        
        "Main": {
            content: [
                ["microtabs", "main"]

                // ["display-text","Merged Circles", {"font-size": "32px"}],
                // ["row", [
                //     ["display-text","Upgrades:", {"font-size": "14px"}],
                //     "blank",
                //     ["toggle", ["a", "automation.mc.upgrades"]],
                // ]],
                // "break",
                // ["display-text","Linify", {"font-size": "32px"}],
                // ["row", [
                //     ["display-text","Upgrades:", {"font-size": "14px"}],
                //     "blank",
                //     ["toggle", ["a", "automation.mc.upgrades"]],
                // ]]
            ]
        }
    },



})

