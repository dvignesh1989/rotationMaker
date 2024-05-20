
const { workerData, parentPort } = require('worker_threads');

const { layer, shuffledFactions, determineGroup, processedCombinations, rotationContent } = workerData;

for (const faction1 of shuffledFactions) {
    const faction1Group = determineGroup(faction1.faction);
    for (const faction2 of shuffledFactions) {
        const faction2Group = determineGroup(faction2.faction);
        if (faction1Group !== faction2Group || (faction1Group === "independant" && faction1.faction !== faction2.faction)) {
            const sortedFactions = [faction1.faction, faction2.faction].sort();
            const key = `${layer.layerName}|${sortedFactions[0]}|${sortedFactions[1]}`;
            if (!processedCombinations.has(key)) {
                rotationContent.push(`${layer.layerName}|${faction1.faction}|${faction2.faction}`);
                processedCombinations.add(key);
            }
        }
    }
}

parentPort.postMessage('done');