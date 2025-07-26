import { describe, it } from "node:test";
import assert from "node:assert";
import { optional } from "@/util/OptionalUtils";


describe('map', () => {

    it('should map', () => {
        const expected = "TEST";
        const actual = optional("test").map(value => value.toUpperCase()).value;

        assert.strictEqual(actual, expected);
    });

    it('should map twice', () => {
        const expected = true;
        const actual = optional("test")
            .map(value => value.toUpperCase())
            .map(value => value.startsWith("T"))
            .value;

        assert.strictEqual(actual, expected);
    });

    it('should not map', () => {
        const expected = undefined;
        const actual = optional(undefined as string | undefined).map(value => value.toUpperCase()).value;

        assert.strictEqual(actual, expected);
    });

    it('should not map twice', () => {
        const expected = undefined;
        const actual = optional(undefined as string | undefined)
            .map(value => value.toUpperCase())
            .map(value => value.startsWith("T"))
            .value;

        assert.strictEqual(actual, expected);
    });

});
