export function isUrl(string) {
    // Regular expression pattern for URL validation
    var urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;

    // Test the string against the pattern
    return urlPattern.test(string);
}