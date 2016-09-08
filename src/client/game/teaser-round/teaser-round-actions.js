export const SET_TEASER = 'SET_TEASER';

export function setTeaser(anagram) {
    return {
        type: SET_TEASER,
        payload: anagram
    }
}