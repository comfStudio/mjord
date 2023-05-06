import SecureStore from 'expo-secure-store';
import { AtomEffect, RecoilState } from 'recoil';

import AsyncStorage from '@react-native-async-storage/async-storage';

export function sercureStoreEffect(key?: string | ((node: RecoilState<any>) => string)): AtomEffect<any> {
    return ({ setSelf, onSet, trigger, node }) => {


        let k: string;
        if (typeof key === 'function') {
            k = key(node);
        } else if (!key) {
            k = node.key;
        } else {
            k = key;
        }

        // If there's a persisted value - set it on load
        const loadPersisted = async () => {
            const savedValue = await SecureStore.getItemAsync(k);

            if (savedValue != null) {
                setSelf(JSON.parse(savedValue));
            }
        };

        // Asynchronously set the persisted data
        if (trigger === 'get') {
            loadPersisted();
        }

        // Subscribe to state changes and persist them to localForage
        onSet((newValue, _, isReset) => {
            isReset
                ? SecureStore.deleteItemAsync(k)
                : SecureStore.setItemAsync(k, JSON.stringify(newValue));
        });
    };
}

/**
 * Like localStorage
 * @param key 
 * @returns 
 */
export function asyncStorageEffect(key?: string | ((node: RecoilState<any>) => string),): AtomEffect<any> {

    return ({ setSelf, onSet, trigger, node }) => {

        let k: string;
        if (typeof key === 'function') {
            k = key(node);
        } else if (!key) {
            k = node.key;
        } else {
            k = key;
        }

        // If there's a persisted value - set it on load
        const loadPersisted = async () => {
            const savedValue = await AsyncStorage.getItem(k);

            if (savedValue != null) {
                setSelf(JSON.parse(savedValue));
            }
        };



        // Asynchronously set the persisted data
        if (trigger === 'get') {
            loadPersisted();
        }

        // Subscribe to state changes and persist them to localForage
        onSet((newValue, _, isReset) => {
            isReset
                ? AsyncStorage.removeItem(k)
                : AsyncStorage.setItem(k, JSON.stringify(newValue));
        });
    };
}