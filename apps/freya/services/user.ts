
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { User as AuthUser } from '@supabase/supabase-js';
import { useMutation, useQuery } from '@tanstack/react-query';

import constant, { ROUTES, ServiceType } from '../constants';
import { Service } from './base';
import { ProfileData } from './types';

export default class User extends Service {

    constructor() {
        super(ServiceType.User);

    }

    async init() {

    }

    async getProfile() {

        const { data: { user } } = await constant.supabase.auth.getUser()

        const { data, error } = await constant.supabase
            .from("profiles")
            .select(`
            *
        `)
            .eq('id', user?.id)
            .single()

        if (error) {
            throw error;
        }

        return data as ProfileData;
    }

    async updateProfile(profile: Omit<ProfileData, "id">) {

        const { data: { user } } = await constant.supabase.auth.getUser()

        const { data, error } = await constant.supabase
            .from("profiles")
            .update(profile)
            .eq('id', user.id)
            .single()

        if (error) {
            throw error;
        }

        return data as ProfileData;
    }


    async login(email: string) {
        const { data, error } = await constant.supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: true,
            },
        });

        return { data, error };
    }

    async verifyLogin(email: string, token: string) {
        const { data, error } = await constant.supabase.auth.verifyOtp({
            email,
            token,
            type: "email",
            options: {},
        });


        return { data, error };
    }
}


export class UserHelpers {
    static emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    static validEmailDomains = ["post.au.dk", "uni.au.dk"].sort((a, b) =>
        a.localeCompare(b)
    );
}


export function useSupabaseClient() {
    return constant.supabase;
}

export function useAuthUser() {
    const client = useSupabaseClient();

    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        const { data: authListener } = client.auth.onAuthStateChange(
            async (event, session) => {
                switch (event) {
                    case 'SIGNED_IN':
                        setUser(session.user);
                        break;
                    case 'SIGNED_OUT':
                        setUser(null);
                        break;
                    case 'USER_UPDATED':
                        setUser(session.user);
                        break;
                    case 'TOKEN_REFRESHED':
                        setUser(session.user);
                        break;
                }
            }
        );

        return () => {
            authListener?.subscription?.unsubscribe?.();
        };
    }, []);

    return user
}


export function useAuthRedirect() {
    const user = useAuthUser();
    const router = useRouter();


    useEffect(() => {
        if (!user) {
            router.replace(ROUTES.LOGIN);
        }
    }, [user]);
}

export function useProfile() {
    const service = constant.service.get(ServiceType.User);
    const user = useAuthUser();

    const q = useQuery(
        ['profile', user?.id],
        async () => {
            const data = await service.getProfile();
            return data;
        }
    );
    return q
}

export function useUpdateProfile() {
    const service = constant.service.get(ServiceType.User);
    const user = useAuthUser();

    const m = useMutation({
        mutationFn: async (profile: Omit<ProfileData, "id">) => {
            const data = await service.updateProfile(profile);
            return data;
        }
    })

    return m
}