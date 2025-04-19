import { useContext } from "react";
import { MessageContext } from "@/contexts/MessageContext";


export default function useMessaging() {
    return useContext(MessageContext);
}
