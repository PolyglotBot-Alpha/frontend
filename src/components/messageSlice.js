import { createSlice } from '@reduxjs/toolkit'

// const savedMessages = localStorage.getItem("msgs");
// const initMessages = savedMessages ? JSON.parse(savedMessages) : {};

export const msgSlice = createSlice({
    name:'msgs',
    initialState: {
        msgs: {},
        selectedChat: null,
        pendingMsg: {},
        unsyncedMsgs: {},
        hasUnsync: false,
        retrying: false,
    },
    reducers: {
        pendMsg: (s, act) => {
            s.pendingMsg[act.payload.id] = act.payload;
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
        populateMsg: (state, action) => {
            state.msgs[action.payload.chatId] = action.payload.msgs.map((msg)=>{
                return {
                    text: msg.messageContent,
                    audioUrl: msg.audio,
                    id: msg.messageId,
                    chatId: msg.chatId,
                    sender: msg.userId === "bot" ? "bot" : "user"
                };
            })
        },
        delMsg: (state, action) => {
            if (!state.selectedChat) return
            if (!state.msgs[state.selectedChat]) return
            state.msgs[state.selectedChat] = state.msgs[state.selectedChat].filter((e) => e['messageId'] != action.payload)
        },
        addUnsync: (s, act) => {
            s.unsyncedMsgs[act.payload.id] = act.payload;
            s.hasUnsync = true;
        },
        syncUnsync: (s, act) => {
            const uns = s.unsyncedMsgs[act.payload.pendId]
            if (!s.msgs[uns.chatId]){
                s.msgs[uns.chatId] = []
            }
            s.msgs[uns.chatId].push({
                ...uns,
                id: act.payload.messageId,
            })
            delete s.unsyncedMsgs[act.payload.pendId];
            if (Object.keys(s.unsyncedMsgs).length == 0) s.hasUnsync = false;
        },
        setRetry: (s, act) =>{
            s.retrying = act.payload;
        },
        changeChat: (state, action) => {
            state.selectedChat = action.payload;
        }
    }
})

export const {
    addMsg, delMsg, changeChat, pendMsg, 
    removePendMsg, clearPendMsg, populateMsg, 
    addUnsync, syncUnsync, setRetry
} = msgSlice.actions

export default msgSlice.reducer