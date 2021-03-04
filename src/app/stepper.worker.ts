/// <reference lib="webworker" />

import { gatesMap } from "./lib/gates";
import { Operation, StepperData, V } from "./lib/v";


addEventListener('message', ({ data }) => {
    // console.log('Starting work: ', data);

    const stepperData: StepperData = data;

    const operations = stepperData.operations;
    stepperData.operations = undefined;
    stepperData.operationsQuantity = operations.length;
    const gates = operations.map((o: Operation) => gatesMap.get(o.gn));
    let lastMessageTime = new Date();

    stepperData.startTime = new Date();
    if (stepperData.qubitsQuantity > 32) {
        console.error(`Stepper worker can not work for such big data: ${stepperData.qubitsQuantity}`);
        return;
    }

    stepperData.progress = 0;
    const state = V.newStateVector(stepperData.qubitsQuantity);
    for (let i = 0; i < operations.length; ++i) {
        stepperData.progress = i / operations.length;
        if (new Date().getTime() - lastMessageTime.getTime() > 300) {
            postMessage(stepperData);
            lastMessageTime = new Date();
        }
        state.state = state.step(gates[i], operations[i].qi);
    }
    stepperData.results = state.calcResults();
    stepperData.progress = 1;
    stepperData.endTime = new Date();

    // console.log('End work: ', data);
    postMessage(stepperData);
});
