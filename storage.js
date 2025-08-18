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