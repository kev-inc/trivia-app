import { addQuizResponse, getQuizResponses, getQuizTotalResponses, initialiseQuizResponses } from './responses'

beforeEach(() => {
    initialiseQuizResponses(10)
})

test('test initialisation', () => {
    for (let i = 0; i < 10; i++) {
        expect(getQuizResponses(i)).toStrictEqual([0,0,0,0])
    }
})

test('test adding responses', () => {
    // Add 4 points to Q1, A1
    addQuizResponse(0, 0)
    addQuizResponse(0, 0)
    addQuizResponse(0, 0)
    addQuizResponse(0, 0)

    // Add 2 points to Q1, A4
    addQuizResponse(0, 3)
    addQuizResponse(0, 3)

    // Add 3 points to Q4, A3
    addQuizResponse(3, 2)
    addQuizResponse(3, 2)
    addQuizResponse(3, 2)

    expect(getQuizResponses(0)).toStrictEqual([4,0,0,2])
    expect(getQuizResponses(3)).toStrictEqual([0,0,3,0])
    expect(getQuizTotalResponses(0)).toBe(6)
    expect(getQuizTotalResponses(3)).toBe(3)
})