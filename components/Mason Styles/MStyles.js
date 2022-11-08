import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import { COLORS } from '../Colors/ColorScheme'

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export const MStyles = StyleSheet.create({
        option: { 
            height: SCREEN_HEIGHT * 0.05,
            width: SCREEN_WIDTH * 0.75,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            borderColor: COLORS.Paragraph,
            borderWidth: 2,
            color: COLORS.Paragraph,
            marginBottom: 5,
            borderRadius: 10
        },
        header: {
            width: SCREEN_WIDTH * 0.75,
            alignSelf: 'center',
            fontSize: 16,
            color: COLORS.Headline,
        },
        headerContainer: {
            height: SCREEN_HEIGHT * 0.05,
            justifyContent: 'center'
        },
        buttonSolidBackground: {
            height: SCREEN_HEIGHT * 0.05,
            width: SCREEN_WIDTH * 0.75,
            borderRadius: 10,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
            borderWidth: 3,
            backgroundColor: COLORS.Button
        },
        buttonSolidBackgroundText: {
            color: COLORS.Background, 
            fontWeight: '700', 
            fontSize: 16
        },
        buttonTranslucentBackground: {
            height: SCREEN_HEIGHT * 0.05,
            width: SCREEN_WIDTH * 0.75,
            borderRadius: 10,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 5,
            borderWidth: 3,
            borderColor: COLORS.Button
        },
        buttonTranslucentBackgroundText: {
            color: COLORS.Button, 
            fontWeight: '700', 
            fontSize: 16
        },
        pageTitle: {
            height: SCREEN_HEIGHT * 0.05,
            alignSelf: 'center',
            fontSize: 24,
            color: COLORS.Headline
        },
        input: {
            width: SCREEN_WIDTH * 0.75,
            height: SCREEN_HEIGHT * 0.03,
            borderColor: COLORS.Paragraph,
            borderWidth: 2,
            alignSelf: 'center',
            color: COLORS.Paragraph,
            borderRadius: 10,
            paddingLeft: 5
        },
        text: {
            fontSize: 14,
            fontWeight: '700',
            color: COLORS.Paragraph
        },
        pollsContainer: {
            width: SCREEN_WIDTH * 0.30,
            height: SCREEN_HEIGHT * 0.1,
            borderColor: COLORS.Button,
            borderRadius: 10,
            borderWidth: 2,
            marginHorizontal: 5,
            marginBottom: 5,
        },
        smallProfileRender: {
            height: SCREEN_HEIGHT * 0.075,
            width: SCREEN_WIDTH * 0.9,
            borderRadius: 10,
            alignSelf: 'center',
            alignItems: 'center',
            marginTop: 10,
            borderWidth: 2,
            borderColor: COLORS.Button,
            flexDirection: 'row'
        },
        smallProfileRenderText: {
            color: COLORS.Paragraph, 
            fontWeight: '700', 
            fontSize: 16,
            marginLeft: SCREEN_WIDTH * 0.28
        },
        smallProfileRenderImage: {
            resizeMode: 'cover',
            width: SCREEN_HEIGHT * 0.05,
            height: SCREEN_HEIGHT * 0.05,
            borderRadius: (SCREEN_HEIGHT * 0.05)/2,
            marginLeft: SCREEN_WIDTH * 0.05
        }
});