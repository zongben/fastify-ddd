import { assert, describe, expect, test, vi } from "vitest";
import { assertValid } from ".";

describe("assertValid", () => {
  test("does nothing when validation passes", async () => {
    const validator = {
      Check: vi.fn().mockReturnValue(true),
      Errors: vi.fn(),
    };

    expect(() => {
      assertValid(validator as any, { foo: "bar" });
    }).not.toThrow();

    expect(validator.Check).toHaveBeenCalledWith({ foo: "bar" });
    expect(validator.Errors).not.toHaveBeenCalled();
  });

  test("throws error when validation fails", () => {
    const errors = [{ message: "invalid type" }];

    const validator = {
      Check: vi.fn().mockReturnValue(false),
      Errors: vi.fn().mockReturnValue(errors),
    };

    expect(() => {
      assertValid(validator as any, { foo: 123 });
    }).toThrow(Error);

    expect(validator.Check).toHaveBeenCalled();
    expect(validator.Errors).toHaveBeenCalled();
  });

  test("throws error with serialized validation errors", () => {
    const errors = [{ path: "/foo", message: "required" }];

    const validator = {
      Check: vi.fn().mockReturnValue(false),
      Errors: vi.fn().mockReturnValue(errors),
    };

    try {
      assertValid(validator as any, {});
      assert.fail("should throw");
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect((err as Error).message).toBe(JSON.stringify(errors));
    }
  });
});
