import { useContext } from "react";
import { NotificationContext } from "@/contexts/NotificationContext";
import Notification from "@/components/notification/Notification";

export default function Notifications() {
    const { notification, clear, animationStyles } = useContext(NotificationContext);

    return (
        notification &&
        <div className={'absolute right-0 top-0 pt-3 pr-3 pl-20 pb-20 z-[100] overflow-hidden pointer-events-none'}>
            {
                <Notification
                    notification={notification}
                    style={animationStyles}
                    onRequestClose={() => clear({ fromUser: true })}
                    className={'pointer-events-auto'}
                />
            }
        </div>
    );
}