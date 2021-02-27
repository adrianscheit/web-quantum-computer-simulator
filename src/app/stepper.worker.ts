/// <reference lib="webworker" />

import { Result, StepperData, V } from "./lib/v";


addEventListener('message', ({ data }) => {
    const stepperData: StepperData = data;
    stepperData.startTime = new Date();
    stepperData.qubitsQuantity = stepperData.initQubits.map(v => v.qubits).reduce((p, c) => p + c, 0)
    if (stepperData.qubitsQuantity > 32) {
        console.error(`Stepper worker can not work for so big data: ${stepperData.qubitsQuantity}`);
        return;
    }

    stepperData.progress = 0;
    const state = V.newTensorProduct(stepperData.initQubits);
    for (let i = 0; i < stepperData.operations.length; ++i) {
        stepperData.progress = i / stepperData.operations.length;
        console.log(state.step(stepperData.operations[i]));
    }
    stepperData.results = state.calcResults();
    stepperData.progress = 1;
    stepperData.endTime = new Date();
});
