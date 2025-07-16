import { CreateAccountComponent } from "./components/create-account/create-account.component";
import { LoginComponent } from "./components/login/login.component";

export const authRoutes = [
    {
        children: [
            {
                component: LoginComponent,
                path: 'login',
            },
            {
                component: CreateAccountComponent,
                path: 'register',
            },
        ],
        path: '',
    },
];
