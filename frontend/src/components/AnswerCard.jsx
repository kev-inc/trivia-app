const AnswerCard = ({onclick, color, translucent, animated, children}) => {

    let className = ''
    switch(color) {
        case 'red': className = 'bg-red-500 border-red-400 active:bg-red-700'
            break;
        case 'blue': className = 'bg-blue-500 border-blue-400 active:bg-blue-700'
            break;
        case 'green': className = 'bg-green-500 border-green-400 active:bg-green-700'
            break;
        case 'yellow': className = 'bg-yellow-500 border-yellow-400 active:bg-yellow-700'
            break;
        default: className = 'bg-white border-slate-200'
            break;
    }
    if (translucent) {
        className += ' opacity-20'
    }
    if (animated) {
        className += ' animate__animated animate__bounceIn'
    }

    return <div className={`${className} select-none cursor-pointer border-b-8 rounded-lg p-4`} onClick={onclick}>
        {children}
    </div>
    
}

export default AnswerCard