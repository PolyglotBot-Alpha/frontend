import { createSlice } from '@reduxjs/toolkit'

// const savedChats = localStorage.getItem("chats");
// const initChats = savedChats ? JSON.parse(savedChats) : [];

export const chatSlice = createSlice({
    name:'chat',
    initialState: {
        chats: []
    },
    reducers: {
        addChat: (state, action) => {
            state.chats.push(action.payload)
        },
        delChat: (state, action) => {
            state.chats = state.chats.filter((e) => e['chatId'] != action.payload)
        },
        setChat: (state, action) => {
            state.chats = action.payload;
        },
        logoutChat: (s, act) => {
            s.chats = [];
        },
    }
})

export const {addChat, delChat, setChat, logoutChat} = chatSlice.actions

export default chatSlice.reducer