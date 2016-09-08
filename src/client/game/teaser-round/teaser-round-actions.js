export const SET_TEASER = 'SET_TEASER';
export const SET_TEASER_SOLUTION = 'SET_TEASER_SOLUTION';

export function setTeaser(anagram) {
    return {
        type: SET_TEASER,
        payload: anagram
    }
}

export function setTeaserSolution(solution) {
    return {
        type: SET_TEASER_SOLUTION,
        payload: solution
    }
}