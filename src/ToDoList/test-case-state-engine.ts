import { waitFor } from "@testing-library/react";

export interface Transition {
    from?: () => void,
    when: () => void,
    to: () => void
}

export interface StateMachineSpec {
    transitions: Transition[]
}

function buildPath(transition: Transition, transitions: Transition[]): Transition[] {
    if (!transition.from) {
        return [transition];
    }
    const previousTrans = transitions.find((t: Transition) => t.to === transition.from);
    if (previousTrans) {
        return [...buildPath(previousTrans, transitions), transition]
    }
    throw new Error(`Unable to find path: ${transition.from.name}`);
}

function pathStringPartFromTransition({when, to}: Transition): string {
    const prefix = when.name === 'when' ?
        '-->' :
        `-${when.name}->`;
    return `${prefix} ${to.name}`;
}

export function runStateMachine(spec: StateMachineSpec) {
    for(const t of spec.transitions) {
        const path = buildPath(t, spec.transitions);
        const pathString = `<start> ${path.map(pathStringPartFromTransition).join(' ')}`;

        it(pathString, async () => {
            for(const {when, to} of path) {
                when();
                await waitFor(to);
            }
        });
    }
}