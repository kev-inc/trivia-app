import { addNewPlayer, addScoreToPlayer, getAllScoresDesc, getPlayerList, initialisePlayers, removePlayer } from "./players"
beforeEach(() => {
    initialisePlayers()
    addNewPlayer(1, 'testplayer1')
    addNewPlayer(2, 'testplayer2')
    expect(getPlayerList()).toEqual(['testplayer1','testplayer2'])
});

test('test add player', () => {
    addNewPlayer(3, 'testplayer3')
    expect(getPlayerList()).toEqual(['testplayer1','testplayer2','testplayer3'])
})

test('test duplicate player', () => {
    const t = () => {
        addNewPlayer(2, 'testplayer1')
    };
    expect(t).toThrow("duplicate name")
})

test('test remove player', () => {
    removePlayer(2)
    expect(getPlayerList()).toEqual(['testplayer1'])
})

test('test add scores', () => {
    addScoreToPlayer(1, 10)
    addScoreToPlayer(2, 40)
    expect(getAllScoresDesc()).toEqual([
        {
            name: 'testplayer2',
            score: 40
        },
        {
            name: 'testplayer1',
            score: 10
        }
    ])

    addScoreToPlayer(1, 50)
    expect(getAllScoresDesc()).toEqual([
        {
            name: 'testplayer1',
            score: 60
        },
        {
            name: 'testplayer2',
            score: 40
        }
    ])
})