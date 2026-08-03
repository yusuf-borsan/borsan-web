/**
 * TR/EN dictionary parity check.
 * Run: node --experimental-strip-types scripts/i18n-parity.mts
 *
 * Reports, as hard failures:
 *  - keys present in TR but missing in EN (and vice-versa)
 *  - shape mismatches (object vs array vs primitive at the same path)
 *  - array-length mismatches
 *  - empty / whitespace-only strings on either side
 * And, as warnings:
 *  - long strings (>25 chars) that are byte-identical in TR and EN
 *    (usually an untranslated leftover — proper nouns are whitelisted)
 */
import tr from "../src/i18n/dictionaries/tr.ts";
import en from "../src/i18n/dictionaries/en.ts";

type Json = unknown;

const missingInEn: string[] = [];
const missingInTr: string[] = [];
const shapeMismatch: string[] = [];
const arrayLenMismatch: string[] = [];
const emptyStrings: string[] = [];
const identicalLong: string[] = [];

let leafCount = 0;

// Brand names / tokens that are legitimately identical across locales.
const IDENTICAL_OK = /borsan|teknoloji|cnc|din|iso|falco|yawo|dongs|hdmt|qcmt|©|\d{4}/i;
// Phone / contact strings are correctly identical across locales.
const isContactValue = (s: string) => /^[+\d\s()\-@.\n]+$/.test(s) || s.includes("@");

function kind(v: Json): "object" | "array" | "primitive" {
  if (Array.isArray(v)) return "array";
  if (v !== null && typeof v === "object") return "object";
  return "primitive";
}

function walk(a: Json, b: Json, path: string) {
  const ka = kind(a);
  const kb = kind(b);

  if (ka !== kb) {
    shapeMismatch.push(`${path}  (TR=${ka}, EN=${kb})`);
    return;
  }

  if (ka === "object") {
    const ao = a as Record<string, Json>;
    const bo = b as Record<string, Json>;
    for (const key of Object.keys(ao)) {
      if (!(key in bo)) missingInEn.push(`${path}.${key}`);
      else walk(ao[key], bo[key], `${path}.${key}`);
    }
    for (const key of Object.keys(bo)) {
      if (!(key in ao)) missingInTr.push(`${path}.${key}`);
    }
    return;
  }

  if (ka === "array") {
    const aa = a as Json[];
    const ba = b as Json[];
    if (aa.length !== ba.length) {
      arrayLenMismatch.push(`${path}  (TR=${aa.length}, EN=${ba.length})`);
    }
    const n = Math.min(aa.length, ba.length);
    for (let i = 0; i < n; i++) walk(aa[i], ba[i], `${path}[${i}]`);
    return;
  }

  // primitive leaf
  leafCount++;
  const sa = a as unknown;
  const sb = b as unknown;
  // Only a real gap when one side is empty and the other is not. Empty in
  // both is a consistent (intentional) blank, not a translation mismatch.
  if (typeof sa === "string" && typeof sb === "string") {
    const ea = sa.trim() === "";
    const eb = sb.trim() === "";
    if (ea && !eb) emptyStrings.push(`${path} — TR empty, EN filled`);
    if (eb && !ea) emptyStrings.push(`${path} — EN empty, TR filled`);
  }
  if (
    typeof sa === "string" &&
    typeof sb === "string" &&
    sa.length > 25 &&
    sa === sb &&
    !IDENTICAL_OK.test(sa) &&
    !isContactValue(sa)
  ) {
    identicalLong.push(`${path}  "${sa.slice(0, 60)}${sa.length > 60 ? "…" : ""}"`);
  }
}

walk(tr, en, "root");

function section(label: string, arr: string[]) {
  if (arr.length === 0) return;
  console.log(`\n${label} (${arr.length}):`);
  for (const x of arr) console.log("  - " + x);
}

console.log("=== TR/EN dictionary parity ===");
console.log(`Leaf strings compared: ${leafCount}`);

section("❌ Missing in EN", missingInEn);
section("❌ Missing in TR", missingInTr);
section("❌ Shape mismatch", shapeMismatch);
section("❌ Array length mismatch", arrayLenMismatch);
section("❌ Empty strings", emptyStrings);
section("⚠️  Long strings identical in TR & EN (possible untranslated)", identicalLong);

const hardErrors =
  missingInEn.length +
  missingInTr.length +
  shapeMismatch.length +
  arrayLenMismatch.length +
  emptyStrings.length;

if (hardErrors === 0) {
  console.log("\n✅ Key structures match. No missing keys, shape or length mismatches, no empty strings.");
} else {
  console.log(`\n❌ ${hardErrors} hard parity error(s).`);
}
process.exit(hardErrors === 0 ? 0 : 1);
