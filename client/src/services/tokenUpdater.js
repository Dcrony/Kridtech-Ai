const tokenChangeListeners = new Set();

export const onTokenChange = (listener) => {
  tokenChangeListeners.add(listener);
  return () => tokenChangeListeners.delete(listener);
};

export const emitTokenChange = (token) => {
  tokenChangeListeners.forEach((listener) => {
    try {
      listener(token);
    } catch (error) {
      console.error('[tokenUpdater] listener error', error);
    }
  });
};

