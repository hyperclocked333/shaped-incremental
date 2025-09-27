
function exponentialFormat(num, precision, mantissa = true) {
    let e = num.log10().floor()
    let m = num.div(Decimal.pow(10, e))
    if (m.toStringWithDecimalPlaces(precision) == 10) {
        m = decimalOne
        e = e.add(1)
    }
    e = (e.gte(1e9) ? format(e, 3) : (e.gte(10000) ? commaFormat(e, 0) : e.toStringWithDecimalPlaces(0)))
    if (mantissa)
        return m.toStringWithDecimalPlaces(precision) + "e" + e
    else return "e" + e
}

function commaFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.001) return (0).toFixed(precision)
    let init = num.toStringWithDecimalPlaces(precision)
    let portions = init.split(".")
    portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    if (portions.length == 1) return portions[0]
    return portions[0] + "." + portions[1]
}


function regularFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.0001) return (0).toFixed(precision)
    if (num.mag < 0.1 && precision !==0) precision = Math.max(precision, 4)
    return num.toStringWithDecimalPlaces(precision)
}

function fixValue(x, y = 0) {
    return x || new Decimal(y)
}

function sumValues(x) {
    x = Object.values(x)
    if (!x[0]) return decimalZero
    return x.reduce((a, b) => Decimal.add(a, b))
}

// function format(decimal, precision = 2, small) {
//     small = small || modInfo.allowSmall
//     decimal = new Decimal(decimal)
//     if (isNaN(decimal.sign) || isNaN(decimal.layer) || isNaN(decimal.mag)) {
//         player.hasNaN = true;
//         return "NaN"
//     }
//     if (decimal.sign < 0) return "-" + format(decimal.neg(), precision, small)
//     if (decimal.mag == Number.POSITIVE_INFINITY) return "Infinity"
//     if (decimal.gte("eeee1000")) {
//         var slog = decimal.slog()
//         if (slog.gte(1e6)) return "F" + format(slog.floor())
//         else return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(3) + "F" + commaFormat(slog.floor(), 0)
//     }
//     else if (decimal.gte("1e1000000")) return exponentialFormat(decimal, 0, false)
//     else if (decimal.gte("1e10000")) return exponentialFormat(decimal, 0)
//     else if (decimal.gte(1e9)) return exponentialFormat(decimal, precision)
//     else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
//     else if (decimal.gte(0.0001) || !small) return regularFormat(decimal, precision)
//     else if (decimal.eq(0)) return (0).toFixed(precision)

//     decimal = invertOOM(decimal)
//     let val = ""
//     if (decimal.lt("1e1000")){
//         val = exponentialFormat(decimal, precision)
//         return val.replace(/([^(?:e|F)]*)$/, '-$1')
//     }
//     else   
//         return format(decimal, precision) + "⁻¹"

// }


// dont worry guys, i made the formatting pretty!

