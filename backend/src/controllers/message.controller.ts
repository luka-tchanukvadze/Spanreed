import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req: Request, res: Response): Promise<any> => {
  try {
    const { message } = req.body
    const { id: receiverId } = req.params
    const senderId = req.user.id
    
    let conversation = await prisma.conversation.findFirst({
      where: {
        participantsIds: {
          hasEvery: [senderId, receiverId]
        }
      }
    })

    // the very first message is being send, that's why we need to create a converstion
    if(!conversation) { 
      conversation = await prisma.conversation.create({
        data: {
          participantsIds: {
            set: [senderId, receiverId]
          }
        }
      })
    }

    const newMesage = await prisma.message.create({
      data: {
        senderId,
        body: message,
        converationId: conversation.id
      }
    })

    if(newMesage) {
      conversation = await prisma.conversation.update({
        where: {
          id: conversation.id
        },
        data: {
          messages: {
            connect: {
              id: newMesage.id
            }
          }
        }
      })
    }

    // Socket io will go here
    const receiverSocketId = getReceiverSocketId(receiverId)

    if(receiverSocketId){
      io.to(receiverSocketId).emit('newMessage', newMesage)
    }

    res.status(201).json(newMesage)
  } catch (error: any) {
    console.error('Error in sendMessage: ', error.message)
    res.status(500).json({error: 'Internal sever error'})
  }
}

export const getMessages = async(req: Request, res: Response): Promise<any> => {
  try {
    const { id: userToChatId } = req.params
    const senderId = req.user.id

    const conversation = await prisma.conversation.findFirst({
      where: {
        participantsIds: {
          hasEvery: [senderId, userToChatId]
        }
      }, 
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    if(!conversation){
      return res.status(200).json([])
    }

    res.status(200).json(conversation.messages)
  } catch (error: any) {
    console.error('Error in getMessages: ', error.message)
    res.status(500).json({
      error: 'Internal server error'
    })
  }
}


export const getUsersForSidebar = async(req: Request, res: Response): Promise<any> => {
  try {

    const authUserId = req.user.id

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: authUserId
        }
      },
      select: {
        id: true,
        fullName: true,
        profilePic: true
      }
    })

    res.status(200).json(users)
    
  } catch (error:any) {
    console.error('Error in getUsersForSidebar: ', error.message)
    res.status(500).json({ error: 'Internal server error' })
  }
}