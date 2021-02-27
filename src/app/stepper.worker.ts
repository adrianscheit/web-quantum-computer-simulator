/// <reference lib="webworker" />

import { Gates } from "./lib/gates";
import { StepperData, V } from "./lib/v";


addEventListener('message', ({ data }) => {
    console.log('Starting work', data);

    const stepperData: StepperData = data;

    const operations = stepperData.operations;
    operations.forEach(o => o.gate = Gates.gatesMap.get(o.gateName));
    stepperData.operations = undefined;

    const initQubits = stepperData.initQubits;
    stepperData.initQubits = undefined;

    stepperData.startTime = new Date();
    stepperData.qubitsQuantity = initQubits.map(v => v.qubits).reduce((p, c) => p + c, 0);
    postMessage(stepperData);
    if (stepperData.qubitsQuantity > 32) {
        console.error(`Stepper worker can not work for so big data: ${stepperData.qubitsQuantity}`);
        return;
    }

    stepperData.progress = 0;
    const state = V.newTensorProduct(initQubits);
    for (let i = 0; i < operations.length; ++i) {
        stepperData.progress = i / operations.length;
        postMessage(stepperData);
        console.log(state.step(operations[i].gate, operations[i].qi));
    }
    stepperData.results = state.calcResults();
    stepperData.progress = 1;
    stepperData.endTime = new Date();
    postMessage(stepperData);
});
