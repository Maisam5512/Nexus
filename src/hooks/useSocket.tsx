import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'
import { Message } from '../types'

interface UseSocketProps {
  onMessageReceived: (message: Message) => void
  onMessageRead?: (messageId: string) => void
}

export const useSocket = ({ onMessageReceived, onMessageRead }: UseSocketProps) => {
  const { user } = useAuth()
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!user) return

    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Initialize socket connection with proper URL formatting
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'
    
    socketRef.current = io(socketUrl, {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'] // Add fallback transport
    })

    // Set up event listeners
    socketRef.current.on('connect', () => {
      console.log('Connected to server')
    })

    socketRef.current.on('receive_message', (message: any) => {
      onMessageReceived(message)
    })

    socketRef.current.on('message_read', (data: { messageId: string }) => {
      if (onMessageRead) {
        onMessageRead(data.messageId)
      }
    })

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server')
    })

    socketRef.current.on('connect_error', (error) => {
      console.error('Connection error:', error)
    })

    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [user, onMessageReceived, onMessageRead])

  // Function to send a message via socket
  const sendMessage = (message: any) => {
    if (socketRef.current) {
      socketRef.current.emit('send_message', message)
    }
  }

  // Function to mark a message as read via socket
  const markAsRead = (messageId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('mark_as_read', { messageId })
    }
  }

  return {
    sendMessage,
    markAsRead,
    isConnected: socketRef.current?.connected || false
  }
}