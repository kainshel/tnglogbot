export const LS_KEYS = {
  PROFILE: 'tng_profile',
};

function safeLocalStorage() {
  try {
    const test = '__tng__';
    window.localStorage.setItem(test, '1');
    window.localStorage.removeItem(test);
    return window.localStorage;
  } catch (e) {
    let mem = {};
    return {
      getItem: k => (k in mem ? mem[k] : null),
      setItem: (k,v) => { mem[k]=String(v) },
      removeItem: k => { delete mem[k] },
      clear: () => { mem = {} }
    };
  }
}

const ls = safeLocalStorage();

export function saveProfile(profile) {
  ls.setItem(LS_KEYS.PROFILE, JSON.stringify(profile || {}));
}

export function loadProfile() {
  try {
    return JSON.parse(ls.getItem(LS_KEYS.PROFILE) || '{}');
  } catch(e) {
    return {};
  }
}

export const WORKOUT_KEY = 'tng_workouts';

export function saveWorkout(dateISO, workout) {
  if (!dateISO) return;
  let all = {};
  try { all = JSON.parse(ls.getItem(WORKOUT_KEY) || '{}'); } catch (e) { all = {}; }
  all[dateISO] = workout || {};
  ls.setItem(WORKOUT_KEY, JSON.stringify(all));
}

export function loadWorkout(dateISO) {
  if (!dateISO) return null;
  try {
    const all = JSON.parse(ls.getItem(WORKOUT_KEY) || '{}');
    return all[dateISO] || null;
  } catch (e) {
    return null;
  }
}

export function loadAllWorkouts() {
  try { return JSON.parse(ls.getItem(WORKOUT_KEY) || '{}'); } catch (e) { return {}; }
}