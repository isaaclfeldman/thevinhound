
import Database from 'better-sqlite3';
import path from 'path'; import fs from 'fs';
const dbPath = path.join(process.cwd(), 'data.sqlite');
const firstRun = !fs.existsSync(dbPath);
const db = new Database(dbPath);
if(firstRun){
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, payload TEXT, contact TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, credits INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS payments (id TEXT PRIMARY KEY, email TEXT, amount INTEGER, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  `);
}
export function saveLead(type:string, payload:any, contact:any){ const stmt=db.prepare('INSERT INTO leads (type,payload,contact) VALUES (?,?,?)'); const info=stmt.run(type, JSON.stringify(payload||{}), JSON.stringify(contact||{})); return info.lastInsertRowid; }
export function addCredits(email:string, amount:number){ const up=db.prepare('INSERT INTO users(email, credits) VALUES(?, ?) ON CONFLICT(email) DO UPDATE SET credits=credits+excluded.credits'); up.run(email, amount); }
export function getCredits(email:string){ const row=db.prepare('SELECT credits FROM users WHERE email=?').get(email); return row?.credits || 0; }
export function consumeCredit(email:string, n:number=1){ const current=getCredits(email); if(current<n) return false; const upd=db.prepare('UPDATE users SET credits=credits-? WHERE email=?'); upd.run(n,email); return true; }
