import { describe, expect, test } from "vitest";
import {
    addWeekdayTime,
    getNextWeekday,
    getNextWeekend,
    isWeekend,
} from "./utils";

describe("isWeekend", () => {
    test("Friday 6:00 PM is Weekend", () => {
        // UTC time
        const date = new Date("2024-05-17T10:00:00Z");
        const result = isWeekend(date);
        expect(result).toBe(true);
    });

    test("Friday 5:59 PM is not Weekend", () => {
        // UTC time
        const date = new Date("2024-05-17T09:59:00Z");
        const result = isWeekend(date);
        expect(result).toBe(false);
    });

    test("Monday 1:59 AM is Weekend", () => {
        // UTC time
        const date = new Date("2024-05-19T17:59:00Z");
        const result = isWeekend(date);
        expect(result).toBe(true);
    });

    test("Monday 2:00 AM is not Weekend", () => {
        // UTC time
        const date = new Date("2024-05-19T18:00:00Z");
        const result = isWeekend(date);
        expect(result).toBe(false);
    });
});

describe("getNextWeekday", () => {
    test("Monday 2:00 AM is next Weekday", () => {
        // UTC time
        const date = new Date("2024-05-14T00:00:00Z");
        const { date: result, diff } = getNextWeekday(date);
        const expected = new Date("2024-05-19T18:00:00Z");
        expect(result).toEqual(expected);
    });

    test("next Weekday on a weekend", () => {
        // UTC time
        const date = new Date("2024-05-11T00:00:00Z");
        const { date: result, diff } = getNextWeekday(date);
        const expected = new Date("2024-05-12T18:00:00Z");
        expect(result).toEqual(expected);
    });

    test("next Weekday on a Monday 2:00 AM", () => {
        // UTC time
        const date = new Date("2024-05-12T18:00:00Z");
        const { date: result, diff } = getNextWeekday(date);
        const expected = new Date("2024-05-19T18:00:00Z");
        expect(result).toEqual(expected);
    });

    test("next Weekday on a Monday 1:59 AM", () => {
        // UTC time
        const date = new Date("2024-05-12T17:59:00Z");
        const { date: result, diff } = getNextWeekday(date);
        const expected = new Date("2024-05-12T18:00:00Z");
        expect(result).toEqual(expected);
    });
});

describe("getNextWeekend", () => {
    test("Friday 6:00 PM is next Weekend", () => {
        // UTC time
        const date = new Date("2024-05-14T00:00:00Z");
        const { date: result, diff } = getNextWeekend(date);
        const expected = new Date("2024-05-17T10:00:00Z");
        expect(result).toEqual(expected);
    });

    test("next Weekend on Friday 6:00 PM", () => {
        // UTC time
        const date = new Date("2024-05-10T10:00:00Z");
        const { date: result, diff } = getNextWeekend(date);
        const expected = new Date("2024-05-17T10:00:00Z");
        expect(result).toEqual(expected);
    });

    test("next Weekend on Friday 5:59 PM", () => {
        // UTC time
        const date = new Date("2024-05-10T09:59:59Z");
        const { date: result, diff } = getNextWeekend(date);
        const expected = new Date("2024-05-10T10:00:00Z");
        expect(result).toEqual(expected);
    });
});

describe("addWeekdayTime", () => {
    test("Add 1 day", () => {
        // UTC time
        const date = new Date("2024-05-14T00:00:00Z");
        const result = addWeekdayTime(1, date);
        const expected = new Date("2024-05-15T00:00:00Z");
        expect(result).toEqual(expected);
    });

    test("Add 5 days", () => {
        // UTC time
        const date = new Date("2024-05-14T00:00:00Z");
        const result = addWeekdayTime(5, date);
        const expected = new Date("2024-05-21T08:00:00Z");
        expect(result).toEqual(expected);
    });

    test("Add 15 days", () => {
        // UTC time
        const date = new Date("2024-05-14T00:00:00Z");
        const result = addWeekdayTime(15, date);
        const expected = new Date("2024-06-05T00:00:00Z");
        expect(result).toEqual(expected);
    });
});
