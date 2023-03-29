import constant from '../constants';

export function formatDate<T extends Date | undefined = undefined>(date: Date, endDate?: T): T extends undefined ? string : [string, string] {
    const currentDate = new Date(new Date().setUTCHours(0, 0, 0, 0));
    const isPast = date < currentDate;
    const showYear = (date.getFullYear() !== currentDate.getFullYear());
    const options: Intl.DateTimeFormatOptions = {
        year: isPast ? 'numeric' : (showYear) ? 'numeric' : undefined,
        month: isPast ? 'numeric' : (showYear) ? 'numeric' : 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    };
    const formatter = new Intl.DateTimeFormat(constant.locale, options);

    if (endDate) {
        const sameDay = date.getMonth() === endDate.getMonth() && date.getDate() === endDate.getDate();
        const endOptions: Intl.DateTimeFormatOptions = {
            year: isPast ? 'numeric' : (showYear ? 'numeric' : undefined),
            month: isPast ? 'numeric' : (showYear || !sameDay) ? 'short' : undefined,
            day: isPast ? 'numeric' : !sameDay ? 'numeric' : undefined,
            hour: 'numeric',
            minute: 'numeric',
        };
        const endFormatter = new Intl.DateTimeFormat(constant.locale, endOptions);

        return [formatter.format(date), endFormatter.format(endDate as Date)] as T extends undefined ? string : [string, string];
    } else {
        return formatter.format(date) as T extends undefined ? string : [string, string];
    }
}
