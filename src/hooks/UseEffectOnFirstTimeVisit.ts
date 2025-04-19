import { useEffect } from "react";
import LocalStorage from "@/storage/LocalStorage";

const KEY = "ttw-n.isFirstTimeVisit";

export default function useEffectOnFirstTimeVisit(action: () => void) {
    useEffect(() => {
        const value = LocalStorage.get(KEY);
        if (!value) {
            action();
            LocalStorage.set(KEY, "false");
        }
    }, []);
}
