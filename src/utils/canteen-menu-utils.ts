import { fetch, FetchResultTypes } from '@sapphire/fetch';
import dayjs from 'dayjs';

const MENU_API_URL = 'http://student-api.ddns.net:3001/menus';

export const queryCanteenMenu = async (): Promise<MenusAPIResponse> =>
    fetch<MenusAPIResponse>(MENU_API_URL, FetchResultTypes.JSON);

export const queryCanteenMenuOfTheDay = async (): Promise<RawMenu> =>
    queryCanteenMenu().then(
        (res) =>
            res[
                dayjs()
                    .locale('en')
                    .format('dddd')
                    .toLowerCase() as keyof MenusAPIResponse
            ],
    );

export interface RawMenu {
    tradition: string[];
    vegetarien: string[];
}

export interface MenusAPIResponse {
    monday: RawMenu;
    tuesday: RawMenu;
    wednesday: RawMenu;
    thursday: RawMenu;
    friday: RawMenu;
}
