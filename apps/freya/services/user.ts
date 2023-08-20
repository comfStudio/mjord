
import { useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { useMutation, useQuery } from '@tanstack/react-query';

import constant, { ROUTES, ServiceType } from '../constants';
import { UserState } from '../state';
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

    async updateProfile(profile: Partial<Omit<ProfileData, "id">>) {

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
    static validEmailDomains = ["post.au.dk", "uni.au.dk"].sort((a, b) =>
        a.localeCompare(b)
    );
}

export function userRequireOnboarding(profile: ProfileData) {
    // TODO: onboarding data should be in profiles.extra
    return !profile?.name
}

export function useSupabaseClient() {
    return constant.supabase;
}

export function useAuthListener() {
    const client = useSupabaseClient();
    const router = useRouter();

    const setUser = useSetRecoilState(UserState.user)

    useEffect(() => {
        const { data: authListener } = client.auth.onAuthStateChange(
            async (event, session) => {
                switch (event) {
                    case 'MFA_CHALLENGE_VERIFIED':
                    case 'TOKEN_REFRESHED':
                    case 'USER_UPDATED':
                    case 'INITIAL_SESSION':
                    case 'SIGNED_IN':
                        setUser(session?.user ?? null);
                        break;
                    case 'SIGNED_OUT':
                        setUser(null);
                        break;
                }
            }
        );

        return () => {
            authListener?.subscription?.unsubscribe?.();
        };
    }, []);

   
    const refresh = useCallback(async (redirect = "") => {
        const { data: { user } } = await client.auth.getUser()

        setUser(user ?? null);

        if (redirect && !user) {
            router.replace(redirect);
        }

    }, [client])

    return refresh
}

export function useAuthUser() {
    return useRecoilValue(UserState.user);
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