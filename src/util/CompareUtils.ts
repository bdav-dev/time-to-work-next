type Comparison = 'equal' | 'lessThan' | 'lessOrEqualThan' | 'greaterThan' | 'greaterOrEqualThan';

type HasCompareTo<T> = { compareTo: (other: T) => number };

export function compare<T extends HasCompareTo<T>>(first: T, comparison: Comparison, second: T): boolean {
    const result = first.compareTo(second);

    switch (comparison) {
        case 'equal':
            return result == 0;
        case 'lessThan':
            return result < 0;
        case 'lessOrEqualThan':
            return result <= 0;
        case 'greaterThan':
            return result > 0;
        case 'greaterOrEqualThan':
            return result >= 0;
    }
}
