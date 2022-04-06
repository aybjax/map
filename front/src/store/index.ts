import {configureStore} from '@reduxjs/toolkit'
import yearReducer from '../features/year-slice'

export const store = configureStore({
    reducer: {
        year: yearReducer,
    }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>