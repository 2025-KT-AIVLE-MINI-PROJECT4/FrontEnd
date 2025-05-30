// react router 설정 파일

import {createBrowserRouter} from "react-router-dom"
import HomePage from "../pages/Home/HomePage";

const setting = [
    {
        path: '/home',
        element: <HomePage /> // home 엘리먼트 수정 필요
    }
];

const router = createBrowserRouter(setting);

export default router;