import { uidKey } from './utils.js';

const VERSION = 1;

export function getKey(name) {
  return uidKey('tng_' + name + '_v' + VERSION);
}

export function loadJSON(name) {
  try {
    const raw = localStorage.getItem(getKey(name));
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

export function saveJSON(name, data) {
  try { localStorage.setItem(getKey(name), JSON.stringify(data)); return true; } catch (e) { return false; }
}

export function listKeys() {
  // list tng keys for this user
  return Object.keys(localStorage).filter(k => k.startsWith('tng_'));
}
