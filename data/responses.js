const responses = []

const initialiseQuizResponses = (n) => {
    responses.length = 0
    for (let i = 0; i < n; i++) {
        responses.push([0,0,0,0])
    }
}

const addQuizResponse = (questionNo, answerNo) => {
    console.log(responses)
    responses[questionNo][answerNo]++
}

const getQuizResponses = (questionNo) => {
    return responses[questionNo]
}

const getQuizTotalResponses = questionNo => {
    const sum = responses[questionNo].reduce((a, b) => a + b, 0);
    return sum
}

module.exports = {
    initialiseQuizResponses, addQuizResponse, getQuizResponses, getQuizTotalResponses
}