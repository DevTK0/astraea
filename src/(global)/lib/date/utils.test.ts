import { describe, expect, test } from "vitest";
import {
    addWeekdayTime,
    getNextFreePeriodEnd,
    getNextFreePeriodStart,
    isFreePeriod,
} from "./utils";

describe("isFreePeriod", () => {
    test("Friday 8:00 PM is within free period", () => {
        const date = new Date("2024-05-17T12:00:00Z");
        const result = isFreePeriod(date);
        expect(result).toBe(true);
    });

    test("Friday 7:59 PM is outside free period", () => {
        const date = new Date("2024-05-17T11:59:00Z");
        const result = isFreePeriod(date);
        expect(result).toBe(false);
    });

    test("Sunday 09:59 AM is within free period", () => {
        const date = new Date("2024-05-19T13:59:00Z");
        const result = isFreePeriod(date);
        expect(result).toBe(true);
    });

    test("Sunday 10:00 PM is not within free period", () => {
        const date = new Date("2024-05-19T14:00:00Z");
        const result = isFreePeriod(date);
        expect(result).toBe(false);
    });
});

describe("getNextFreePeriodEnd", () => {
    test("Sunday 10:00 PM is the next free period end.", () => {
        const date = new Date("2024-05-14T00:00:00Z");
        const { date: result, diff } = getNextFreePeriodEnd(date);
        const expected = new Date("2024-05-19T14:00:00Z");
        expect(result).toEqual(expected);
    });

    test("getNextFreePeriodEnd on a weekend", () => {
        const date = new Date("2024-05-11T00:00:00Z");
        const { date: result, diff } = getNextFreePeriodEnd(date);
        const expected = new Date("2024-05-12T14:00:00Z");
        expect(result).toEqual(expected);
    });

    test("getNextFreePeriodEnd on a Sunday 10:00 PM", () => {
        const date = new Date("2024-05-12T14:00:00Z");
        const { date: result, diff } = getNextFreePeriodEnd(date);
        const expected = new Date("2024-05-19T14:00:00Z");
        expect(result).toEqual(expected);
    });

    test("getNextFreePeriodEnd on a Sunday 09:59 PM", () => {
        const date = new Date("2024-05-12T13:59:00Z");
        const { date: result, diff } = getNextFreePeriodEnd(date);
        const expected = new Date("2024-05-12T14:00:00Z");
        expect(result).toEqual(expected);
    });
});

describe("getNextFreePeriodStart", () => {
    test("Friday 8:00 PM is the next free period start.", () => {
        const date = new Date("2024-05-14T00:00:00Z");
        const { date: result, diff } = getNextFreePeriodStart(date);
        const expected = new Date("2024-05-17T12:00:00Z");
        expect(result).toEqual(expected);
    });

    test("getNextFreePeriodStart on Friday 6:00 PM", () => {
        const date = new Date("2024-05-10T12:00:00Z");
        const { date: result, diff } = getNextFreePeriodStart(date);
        const expected = new Date("2024-05-17T12:00:00Z");
        expect(result).toEqual(expected);
    });

    test("getNextFreePeriodStart on Friday 5:59 PM", () => {
        const date = new Date("2024-05-10T11:59:59Z");
        const { date: result, diff } = getNextFreePeriodStart(date);
        const expected = new Date("2024-05-10T12:00:00Z");
        expect(result).toEqual(expected);
    });
});

describe("addWeekdayTime", () => {
    test("Add 1 day", () => {
        const date = new Date("2024-05-14T00:00:00Z");
        const result = addWeekdayTime(1, date);
        const expected = new Date("2024-05-15T00:00:00Z");
        expect(result).toEqual(expected);
    });

    test("Add 5 days", () => {
        const date = new Date("2024-05-14T00:00:00Z");
        const result = addWeekdayTime(5, date);
        const expected = new Date("2024-05-21T02:00:00Z");
        expect(result).toEqual(expected);
    });

    test("Add 15 days", () => {
        const date = new Date("2024-05-14T00:00:00Z");
        const result = addWeekdayTime(15, date);
        const expected = new Date("2024-06-04T06:00:00Z");
        expect(result).toEqual(expected);
    });
});
