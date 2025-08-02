// 1. Add RTK Slice for editing state (e.g. /reduxElement/features/tierEditSlice.ts)
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TierEditState {
  selectedIndex: number | null;

  selectedField:        
        "min"
      | "max"
      | "dailyYieldMin"
      | "dailyYieldMax"
      | "description"
      | "minMax" 
      | "dailyYieldRange" | null;

  dialogOpen: boolean;
}

const initialState: TierEditState = {
  selectedIndex: null,
  selectedField: null,
  dialogOpen: false,
};

const tierEditSlice = createSlice({
  name: "tierRewEdit",
  initialState,
  reducers: {
    openDialog(state, action: PayloadAction<{ index: number; field: TierEditState["selectedField"] }>) {
      state.selectedIndex = action.payload.index;
      state.selectedField = action.payload.field;
      state.dialogOpen = true;
    },
    closeDialog(state) {
      state.dialogOpen = false;
      state.selectedIndex = null;
      state.selectedField = null;
    },
  },
});

export const { openDialog, closeDialog } = tierEditSlice.actions;
export default tierEditSlice.reducer;
