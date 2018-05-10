export default function createDateStampChat(date) {
    const secDiff = (new Date() - date) / 1000,
        DAY = 60 * 60 * 24,
        HOUR = 60 * 60;
    if (secDiff < HOUR) {
        return Math.ceil(secDiff/60)+' minutes ago';
    }
    if (secDiff < DAY) {
        const options = {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
        };
        return date.toLocaleTimeString('en-EN', options);
    }
    if (secDiff >= DAY && date.getYear() === (new Date()).getYear()) {
        const options = {
            month: 'long',
            day: 'numeric',
            hour12: false,
        };
        return date.toLocaleString('en-EN', options);
    }
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour12: false,
    };
    return date.toLocaleString('en-EN', options);
}