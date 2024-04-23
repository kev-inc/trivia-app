import { initialiseDB, db, resetDB } from "./db";
import { addNewPlayer, addScoreToPlayer, getAllScoresDesc, getPlayerList, initialisePlayers, removePlayer } from "./players"
describe('players test', () => {

    beforeEach(async () => {
        initialiseDB()
        const players = getPlayerList()
        expect(players.length).toEqual(0)
    });

    afterEach(() => {
        resetDB()
    })
    
    test('test add player', async () => {
        const input = [
            { id: "3", name: "testplayer3" },
            { id: "4", name: "testplayer4" },
        ]
        const want = [
            { id: "3", name: "testplayer3", active: 1 },
            { id: "4", name: "testplayer4", active: 1 },
        ]

        addNewPlayer(input[0]['id'], input[0]['name'])
        expect(getPlayerList().length).toEqual(1)
        expect(getPlayerList()).toEqual(want.slice(0, 1))

        addNewPlayer(input[1]['id'], input[1]['name'])
        expect(getPlayerList().length).toEqual(2)
        expect(getPlayerList()).toEqual(want)
    })
    
    test('test duplicate player', () => {
        const t = () => {
            addNewPlayer("1", 'testplayer1')
            addNewPlayer("2", 'testplayer1')
        };
        expect(t).toThrow("duplicate name")
    })
    
    test('test remove player', async () => {
        addNewPlayer("1", "testplayer1")
        expect(getPlayerList()).toEqual([
            { id: "1", name: "testplayer1", active: 1 },
        ])
        removePlayer("1")
        expect(getPlayerList().length).toEqual(0)
    })
    
    // test('test add scores', () => {
    //     addScoreToPlayer(1, 10)
    //     addScoreToPlayer(2, 40)
    //     expect(getAllScoresDesc()).toEqual([
    //         {
    //             name: 'testplayer2',
    //             score: 40
    //         },
    //         {
    //             name: 'testplayer1',
    //             score: 10
    //         }
    //     ])
    
    //     addScoreToPlayer(1, 50)
    //     expect(getAllScoresDesc()).toEqual([
    //         {
    //             name: 'testplayer1',
    //             score: 60
    //         },
    //         {
    //             name: 'testplayer2',
    //             score: 40
    //         }
    //     ])
    // })
})
