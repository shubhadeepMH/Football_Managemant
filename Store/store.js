import { configureStore } from '@reduxjs/toolkit'
import TeamSlice from './Slices/TeamSlice'

const store = configureStore({
  reducer: {
    TeamSlice:TeamSlice.reducer
  },
})

export default store