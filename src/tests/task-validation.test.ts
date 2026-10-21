import { describe, it, expect } from "vitest";

// Reusable business logic & validators from the application
function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function calculatePagination(page: number, pageSize: number, totalCount: number) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  return { from, to, totalPages };
}

describe("Task Business Logic & Validation", () => {
  describe("Date Validation (isValidDate)", () => {
    it("should accept valid YYYY-MM-DD dates", () => {
      expect(isValidDate("2026-10-21")).toBe(true);
      expect(isValidDate("2024-02-29")).toBe(true); // Leap year
    });

    it("should reject malformed date strings", () => {
      expect(isValidDate("21-10-2026")).toBe(false);
      expect(isValidDate("2026/10/21")).toBe(false);
      expect(isValidDate("not-a-date")).toBe(false);
      expect(isValidDate("")).toBe(false);
    });

    it("should reject non-existent calendar dates", () => {
      expect(isValidDate("2026-02-31")).toBe(false);
      expect(isValidDate("2026-04-31")).toBe(false); // April has 30 days
      expect(isValidDate("2025-02-29")).toBe(false); // Not a leap year
    });
  });

  describe("UUID Validation", () => {
    it("should validate standard v4 UUIDs", () => {
      const validUUID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
      expect(uuidRegex.test(validUUID)).toBe(true);
    });

    it("should reject invalid UUIDs", () => {
      expect(uuidRegex.test("123-invalid-uuid")).toBe(false);
      expect(uuidRegex.test("a0eebc99-9c0b-4ef8-bb6d")).toBe(false);
      expect(uuidRegex.test("")).toBe(false);
    });
  });

  describe("Database Pagination Calculation", () => {
    it("should calculate correct from/to ranges for Supabase .range()", () => {
      const page1 = calculatePagination(1, 5, 23);
      expect(page1.from).toBe(0);
      expect(page1.to).toBe(4);
      expect(page1.totalPages).toBe(5);

      const page2 = calculatePagination(2, 5, 23);
      expect(page2.from).toBe(5);
      expect(page2.to).toBe(9);

      const page5 = calculatePagination(5, 5, 23);
      expect(page5.from).toBe(20);
      expect(page5.to).toBe(24);
    });

    it("should handle empty or single-item datasets", () => {
      const empty = calculatePagination(1, 5, 0);
      expect(empty.totalPages).toBe(1);

      const single = calculatePagination(1, 5, 1);
      expect(single.totalPages).toBe(1);
    });
  });
});
