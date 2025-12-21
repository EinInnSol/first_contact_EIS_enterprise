"use client";

import { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import {
    getFirestore,
    collection,
    query,
    orderBy,
    limit,
    onSnapshot,
    where
} from 'firebase/firestore';

// Firebase config should come from env
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export function useFirestoreRecommendations(organizationId: string) {
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!organizationId) return;

        const q = query(
            collection(db, "organizations", organizationId, "recommendations"),
            orderBy("created_at", "desc"),
            limit(10)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRecommendations(items);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [organizationId]);

    return { recommendations, loading };
}

export function useFirestoreEvents(organizationId: string) {
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        if (!organizationId) return;

        const q = query(
            collection(db, "organizations", organizationId, "events"),
            orderBy("timestamp", "desc"),
            limit(5)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEvents(items);
        });

        return () => unsubscribe();
    }, [organizationId]);

    return { events };
}
