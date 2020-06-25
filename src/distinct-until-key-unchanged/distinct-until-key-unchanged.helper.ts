import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { pairwise, filter, map } from 'rxjs/operators';

export function distinctUntilKeyUnchanged<T, K extends keyof T>(key: K): MonoTypeOperatorFunction<T> {
    return (source$: Observable<T>) => source$
        .pipe(
            pairwise(),
            filter(([prev, next]: [T, T]) => prev[key] === next[key]),
            map(([, next]: [T, T]) => next),
        );
}
