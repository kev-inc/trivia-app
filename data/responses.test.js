import { initialiseDB, resetDB } from './db'
import { addNewPlayer, getPlayerList } from './players'
import { addPlayerResponse, addQuizResponse, getAllResponses, getPlayerScore, getQuestionResponses, getQuestionResponsesSum, getQuizResponses, getQuizTotalResponses, getTop5PlayersAndScores, initialiseQuizResponses } from './responses'

describe('responses test', () => {
    beforeEach(() => {
        initialiseDB()
        addNewPlayer("1", "testplayer1")
        addNewPlayer("2", "testplayer2")

        expect(getPlayerList().length).toEqual(2)
        expect(getAllResponses().length).toEqual(0)
    })

    afterEach(() => {
        resetDB()
    })

    test('test adding responses', () => {
        addPlayerResponse("1", 0, 0, 100)
        addPlayerResponse("1", 1, 1, 200)
        addPlayerResponse("2", 0, 2, 300)
        addPlayerResponse("2", 1, 3, 400)

        expect(getAllResponses()).toEqual([
            {id: 1, player_id: "1", question_number: 0, answer_selected: 0, score: 100},
            {id: 2, player_id: "1", question_number: 1, answer_selected: 1, score: 200},
            {id: 3, player_id: "2", question_number: 0, answer_selected: 2, score: 300},
            {id: 4, player_id: "2", question_number: 1, answer_selected: 3, score: 400}
        ])

        expect(getPlayerScore("1", 0)).toEqual(100)
        expect(getPlayerScore("1", 1)).toEqual(300)
        expect(getPlayerScore("2", 0)).toEqual(300)
        expect(getPlayerScore("2", 1)).toEqual(700)

        expect(getQuestionResponses(0)).toEqual([
            {answer_selected: 0, count: 1},
            {answer_selected: 2, count: 1},
        ])

        expect(getQuestionResponses(1)).toEqual([
            {answer_selected: 1, count: 1},
            {answer_selected: 3, count: 1},
        ])

        expect(getQuestionResponsesSum(0)).toEqual(2)
        expect(getQuestionResponsesSum(1)).toEqual(2)

        expect(getTop5PlayersAndScores(0)).toEqual([
            {player_id: "2", name: "testplayer2", score: 300},
            {player_id: "1", name: "testplayer1", score: 100}
        ])
        expect(getTop5PlayersAndScores(1)).toEqual([
            {player_id: "2", name: "testplayer2", score: 700},
            {player_id: "1", name: "testplayer1", score: 300}
        ])
    })


    test('test adding more responses', () => {

        addNewPlayer("3", "testplayer3")
        addNewPlayer("4", "testplayer4")
        addNewPlayer("5", "testplayer5")
        addNewPlayer("6", "testplayer6")

        addPlayerResponse("1", 0, 0, 10)
        addPlayerResponse("1", 1, 1, 2)
        addPlayerResponse("1", 2, 3, 5)
        addPlayerResponse("1", 3, 2, 3)
        addPlayerResponse("1", 4, 1, 1)
        addPlayerResponse("1", 5, 3, 7)
        
        addPlayerResponse("2", 0, 2, 2)
        addPlayerResponse("2", 1, 0, 4)
        addPlayerResponse("2", 2, 1, 7)
        addPlayerResponse("2", 3, 3, 3)
        addPlayerResponse("2", 4, 0, 1)
        addPlayerResponse("2", 5, 1, 9)
        
        addPlayerResponse("3", 0, 1, 4)
        addPlayerResponse("3", 1, 1, 4)
        addPlayerResponse("3", 2, 1, 4)
        addPlayerResponse("3", 3, 1, 4)
        addPlayerResponse("3", 4, 1, 4)
        addPlayerResponse("3", 5, 1, 4)
        
        addPlayerResponse("4", 0, 2, 6)
        addPlayerResponse("4", 1, 2, 6)
        addPlayerResponse("4", 2, 2, 6)
        addPlayerResponse("4", 3, 2, 6)
        addPlayerResponse("4", 4, 2, 6)
        addPlayerResponse("4", 5, 2, 6)
        
        addPlayerResponse("5", 0, 3, 1)
        addPlayerResponse("5", 1, 3, 3)
        addPlayerResponse("5", 2, 3, 2)
        addPlayerResponse("5", 3, 3, 3)
        addPlayerResponse("5", 4, 3, 7)
        addPlayerResponse("5", 5, 3, 3)
        
        addPlayerResponse("6", 0, 0, 0)
        addPlayerResponse("6", 1, 0, 0)
        addPlayerResponse("6", 2, 0, 0)
        addPlayerResponse("6", 3, 0, 0)
        addPlayerResponse("6", 4, 0, 0)
        addPlayerResponse("6", 5, 0, 0)


        expect(getPlayerScore("1", 5)).toEqual(28)
        expect(getPlayerScore("2", 5)).toEqual(26)
        expect(getPlayerScore("3", 5)).toEqual(24)
        expect(getPlayerScore("4", 5)).toEqual(36)
        expect(getPlayerScore("5", 5)).toEqual(19)
        expect(getPlayerScore("6", 5)).toEqual(0)

        expect(getQuestionResponses(0)).toEqual([
            {answer_selected: 0, count: 2},
            {answer_selected: 1, count: 1},
            {answer_selected: 2, count: 2},
            {answer_selected: 3, count: 1},
        ])
        expect(getQuestionResponses(1)).toEqual([
            {answer_selected: 0, count: 2},
            {answer_selected: 1, count: 2},
            {answer_selected: 2, count: 1},
            {answer_selected: 3, count: 1},
        ])
        expect(getQuestionResponses(2)).toEqual([
            {answer_selected: 0, count: 1},
            {answer_selected: 1, count: 2},
            {answer_selected: 2, count: 1},
            {answer_selected: 3, count: 2},
        ])
        expect(getQuestionResponses(3)).toEqual([
            {answer_selected: 0, count: 1},
            {answer_selected: 1, count: 1},
            {answer_selected: 2, count: 2},
            {answer_selected: 3, count: 2},
        ])
        expect(getQuestionResponses(4)).toEqual([
            {answer_selected: 0, count: 2},
            {answer_selected: 1, count: 2},
            {answer_selected: 2, count: 1},
            {answer_selected: 3, count: 1},
        ])
        expect(getQuestionResponses(5)).toEqual([
            {answer_selected: 0, count: 1},
            {answer_selected: 1, count: 2},
            {answer_selected: 2, count: 1},
            {answer_selected: 3, count: 2},
        ])


        expect(getQuestionResponsesSum(0)).toEqual(6)
        expect(getQuestionResponsesSum(1)).toEqual(6)
        expect(getQuestionResponsesSum(2)).toEqual(6)
        expect(getQuestionResponsesSum(3)).toEqual(6)
        expect(getQuestionResponsesSum(4)).toEqual(6)
        expect(getQuestionResponsesSum(5)).toEqual(6)

        expect(getTop5PlayersAndScores(0)).toEqual([
            {player_id: "1", name: "testplayer1", score: 10},
            {player_id: "4", name: "testplayer4", score: 6},
            {player_id: "3", name: "testplayer3", score: 4},
            {player_id: "2", name: "testplayer2", score: 2},
            {player_id: "5", name: "testplayer5", score: 1},
        ])

        expect(getTop5PlayersAndScores(6)).toEqual([
            {player_id: "4", name: "testplayer4", score: 36},
            {player_id: "1", name: "testplayer1", score: 28},
            {player_id: "2", name: "testplayer2", score: 26},
            {player_id: "3", name: "testplayer3", score: 24},
            {player_id: "5", name: "testplayer5", score: 19},
        ])
    })

})