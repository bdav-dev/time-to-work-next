'use server';

import { Theme, THEME_COOKIE } from "@/library/theme";
import { cookies } from "next/headers";


export async function persistTheme(theme: Theme) {
    (await cookies()).set(
        THEME_COOKIE,
        theme,
        {
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
            sameSite: 'lax'
        }
    );
}
