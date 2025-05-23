import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import * as React from 'react';
import store, { persistor } from "@/lib/store/store";

type StoreProviderProps = {
    children: React.ReactNode;
};

export function StoreProvider({ children }: StoreProviderProps) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
}
