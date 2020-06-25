import { distinctUntilKeyUnchanged } from './distinct-until-key-unchanged.helper';
import { TestScheduler } from 'rxjs/testing';
// tslint:disable: rxjs-no-internal
import { HotObservable } from 'rxjs/internal/testing/HotObservable';

interface Identifiable {
    id: string;
    name: string;
}

type Hot = HotObservable<Identifiable>;

const sourceData: Record<string, Identifiable> = {
    a: { id: 'AAA', name: 'Konor' },
    b: { id: 'BBB', name: 'John' },
    c: { id: 'CCC', name: 'Lamar' },
    d: { id: 'DDD', name: 'Kanye' },
};

describe('distinctUntilKeyUnchanged operator', () => {
    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    });

    it('should distinguish between values', () => {
        testScheduler.run(({ hot, expectObservable }) => {
            const source$: Hot = hot('-a-a-b-b-|', sourceData);
            const expected =         '---a---b-|';

            expectObservable(source$.pipe(distinctUntilKeyUnchanged('id'))).toBe(expected, sourceData);
        });
    });

    it('should distinguish between values', () => {
        testScheduler.run(({ hot, expectObservable }) => {
            const source$: Hot = hot('-aa|', sourceData);
            const expected =         '--a|';

            expectObservable(source$.pipe(distinctUntilKeyUnchanged('id'))).toBe(expected, sourceData);
        });
    });

    it('should distinguish between values and does not completes', () => {
        testScheduler.run(({ hot, expectObservable }) => {
            const source$: Hot = hot('--a--a--b--b--c--c--', sourceData);
            const expected =         '-----a-----b-----c--';

            expectObservable(source$.pipe(distinctUntilKeyUnchanged('id'))).toBe(expected, sourceData);
        });
    });

    it('should distinguish between values with key', () => {
        testScheduler.run(({ hot, expectObservable }) => {
            const source$: Hot = hot('--a--a--d--c--c--|', sourceData);
            const expected =         '-----a--------c--|';

            expectObservable(source$.pipe(distinctUntilKeyUnchanged('id'))).toBe(expected, sourceData);
        });
    });

    it('should ignore single value', () => {
        testScheduler.run(({ hot, expectObservable }) => {
            const source$: Hot = hot('-a-|', sourceData);
            const expected =         '---|';

            expectObservable(source$.pipe(distinctUntilKeyUnchanged('id'))).toBe(expected, sourceData);
        });
    });

    it('should ignore non repetitive values', () => {
        testScheduler.run(({ hot, expectObservable }) => {
            const source$: Hot = hot('-a-b-|', sourceData);
            const expected =         '-----|';

            expectObservable(source$.pipe(distinctUntilKeyUnchanged('id'))).toBe(expected, sourceData);
        });
    });
});
