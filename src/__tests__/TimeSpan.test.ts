import { test } from "node:test";
import assert from "node:assert";
import TimeSpan from "@/time/TimeSpan";



test('Parsing negative negative timespan strings', () => {
    const timeSpan = TimeSpan.ofString("-04:16");

    assert.strictEqual(timeSpan.absolute().hours(), 4);
    assert.strictEqual(timeSpan.absolute().minutes(), 16);
    assert.strictEqual(timeSpan.isNegative(), true);
});

