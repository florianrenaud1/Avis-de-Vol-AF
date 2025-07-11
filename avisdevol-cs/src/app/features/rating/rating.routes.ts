import { RatingListComponent } from './components/rating-list/rating-list.component';
import { RatingCreateComponent } from './components/rating-create/rating-create.component';
import { RatingDetailComponent } from './components/rating-detail/rating-detail.component';

export const ratingsRoutes = [
    {
        children: [
            {
                component: RatingListComponent,
                path: '',
            },
            {
                component: RatingCreateComponent,
                path: 'create',
            },
            {
                component: RatingDetailComponent,
                path: ':id',
            },
        ],
        path: '',
    },
];
