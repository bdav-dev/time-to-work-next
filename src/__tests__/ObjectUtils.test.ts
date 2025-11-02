import { toReplacedDeepValue } from "@/util/ObjectUtils";
import { describe, it } from "node:test";
import assert from "node:assert";


describe('toReplacedDeepValue', () => {

    const object = {
        dailyWorkingTime: "dailyWorkingTime",
        another: "another",
        _violation: {
            notify: "notify",
            threshold: "threshold"
        }
    }

    it('should replace without nest', () => {
        const actual = toReplacedDeepValue(object, [], "another", "replacedAnother");
        const expected = {
            dailyWorkingTime: "dailyWorkingTime",
            another: "replacedAnother",
            _violation: {
                notify: "notify",
                threshold: "threshold"
            }
        }

        assert.strictEqual(actual.dailyWorkingTime, expected.dailyWorkingTime);
        assert.strictEqual(actual.another, expected.another);
        assert.strictEqual(actual._violation.notify, expected._violation.notify);
        assert.strictEqual(actual._violation.threshold, expected._violation.threshold);
    });

    it('should value in nested', () => {
        const actual = toReplacedDeepValue(object, ["_violation"], "notify", "replacedNotify");
        const expected = {
            dailyWorkingTime: "dailyWorkingTime",
            another: "another",
            _violation: {
                notify: "replacedNotify",
                threshold: "threshold"
            }
        }

        assert.strictEqual(actual.dailyWorkingTime, expected.dailyWorkingTime);
        assert.strictEqual(actual.another, expected.another);
        assert.strictEqual(actual._violation.notify, expected._violation.notify);
        assert.strictEqual(actual._violation.threshold, expected._violation.threshold);
    });


});

