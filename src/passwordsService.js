import { last } from 'lodash-es';
export function loadData() {
    return fetch('passwords.json')
        .then(resp => resp.json());
}

export function getTodayPuzzle(passwords) {
    const today = new Date().toDateString();
    const found = passwords.find(entry => entry.date === today);
    return found || last(passwords);
}