// fun fact, this table is was yanked from mining.js which was taken from chance.py which was taken from mining.py, made back in 2023
// i hand typed every suffix from the miners haven wiki, do not recommend
const suffixes = ['k', 'M', 'B', 'T', 'qd', 'Qn', 'sx', 'Sp', 'O', 'N', 'de', 'Ud', 'DD', 'tdD', 'qdD', 'QnD', 'sxD', 'SpD', 'OcD', 'NvD', 'Vgn', 'DVg', 'TVg', 'qtV', 'QnV', 'SeV', 'SPG', 'OVG', 'NVG', 'TGN', 'UTG', 'DTG', 'tsTG', 'qtTG', 'QnTG', 'ssTG', 'SpTG', 'OcTG', 'NoTG', 'QdDR', 'uQDR', 'dQDR', 'tQDR', 'qdQDR', 'QnQDR', 'sxQDR', 'SpQDR', 'OQDDr', 'NQDDr', 'qQGNT', 'uQGNT', 'dQGNT', 'tQGNT', 'qdQGNT', 'QnQGNT', 'sxQGNT', 'SpQGNT', 'OQQGNT', 'NQQGNT', 'SXGNTL', 'USXGNTL', 'DSXGNTL', 'TSXGNTL', 'QTSXGNTL', 'QNSXGNTL', 'SXSXGNTL', 'SPSXGNTL', 'OSXGNTL', 'NVSXGNTL', 'SPTGNTL', 'USPTGNTL', 'DSPTGNTL', 'TSPTGNTL', 'QTSPTGNTL', 'QNSPTGNTL', 'SXSPTGNTL', 'SPSPTGNTL', 'OSPTGNTL', 'NVSPTGNTL', 'OTGNTL', 'UOTGNTL', 'DOTGNTL',
    'TOTGNTL', 'QTOTGNTL', 'QNOTGNTL', 'SXOTGNTL', 'SPOTGNTL', 'OTOTGNTL', 'NVOTGNTL', 'NONGNTL', 'UNONGNTL', 'DNONGNTL', 'TNONGNTL', 'QTNONGNTL', 'QNNONGNTL', 'SXNONGNTL', 'SPNONGNTL', 'OTNONGNTL', 'NONONGNTL', 'CENT', 'UNCENT', 'tCENT', 'qCENT', 'QnCENT', 'sCENT', 'SpCENT', 'OcCENT', 'NvCENT', 'dCENT', 'uCENT', 'TRNSD'
]
function format(decimal, precision = 2, small) {
    small = small || modInfo.allowSmall
    decimal = new Decimal(decimal)

    if (isNaN(decimal.sign) || isNaN(decimal.layer) || isNaN(decimal.mag)) {
        player.hasNaN = true
        return "NaN"
    }

    if (decimal.sign < 0) return "-" + format(decimal.neg(), precision, small)
    if (!decimal.isFinite()) return "Infinity"

    if (decimal.lt(1000)) {
        if (decimal.eq(0)) return (0).toFixed(precision)
        return regularFormat(decimal, precision)
    }

    if (!options.scientificNotation) {
        let tier = Math.floor(decimal.log10() / 3) - 1
        if (tier >= suffixes.length) return exponentialFormat(decimal, precision)

        let suffix = suffixes[tier]
        let scaled = decimal.div(Decimal.pow(1000, tier + 1))
        return scaled.toFixed(precision) + suffix
    }

    if (decimal.gte("eeee1000")) {
        let slog = decimal.slog()
        if (slog.gte(1e6)) return "F" + format(slog.floor(), precision, small)
        return Decimal.pow(10, slog.sub(slog.floor()))
            .toStringWithDecimalPlaces(3) + "F" + commaFormat(slog.floor(), 0)
    } else if (decimal.gte("1e1000000")) return exponentialFormat(decimal, 0, false)
    else if (decimal.gte("1e10000")) return exponentialFormat(decimal, 0)
    else if (decimal.gte(1e9)) return exponentialFormat(decimal, precision)

    return commaFormat(decimal, 0)
}



function formatWhole(decimal) {
    decimal = new Decimal(decimal)
    if (decimal.gte(1e9)) return format(decimal, 2)
    if (decimal.lte(0.99) && !decimal.eq(0)) return format(decimal, 2)
    if (decimal.gte(1000)) return format(decimal, 2)
    return format(decimal, 0)
}


function formatTime(s) {
    if (s < 60) return format(s) + "s"
    else if (s < 3600) return formatWhole(Math.floor(s / 60)) + "m " + format(s % 60) + "s"
    else if (s < 86400) return formatWhole(Math.floor(s / 3600)) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else if (s < 31536000) return formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else return formatWhole(Math.floor(s / 31536000)) + "y " + formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
}

function toPlaces(x, precision, maxAccepted) {
    x = new Decimal(x)
    let result = x.toStringWithDecimalPlaces(precision)
    if (new Decimal(result).gte(maxAccepted)) {
        result = new Decimal(maxAccepted - Math.pow(0.1, precision)).toStringWithDecimalPlaces(precision)
    }
    return result
}

// Will also display very small numbers
function formatSmall(x, precision=2) { 
    return format(x, precision, true)    
}

function invertOOM(x){
    let e = x.log10().ceil()
    let m = x.div(Decimal.pow(10, e))
    e = e.neg()
    x = new Decimal(10).pow(e).times(m)

    return x
}