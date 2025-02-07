export const TimeHelper = {
    secondsToMonths: (seconds: number ) => {

        const days = seconds / (24 * 60 * 60);
        return Math.round(days/30.44)
    },

    formatDuration: (months: number | bigint) => {
        return months === 1 ? `1 month` : `${months} months`;
    }
}

export const formatTimeAgo = (timestamp: number) => {

    const timestampMs = timestamp * 1000;
    const now = Date.now();
    const diffInSeconds = Math.floor((now - timestampMs) / 1000);

    if (diffInSeconds < 60) {
        return "now";
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} min ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    
}