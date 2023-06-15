export function isUrl(string) {
    // Regular expression pattern for URL validation
    var urlPattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6}\.?)(\/[\w.-]*)*\/?$/i;

    // Test the string against the pattern
    return urlPattern.test(string);
}