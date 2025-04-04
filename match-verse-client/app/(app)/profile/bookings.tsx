import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, Animated } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { format, parseISO, isBefore } from 'date-fns';
import { bookingsApi } from '@/services/bookings';
import { getAllCourts, getAllVenues } from '@/services/venue';
import * as Haptics from 'expo-haptics';

const GradientButton = ({ onPress, text, icon, small, disabled = false, loading = false }) => {
    const [pressed, setPressed] = useState(false);

    const handlePress = () => {
        if (!disabled && !loading) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
        }
    };

    return (
        <TouchableOpacity
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            onPress={handlePress}
            activeOpacity={0.7}
            disabled={disabled || loading}
        >
            <Animated.View
                style={{
                    opacity: disabled ? 0.6 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                }}
            >
                <LinearGradient
                    colors={['#10b68d', '#0a8d6d', '#046d64']}
                    className={`flex-row ${small ? 'py-2 px-4' : 'py-3 px-5'} rounded-lg items-center justify-center shadow-md`}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    {loading ? (
                        <ActivityIndicator color="white" size="small" />
                    ) : (
                        <>
                            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-center">
                                {text}
                            </Text>
                            {icon && <View className="ml-1.5">{icon}</View>}
                        </>
                    )}
                </LinearGradient>
            </Animated.View>
        </TouchableOpacity>
    );
};

