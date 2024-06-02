import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name:'user',
    initialState: {
        user: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        delUser: (state, action) => {
            state.user = null;
        }
    }
})

export const {setUser, delUser} = userSlice.actions

export default userSlice.reducer