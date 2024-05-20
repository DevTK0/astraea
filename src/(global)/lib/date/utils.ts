export function isFreePeriod(date?: Date) {
    date = date ? new Date(date) : new Date();

    // SGT time is Friday 6:00 PM to Monday 2:00 AM
    // UTC time is Friday 10:00 AM to Sunday 6:00 PM
    return (
        (date.getUTCDay() === 5 && date.getUTCHours() >= 10) ||
        date.getUTCDay() === 6 ||
        (date.getUTCDay() === 0 && date.getUTCHours() < 18)
    );
}

export function getNextFreePeriodEnd(sDate?: Date) {
    // Weekday start is Monday 2:00 AM
    const date = sDate ? new Date(sDate) : new Date();
    const day = date.getUTCDay();
    const time = date.getUTCHours();
    const diff = day == 0 ? (time < 18 ? 0 : 7) : 7 - day;

    date.setUTCDate(date.getUTCDate() + diff);
    date.setUTCHours(18, 0, 0, 0);
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
        day == 5 ? (time < 10 ? 0 : 7) : day > 5 ? 7 + 5 - day : 5 - day;
    date.setUTCDate(date.getUTCDate() + diff);
    date.setUTCHours(10, 0, 0, 0);
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
