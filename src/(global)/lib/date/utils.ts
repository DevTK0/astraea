const freePeriodStart = {
    day: 5,
    hour: 12,
    minute: 0,
};

const freePeriodEnd = {
    day: 0,
    hour: 14,
    minute: 0,
};

export function isFreePeriod(date?: Date) {
    date = date ? new Date(date) : new Date();

    if (freePeriodStart.day < freePeriodEnd.day) {
        return (
            date.getUTCDay() >= freePeriodStart.day &&
            date.getUTCHours() >= freePeriodStart.hour &&
            date.getUTCDay() <= freePeriodEnd.day &&
            date.getUTCHours() < freePeriodEnd.hour
        );
    } else {
        return (
            (date.getUTCDay() >= freePeriodStart.day &&
                date.getUTCHours() >= freePeriodStart.hour) ||
            (date.getUTCDay() <= freePeriodEnd.day &&
                date.getUTCHours() < freePeriodEnd.hour)
        );
    }
}

export function getNextFreePeriodEnd(sDate?: Date) {
    // Weekday start is Monday 2:00 AM
    const date = sDate ? new Date(sDate) : new Date();
    const day = date.getUTCDay();
    const time = date.getUTCHours();
    const diff =
        day == freePeriodEnd.day
            ? time < freePeriodEnd.hour
                ? 0
                : 7
            : 7 - day;

    date.setUTCDate(date.getUTCDate() + diff);
    date.setUTCHours(freePeriodEnd.hour, 0, 0, 0);
    const timeDiff = sDate
        ? date.getTime() - sDate?.getTime()
        : date.getTime() - Date.now();
    return { date, diff: timeDiff };
}

export function getNextFreePeriodStart(sDate?: Date) {
    // Weekend start is Friday 6:00 PM
    const date = sDate ? new Date(sDate) : new Date();
    const day = date.getUTCDay();
    const time = date.getUTCHours();
    const diff =
        day == freePeriodStart.day
            ? time < freePeriodStart.hour // during free period day, check hour
                ? 0
                : 7
            : day > freePeriodStart.day
            ? 7 + freePeriodStart.day - day // before free period
            : freePeriodStart.day - day; // during free period
    date.setUTCDate(date.getUTCDate() + diff);
    date.setUTCHours(freePeriodStart.hour, 0, 0, 0);
    const timeDiff = sDate
        ? date.getTime() - sDate?.getTime()
        : date.getTime() - Date.now();
    return { date, diff: timeDiff };
}

export function addWeekdayTime(days: number, curr?: Date) {
    curr = curr ? new Date(curr) : new Date();
    let remaining = days * 24 * 60 * 60 * 1000;

    // take it week by week
    while (remaining > 0) {
        // calc diff between curr and free period start
        const { date: weekend, diff } = getNextFreePeriodStart(curr);

        if (diff > remaining) {
            // not enough to reach next free period; calc end date
            curr = new Date(curr.getTime() + remaining);

            remaining -= remaining;
        } else {
            const { date: weekday } = getNextFreePeriodEnd(weekend);
            curr = weekday;
            remaining -= diff;
        }
    }

    return curr;
}
