import { createSlice } from '@reduxjs/toolkit'

const savedMessages = localStorage.getItem("msgs");
const initMessages = savedMessages ? JSON.parse(savedMessages) : {};

export const msgSlice = createSlice({
    name:'msgs',
    initialState: {
        msgs: initMessages,
        selectedChat: 1,
        pendingMsg: {},
    },
    reducers: {
        pendMsg: (s, act) => {
            s.pendingMsg[act.payload.id] = act.payload;
            console.log(act.payload)
        },
        removePendMsg: (s, act) => {
            delete s.pendingMsg[act.payload];
        },
        clearPendMsg: (s, act) => {
            s.pendingMsg = {};
        },
        addMsg: (state, action) => {
            if (!state.selectedChat) return
            if (!state.msgs[state.selectedChat]) {
                state.msgs[state.selectedChat] = [];
            }
            state.msgs[state.selectedChat].push(action.payload)
        },
        delMsg: (state, action) => {
            if (!state.selectedChat) return
            if (!state.msgs[state.selectedChat]) return
            state.msgs[state.selectedChat] = state.msgs[state.selectedChat].filter((e) => e['messageId'] != action.payload)
        },
        changeChat: (state, action) => {
            state.selectedChat = action.payload;
        }
    }
})

export const {addMsg, delMsg, changeChat, pendMsg, removePendMsg, clearPendMsg} = msgSlice.actions

export default msgSlice.reducer