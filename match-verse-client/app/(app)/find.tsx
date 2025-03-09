// app/(app)/find.tsx
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FindScreen() {
    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <View className="flex-1 justify-center items-center p-5">
                <Text className="text-white text-2xl font-bold mb-4">Find a Match</Text>
                <Text className="text-[#aaa] text-center">This screen is under development</Text>
            </View>
        </SafeAreaView>
    );
}