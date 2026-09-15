export function addListener(state, event, listener) { const list = state.listeners.get(event) ?? []; list.push(listener); state.listeners.set(event, list); return state; }
export function removeListener(state, event, listener) { state.listeners.set(event, (state.listeners.get(event) ?? []).filter(item => item !== listener)); return state; }
export function emit(state, event, ...args) { for (const listener of (state.listeners.get(event) ?? [])) listener(...args); return state; }
