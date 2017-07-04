const utilities = function Utilities() {

    let allColors = {
        "b": "Monoblack",
        "bg": "Golgari",
        "bgr": "Jund",
        "bgru": "Four Color",
        "bgrw": "Four Color",
        "bguw": "Four Color",
        "bgu": "Sultai",
        "bgw": "Abzan",
        "br": "Rakdos",
        "bru": "Grixis",
        "bruw": "Four Color",
        "brw": "Mardu",
        "bu": "Dimir",
        "buw": "Esper",
        "bw": "Orzhov",
        "g": "Monogreen",
        "gr": "Gruul",
        "gru": "Temur",
        "gruw": "Four Color",
        "bgruw": "Rainbow",
        "grw": "Naya",
        "gu": "Simic",
        "guw": "Bant",
        "gw": "Selesnia",
        "r": "Monored",
        "ru": "Izzet",
        "ruw": "Jeskai",
        "rw": "Boros",
        "u": "Monoblue",
        "uw": "Azorius",
        "w": "Monowhite",
        '': "Colorless"
    };

    let toColors = function toColors(objArray) {
        let colors = objArray;
        if (Array.isArray(objArray)) {
            colors = '';
            for (let i = 0; i < objArray.length; i++)
                colors += objArray[i].value;
        }
        if (typeof(colors) !== 'string') {
            console.warn('Colors was not type of string:', colors);
            colors = '';
        }
        return colors.split('').sort().join('');}

    return {
        /**
         * Maps an object array of colors to the properly formatted color
         * descriptor for the python flask module.
         * @param objArray
         * @returns {string}
         */
        toColors: toColors,

        /**
         * Converts a string to title case
         * @param str
         */
        toTitleCase: function toTitleCase(str) {
            if (typeof (str) !== 'string') {
                return str
            }
            return str.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        },

        /**
         * Converts a colors string to their formal color name
         * @param colorAbbrev
         * @param callback
         */
        getColorName(colorAbbrev) {
            return allColors[toColors(colorAbbrev)];
        },

        /**
         * @returns {{b: string, bg: string, bgr: string, bgru: string, bgrw: string, bguw: string, bgu: string, bgw: string, br: string, bru: string, bruw: string, brw: string, bu: string, buw: string, bw: string, g: string, gr: string, gru: string, gruw: string, gruwb: string, grw: string, gu: string, guw: string, gw: string, r: string, ru: string, ruw: string, rw: string, u: string, uw: string, w: string, : string}}
         */
        getColorsJson() {
            return allColors;
        }

    }
};

module.exports.Utilities = utilities();