export default function BookingsPage() {
    const router = useRouter();
    const { state } = useAuth();  // Directly destructure state from useAuth
    const [bookings, setBookings] = useState([]);
    const [courts, setCourts] = useState([]);
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    const [fontsLoaded] = useFonts({
        'Poppins-Bold': require('@/assets/fonts/Poppins-Bold.ttf'),
        'Poppins-Medium': require('@/assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
    });

    useEffect(() => {
        fetchData();

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Use the correct property name - userId, not id
            const userId = state?.user?.userId || 1;
            console.log('Using userId for bookings:', userId, 'User object:', state?.user);

            // Fetch courts and venues data
            const [courtsData, venuesData] = await Promise.all([
                getAllCourts(),
                getAllVenues()
            ]);

            setCourts(courtsData);
            setVenues(venuesData);

            // Fetch bookings for the user
            const response = await bookingsApi.getUserBookings(userId);

            if (response.data && Array.isArray(response.data)) {
                // Sort bookings by date (newest first)
                const sortedBookings = response.data.sort((a, b) => {
                    const dateA = new Date(`${a.date}T${a.startingTime}`);
                    const dateB = new Date(`${b.date}T${b.startingTime}`);
                    return dateB - dateA;
                });

                // Filter to just this user's bookings
                const filteredBookings = sortedBookings.filter(booking =>
                    booking.userId === userId || booking.userId === null
                );

                setBookings(filteredBookings);
            } else {
                setBookings([]);
            }

            setError(null);
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setError('Failed to load your bookings. Please try again later.');
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const getCourtDetails = (courtId) => {
        return courts.find(court => court.courtId === courtId) || { name: `Court ${courtId}` };
    };

    const getVenueDetails = (courtId) => {
        const court = courts.find(court => court.courtId === courtId);
        if (!court) return { venueName: 'Unknown Venue' };

        return venues.find(venue => venue.venueId === court.venueId) || { venueName: 'Unknown Venue' };
    };

    const isBookingPast = (date, startingTime) => {
        const bookingDate = new Date(`${date}T${startingTime}`);
        return isBefore(bookingDate, new Date());
    };

    const frostedGlassStyle = {
        colors: ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.65)'],
        className: "backdrop-blur-md rounded-2xl shadow-lg"
    };

    const renderBookingItem = ({ item }) => {
        const court = getCourtDetails(item.courtId);
        const venue = getVenueDetails(item.courtId);
        const isPast = isBookingPast(item.date, item.startingTime);

        const bookingDate = parseISO(`${item.date}T${item.startingTime}`);
        const formattedDate = format(bookingDate, 'MMMM d, yyyy');
        const formattedTime = format(bookingDate, 'h:mm a');

        return (
            <View className="mb-4 mx-6 overflow-hidden rounded-2xl shadow-lg">
                <LinearGradient
                    colors={isPast ? ['rgba(229,231,235,0.9)', 'rgba(209,213,219,0.65)'] : frostedGlassStyle.colors}
                    className="p-5 backdrop-blur-md"
                >
                    <View className={`${isPast ? 'opacity-60' : ''}`}>
                        <View className="flex-row justify-between items-center mb-3">
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
                                    <Ionicons
                                        name={court.name?.toLowerCase().includes('badminton') ? 'tennisball-outline' : 'football-outline'}
                                        size={22}
                                        color="#10b68d"
                                    />
                                </View>
                                <View>
                                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 18 }} className="text-gray-800">
                                        {court.name || `Court ${item.courtId}`}
                                    </Text>
                                    <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-gray-600">
                                        {venue.venueName || 'Unknown Venue'}
                                    </Text>
                                </View>
                            </View>
                            {isPast && (
                                <View className="bg-gray-200 px-3 py-1 rounded-full">
                                    <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12 }} className="text-gray-600">
                                        Completed
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View className="flex-row justify-between items-center mb-4">
                            <View className="flex-row items-center">
                                <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                                <Text style={{ fontFamily: 'Poppins-Medium', marginLeft: 4 }} className="text-gray-600">
                                    {formattedDate}
                                </Text>
                            </View>
                            <View className="flex-row items-center">
                                <Ionicons name="time-outline" size={16} color="#6B7280" />
                                <Text style={{ fontFamily: 'Poppins-Medium', marginLeft: 4 }} className="text-gray-600">
                                    {formattedTime}
                                </Text>
                            </View>
                        </View>

                        {!isPast && (
                            <View className="flex-row justify-center">
                                <GradientButton
                                    onPress={() => router.push(`/(app)/venues/${venue.venueId}`)}
                                    text="Venue Details"
                                    small
                                />
                            </View>
                        )}
                    </View>
                </LinearGradient>
            </View>
        );
    };

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View className="flex-1">
            <StatusBar style="light" />
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            <LinearGradient
                colors={['#10b68d', '#0a8d6d', '#046d64']}
                style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
            />

            <SafeAreaView className="flex-1">
                <View className="pt-8 px-6 pb-5">
                    <View className="flex-row items-center mb-4">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-4"
                        >
                            <Ionicons name="chevron-back" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 24, lineHeight: 32 }} className="text-white">
                            My Bookings
                        </Text>
                    </View>
                </View>

                <Animated.View
                    style={{
                        flex: 1,
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }}
                >
                    {loading ? (
                        <View className="flex-1 justify-center items-center">
                            <ActivityIndicator size="large" color="white" />
                            <Text style={{ fontFamily: 'Poppins-Medium', marginTop: 12 }} className="text-white">Loading your bookings...</Text>
                        </View>
                    ) : error ? (
                        <View className="flex-1 justify-center items-center p-6">
                            <Ionicons name="alert-circle-outline" size={80} color="white" />
                            <Text style={{ fontFamily: 'Poppins-Medium', marginTop: 12, marginBottom: 24 }} className="text-white text-center text-lg">{error}</Text>
                            <GradientButton
                                onPress={fetchData}
                                text="Try Again"
                            />
                        </View>
                    ) : bookings.length === 0 ? (
                        <View className="flex-1 justify-center items-center p-6">
                            <Ionicons name="calendar-outline" size={80} color="white" />
                            <Text style={{ fontFamily: 'Poppins-Bold', marginTop: 24, marginBottom: 8 }} className="text-white text-center text-xl">No Bookings Found</Text>
                            <Text style={{ fontFamily: 'Poppins-Regular', marginBottom: 24 }} className="text-white text-center opacity-80">
                                You don't have any bookings yet. Start by exploring venues and booking a court!
                            </Text>
                            <GradientButton
                                onPress={() => router.push('/(app)/venues')}
                                text="Explore Venues"
                                icon={<Ionicons name="search" size={20} color="white" />}
                            />
                        </View>
                    ) : (
                        <FlatList
                            data={bookings}
                            renderItem={renderBookingItem}
                            keyExtractor={item => item.bookingId.toString()}
                            contentContainerStyle={{ paddingTop: 4, paddingBottom: 100 }}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}