import { describe, it } from "node:test";
import assert from "node:assert";
import TimeSpan from "@/time/TimeSpan";


describe('ofString', () => {

    it('should parse negative timespan strings', () => {
        const timeSpan = TimeSpan.ofString("-04:16");

        assert.strictEqual(timeSpan.absolute().hours(), 4);
        assert.strictEqual(timeSpan.absolute().minutes(), 16);
        assert.strictEqual(timeSpan.isNegative(), true);
    });

});


describe('asTime', () => {

    it('should wrap positive time when wrap=true', () => {
        const time = TimeSpan.ofString('25:30').asTime(true);
        assert.strictEqual(time.hours(), 1);
        assert.strictEqual(time.minutes(), 30);
    });

    it('should wrap negative time when wrap=true (one wrap)', () => {
        const time = TimeSpan.ofString('-01:30').asTime(true);
        assert.strictEqual(time.hours(), 22);
        assert.strictEqual(time.minutes(), 30);
    });

    it('should wrap negative time when wrap=true (two wraps)', () => {
        const time = TimeSpan.ofString('-25:00').asTime(true);
        assert.strictEqual(time.hours(), 23);
        assert.strictEqual(time.minutes(), 0);
    });

});









