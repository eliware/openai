export function scheduleEvents(state, batch, delay, emit) {
  for (const event of batch) {
    const timer = setTimeout(() => { state._timers.delete(timer); if (state.readyState !== 3) emit('message', JSON.stringify(event), false); }, delay);
    state._timers.add(timer);
  }
}

export function cancelTimers(state) { for (const timer of state._timers) clearTimeout(timer); state._timers.clear(); }
