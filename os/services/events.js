/**
 * SERVICE: Events
 */

export const EventService = {
    emit: (name, detail) => {
        const event = new CustomEvent(name, { detail });
        window.dispatchEvent(event);
    },
    on: (name, callback) => {
        window.addEventListener(name, callback);
    },
    off: (name, callback) => {
        window.removeEventListener(name, callback);
    }
};
