import {createSlice, PayloadAction} from '@reduxjs/toolkit'

interface YearState {
    year: number
}

const initialState: YearState = {
    year: 2022,
}

const yearSlice = createSlice({
    name: 'year',
    initialState,
    reducers: {
        yearSet(state, action: PayloadAction<number>) {
            state.year = action.payload
        }
    }
})

export const {yearSet} = yearSlice.actions

export default yearSlice.reducer