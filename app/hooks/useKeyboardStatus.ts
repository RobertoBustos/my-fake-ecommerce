import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

const useKeyboardStatus = () => {
    const [keyboardStatus, setKeyboardStatus] = useState<string>('hidden');

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardStatus('shown');
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardStatus('hidden');
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    return { keyboardStatus }
}

export default useKeyboardStatus