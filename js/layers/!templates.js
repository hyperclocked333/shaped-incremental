// addLayer("layer letter", {
//     startData() { 
//         return {                  
//             unlocked: true,                     
//             points: new Decimal(0),             
//         }
//     },

//     row: 0,
//     position: 0,
//     color: "#4BDC13",
//     symbol: "p",                       
//     resource: "prestige points",  
//     baseResource: "points",
//     baseAmount() { return player.points },
//     requires: new Decimal(10),              
//     type: "normal",                         
//     exponent: 0.5,                          

//     gainMult() {
//         let mult = buildScaleableValue()
//             // add multipliers here as needed
//         return mult.get()
//     },

//     gainExp() {
//         let exp = buildScaleableValue()
//             // add exponent modifiers here as needed
//             .times(true, 1) // default to 1
//         return exp.get()
//     },

//     layerShown() { return true },         

//     milestones: {
//         0: {
//             requirementDescription: "123 waffles",
//             effectDescription: "blah",
//             done() { return player.w.points.gte(123) }
//         }
//     }
// })
