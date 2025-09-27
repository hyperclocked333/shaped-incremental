function loaderGetFolderList(files, folder) {
    const output = [];
    for (const file of files) {
        output.push(folder + "/" + file);
    }
    return output;
}

const layersPaths = [
	"mergecircles.js",
	"linify.js",
	"electricity.js",
	"cubify.js",
	"triangulate.js",
	"automation.js",
]

const modInfo = {
	name: "Shaped Incremental",
	author: "over2black",
	pointsName: "circles",
	modFiles: [...loaderGetFolderList(layersPaths, "layers"), "tree.js"],
	discordName: "Discord",
	discordLink: "https://discord.com/invite/hC9kMbgpmp",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 24,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "INDEV",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

let winText = `go away you win`

let baseConfig = {
	circleGain: new Decimal(.25)
}
// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints()) {
		return new Decimal(0)
	} else {
		let gain = buildScaleableValue(baseConfig.circleGain)
			.times(hasUpgrade("l", 11), 3)
			.times(hasUpgrade("l", 12), upgradeEffect("l", 12))
			.times(hasUpgrade("mc", 11), 5)
			.times(hasUpgrade("l", 21), 33)
			.times(buyableEffect("mc", 11), buyableEffect("mc", 11))
			.times(hasMilestone("mc", 6), softcap(new Decimal(1.01).times(player.mc.points), dec(300), dec(0.05)))
			.times(!hasMilestone("mc", 6) && hasMilestone("mc", 2), softcap(dec(1.01).times(player.mc.points), dec(50), dec(0.1)))
			.times(hasMilestone("e", 1), 5)
			.times(hasUpgrade("mc", 22), 4.1)
			.times(hasMilestone("mc", 4), 2.5)
			.div(hasUpgrade("l", 23), 10)
			.times(hasUpgrade("l", 33), 3)
			.times(hasUpgrade("l", 31), new Decimal(1).plus(player.points.pow(0.1).div(3)))
			.times(hasMilestone("mc", 7), 15)
			.times(hasMilestone("mc", 5), 9)
			.times(hasMilestone("t", 2), 12)
			.times(hasUpgrade("t", 33), upgradeEffect("t", 33))
			.times(hasMilestone("t", 3), layers.t.getM4Softcap())
			.times(hasMilestone("l", 3), 8.1)
			.times(hasUpgrade("c", 11), 3)

return gain.get()


	}

}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}


// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}