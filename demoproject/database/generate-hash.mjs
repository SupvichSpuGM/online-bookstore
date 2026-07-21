// Script สร้าง bcrypt hash สำหรับ seed.sql
// รันด้วย: node database/generate-hash.mjs

import { createHash } from "crypto";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

let bcrypt;
try {
  bcrypt = require("bcryptjs");
} catch {
  console.error("กรุณาติดตั้ง bcryptjs ก่อน: npm install bcryptjs");
  process.exit(1);
}

const password = "password123";
const hash = await bcrypt.hash(password, 10);

console.log("Password:", password);
console.log("Hash:", hash);
console.log("\n-- ใช้ hash นี้ใน seed.sql ทุก user:");
console.log(`'${hash}'`);
