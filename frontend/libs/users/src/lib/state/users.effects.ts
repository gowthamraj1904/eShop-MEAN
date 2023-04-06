import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';

import * as UsersActions from './users.actions';

import { concatMap, of, map, catchError } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';
import { UsersService } from '../services/users.service';

@Injectable()
export class UsersEffects {
    private actions$ = inject(Actions);
    private localStorageService = inject(LocalStorageService);
    private usersService = inject(UsersService);

    buildUserSession$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UsersActions.buildUserSession),
            concatMap(() => {
                if (this.localStorageService.isValidToken()) {
                    const userId =
                        this.localStorageService.getUserIdFromToken();
                    if (userId) {
                        return this.usersService.getUserById(userId).pipe(
                            map((user) => {
                                return UsersActions.buildUserSessionSuccess({
                                    user
                                });
                            }),
                            catchError(() => {
                                return of(
                                    UsersActions.buildUserSessionFailure()
                                );
                            })
                        );
                    } else {
                        return of(UsersActions.buildUserSessionFailure());
                    }
                } else {
                    return of(UsersActions.buildUserSessionFailure());
                }
            })
        )
    );
}
