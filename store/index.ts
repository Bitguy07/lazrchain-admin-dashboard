import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

//Slices
import authReducer from '@/reduxElement/Slices/auth';
import layoutReducer from '@/reduxElement/Slices/layout';
import tierRefEditReducer from '@/reduxElement/Slices/tierRefEdit';
import tierRewEditReducer from '@/reduxElement/Slices/tierRewEdit';


//RTK query api's
import { authApi } from '@/reduxElement/RTK_Queries/auth'
import { walletAddressApi } from '@/reduxElement/RTK_Queries/walletAddress';
import { tiersApi } from '@/reduxElement/RTK_Queries/tiers';




/* ----------  Per‑slice persistence configs  ---------- */
const persistConfigAuth = {
  key: 'auth',
  storage,
};

const persistConfigLayout = {
  key: 'layout',
  storage,
};

const persistConfigTierRefEdit = {
  key: 'tierRefEdit',
  storage,
};

const persistConfigTierRewEdit = {
  key: 'tierRewEdit',
  storage,
};



/* ----------  Wrap the reducers  ---------- */
const persistedAuth   = persistReducer(persistConfigAuth, authReducer);
const persistedLayout   = persistReducer(persistConfigLayout, layoutReducer);
const persistedTierRefEdit   = persistReducer(persistConfigTierRefEdit, tierRefEditReducer);
const persistedTierRewEdit   = persistReducer(persistConfigTierRewEdit, tierRewEditReducer);



/* ----------  Store  ---------- */
export const store = configureStore({
  reducer: {
    auth:     persistedAuth,
    layout:   persistedLayout,
    tierRefEdit: persistedTierRefEdit,
    tierRewEdit: persistedTierRewEdit,
    
    [authApi.reducerPath]: authApi.reducer,
    [walletAddressApi.reducerPath]: walletAddressApi.reducer,
    [tiersApi.reducerPath]: tiersApi.reducer,
    },

    /* RTK‑Query reducers (non‑persistent) */
 middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
    .concat(
      authApi.middleware,
      walletAddressApi.middleware,
      tiersApi.middleware,
    ),
});

/* ----------  Persistor  ---------- */
export const persistor = persistStore(store);


/* ----------  Types  ---------- */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
