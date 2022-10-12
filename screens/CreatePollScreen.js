import { StyleSheet, Text, View } from 'react-native';

export default function CreatePollScreen() {
    return (
        <View style={styles.container}>
            <Text>Create Poll Screen - Team</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
