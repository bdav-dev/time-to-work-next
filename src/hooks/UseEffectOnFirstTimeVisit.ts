import { useEffect } from "react";

const KEY = "ttw-n.isFirstTimeVisit";

export default function useEffectOnFirstTimeVisit(action: () => void) {
    useEffect(() => {
        const value = window.localStorage.getItem(KEY);
        if (!value) {
            action();
            window.localStorage.setItem(KEY, "false");
        }
    }, []);
}
