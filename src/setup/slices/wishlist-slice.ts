import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WishlistState } from './models';

const initialState: WishlistState = {
    items: [],
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        addToWishlist(state, action: PayloadAction<number>) {
            const itemId = action.payload;
            if (!state.items.includes(itemId)) {
                state.items.push(itemId);
            }
        },
        removeFromWishlist(state, action: PayloadAction<number>) {
            state.items = state.items.filter(id => id !== action.payload);
        },
        setWishlist(state, action: PayloadAction<number[]>) {
            state.items = action.payload;
        },
    },
});

export const { addToWishlist, removeFromWishlist, setWishlist } = wishlistSlice.actions;
export default wishlistSlice;
