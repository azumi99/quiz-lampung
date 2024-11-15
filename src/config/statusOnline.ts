import React, { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { supabase } from './supabase';
import { UserStore } from './store';


const updateOnlineStatus = async (userId, isOnline) => {
    const { error } = await supabase
        .from('user_status')
        .upsert({ user_id: userId, is_online: isOnline, last_seen: new Date() });

    if (error) console.log('Error updating online status:', error.message);
};

const OnlineStatusUpdater = () => {
    const [appState, setAppState] = useState(AppState.currentState);
    const { user } = UserStore()
    const userId = user?.id;

    useEffect(() => {
        updateOnlineStatus(userId, true);

        const handleAppStateChange = (nextAppState) => {
            if (appState.match(/active/) && nextAppState === 'background') {
                updateOnlineStatus(userId, false);
            } else if (nextAppState === 'active') {
                updateOnlineStatus(userId, true);
            }
            setAppState(nextAppState);
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            updateOnlineStatus(userId, false);
            subscription.remove();
        };
    }, [appState, userId]);

    return null;
};

export { OnlineStatusUpdater };
