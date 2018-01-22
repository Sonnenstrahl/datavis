/**
 * @Author: David Haas
 * @Date: 22.01.2018
 */
/**
 * This function takes the text value gotten via JQuery and the Object we want to find the key in
 * In order to convert it into a more readable form
 * If no key is found we keep the default text
 *
 * @param {string} text
 * @param {Object} obj
 * @returns {String}
 */
function replaceSelectText(text, obj) {
    var substring1 = text.substring(0, text.indexOf(':'));
    var substring2 = text.substring(text.indexOf(':'));
    if (obj[substring1]) {
        substring1 = obj[substring1];
        return (substring1 + substring2);
    }
    else
        return text;
}

/**
 * Concatenate 2 Numbers
 * This is used to create the keys for the Heatmap dynamically
 * Number1 is the day and Number2 is the activity
 * So day:1 & activity22 becomes 122 instead of 23
 * @param {number} a - the first number to concatenate
 * @param {number} b - the 2nd number to concatenate
 * @returns {number}
 */
function concatenateNumber(a, b) {
    return parseInt(String(a) + String(b))
}

/**
 * Calculate the #Digits a number has
 * This is used to split the keys for the Heatmap again into day & activity
 * The first digit is the day and the remaining digits are the activity
 * So 134 would be day:1 & activity:34
 * @param {number} Number
 * @returns {number}
 */
function getNumberOfDigits(Number) {
    return Math.floor(Math.log10(Number)) + 1;
}