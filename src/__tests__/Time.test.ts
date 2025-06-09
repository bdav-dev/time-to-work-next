import { describe, it } from "node:test";
import assert from "node:assert";
import Time from "@/time/Time";


describe('proximity', () => {

    it('should calculate when a > b', () => {
        const a = Time.ofString("16:30");
        const b = Time.ofString("16:00");

        const proximity = a.proximity(b);

        assert.strictEqual(proximity.hours(), 0);
        assert.strictEqual(proximity.minutes(), 30);
    });

    it('should calculate when a < b', () => {
        const a = Time.ofString("16:00");
        const b = Time.ofString("16:30");

        const proximity = a.proximity(b);

        assert.strictEqual(proximity.hours(), 0);
        assert.strictEqual(proximity.minutes(), 30);
    });

    it('should calculate when a == b', () => {
        const a = Time.ofString("16:00");
        const b = Time.ofString("16:00");

        const proximity = a.proximity(b);

        assert.strictEqual(proximity.hours(), 0);
        assert.strictEqual(proximity.minutes(), 0);
    });

});
