import { socket } from "../socket/socket"

const { useEffect } = require("react")

const ResetPage = () => {
    useEffect(() => {
        socket.emit('resetgs')
    }, [])
    return 'OK'
}

export default ResetPage