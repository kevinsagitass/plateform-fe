import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface ActiveRoleState {
  activeOrganizationId: string | null;
  activeTenantId: string | null;
  activeRole: string | null;
}

const initialState: ActiveRoleState = {
  activeOrganizationId: null,
  activeTenantId: null,
  activeRole: null,
};

const activeRoleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setValue: <K extends keyof ActiveRoleState>(
      state: ActiveRoleState,
      action: PayloadAction<{ key: K; value: ActiveRoleState[K] }>
    ) => {
      state[action.payload.key] = action.payload.value;
    },
    setValues: (state, action: PayloadAction<Partial<ActiveRoleState>>) => {
      return { ...state, ...action.payload };
    },
    resetActiveRoleState: () => initialState,
  },
});

export const { resetActiveRoleState, setValue, setValues } =
  activeRoleSlice.actions;
export default activeRoleSlice.reducer;
