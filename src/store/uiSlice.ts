import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UiState {
  isOffline: boolean;
  activeAuctionId: string | null;
}

const initialState: UiState = {
  isOffline: false,
  activeAuctionId: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setOffline: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
    },
    setActiveAuctionId: (state, action: PayloadAction<string | null>) => {
      state.activeAuctionId = action.payload;
    },
  },
});

export const { setOffline, setActiveAuctionId } = uiSlice.actions;
export default uiSlice.reducer;
