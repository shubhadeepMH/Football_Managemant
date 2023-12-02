import { createSlice } from "@reduxjs/toolkit";
const TeamSlice = createSlice({
    name: 'TeamSlice',
    initialState: [],
    reducers: {
        updatePlayerData(state, action) {
            const newState = { ...state };
            newState.data = action.payload;
            return newState;
        },
        
        addTeam(state, action) {
            return action.payload;
        },
        updateFileName(state, action) {
            const newState = { ...state };
            newState.fileName = action.payload;
            return newState
        }
    }
})
export default TeamSlice;
export const { updatePlayerData, deletePlayer, addTeam, updateFileName } = TeamSlice.actions;