import { createSlice } from '@reduxjs/toolkit';

export const themeSlice = createSlice({
    name: 'colorMode',
    initialState: {
        darkMode: false,
    },
    reducers: {
        toggleTheme: (state) => {
            state.darkMode = !state.darkMode;
        },
    },
});
export const { toggleTheme } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
