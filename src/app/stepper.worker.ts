/// <reference lib="webworker" />

import { Gates } from "./lib/gates";
import { Operation, StepperData, V } from "./lib/v";


addEventListener('message', ({ data }) => {
    console.log('Starting work: ', data);

    const stepperData: StepperData = data;

    const operations = stepperData.operations;
    stepperData.operations = undefined;
    stepperData.operationsQuantity = operations.length;
    const gates = operations.map((o: Operation) => Gates.gatesMap.get(o.gateName));
    let lastMessageTime = new Date();

    stepperData.startTime = new Date();
    if (stepperData.qubitsQuantity > 32) {
        console.error(`Stepper worker can not work for such big data: ${stepperData.qubitsQuantity}`);
        return;
    }

    stepperData.progress = 0;
    const state = V.newTensorProduct(Array(stepperData.qubitsQuantity).fill(new V()));
    for (let i = 0; i < operations.length; ++i) {
        stepperData.progress = i / operations.length;
        if (new Date().getTime() - lastMessageTime.getTime() > 400) {
            postMessage(stepperData);
            lastMessageTime = new Date();
        }
        state.state = state.step(gates[i], operations[i].qi);
    }
    stepperData.results = state.calcResults();
    stepperData.progress = 1;
    stepperData.endTime = new Date();
    postMessage(stepperData);
});
