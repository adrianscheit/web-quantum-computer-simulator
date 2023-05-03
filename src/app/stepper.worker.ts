/// <reference lib="webworker" />

import { C } from './lib/c';
import { gatesMap } from './lib/gates';
import { Operation, StepperData} from './domain';
import { V } from './lib/v';


addEventListener('message', ({ data }) => {
    // console.log('Starting work: ', data);

    const stepperData: StepperData = data;

    const operations: Operation[] = stepperData.operations!;
    stepperData.operations = undefined;

    stepperData.operationsQuantity = operations.length;
    const gates = operations.map((o: Operation) => gatesMap.get(o.gn));

    stepperData.startTime = new Date();
    if (stepperData.qubitsQuantity > 32) {
        console.error(`Stepper worker can not work for such big data: ${stepperData.qubitsQuantity}`);
        return;
    }
    let lastMessageTime = new Date();
    stepperData.progress = 0;
    postMessage(stepperData);

    const state = new V(V.newSimpleState(stepperData.qubitsQuantity));
    let resultState: C[] = V.newSimpleState(stepperData.qubitsQuantity);
    for (let i = 0; i < operations.length; ++i) {
        stepperData.progress = i / operations.length;
        if (new Date().getTime() - lastMessageTime.getTime() > 300) {
            postMessage(stepperData);
            lastMessageTime = new Date();
        }
        const temp = state.state;
        state.step(gates[i]!, operations[i].qi, resultState);
        state.state = resultState;
        resultState = temp;
    }
    stepperData.results = state.calcResults();
    stepperData.progress = 1;
    stepperData.endTime = new Date();

    // console.log('End work: ', data);
    postMessage(stepperData);
});
