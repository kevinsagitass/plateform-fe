import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface User {
  id: string
  name: string
  email: string
}

interface UserState {
  users: User[]
  selectedUser: User | null
  isLoading: boolean
  error: string | null
}

// Async Thunks
export const fetchUsers = createAsyncThunk(
  'user/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      return await response.json()
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchUserById = createAsyncThunk(
  'user/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${id}`)
      if (!response.ok) throw new Error('User not found')
      return await response.json()
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState: UserState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Fetch User By Id
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedUser = action.payload
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearSelectedUser, clearError } = userSlice.actions
export default userSlice.reducer