import { useEffect } from "react"
import { useSocketContext } from "../context/SocketContext"
import useConversation from "../zustand/useConversation"
import { MessageType } from "../types/global"

function useListenMessages() {
  const {socket} = useSocketContext()
  const {messages, setMessages} = useConversation()

  useEffect(() => {
    socket?.on('newMessage', (newMessage) => {
      setMessages([...messages, newMessage])
    })
  }, [socket, messages, setMessages])
}
export default useListenMessages