export const TimeHelper = {
    secondsToMonths: (seconds: number ) => {

        const days = seconds / (24 * 60 * 60);
        return Math.round(days/30.44)
    },

    formatDuration: (months: number | bigint) => {
        return months === 1 ? `1 month` : `${months} months`;
    }
}