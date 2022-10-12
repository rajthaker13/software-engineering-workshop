import { StyleSheet, Text, View } from 'react-native';

export default function ActivityScreen() {
    return (
        <View style={styles.container}>
            <Text>Activity Screen - Kyle</Text>
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
