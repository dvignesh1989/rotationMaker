"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var xlsx = require("xlsx");
var path = require("path");
// Shuffle array function
function shuffleArray(array) {
    var _a;
    var shuffledArray = __spreadArray([], array, true);
    for (var i = shuffledArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [shuffledArray[j], shuffledArray[i]], shuffledArray[i] = _a[0], shuffledArray[j] = _a[1];
    }
    return shuffledArray;
}
// Function to determine faction group
function determineGroup(faction) {
    if (blueFor.includes(faction)) {
        return 'blueFor';
    }
    else if (redfor.includes(faction)) {
        return 'redFor';
    }
    else if (pac.includes(faction)) {
        return 'pac';
    }
    else if (independant.includes(faction)) {
        return 'independant';
    }
    return '';
}
var blueFor = ["ADF", "BAF", "CAF", "USA", "USMC"];
var independant = ["IMF", "INS", "MEA", "TLF"];
var pac = ["PLA", "PLAAGF", "PLANMC"];
var redfor = ["RGF", "VDV"];
function generateRotationFile(gameTypeParam, factionParam, outputFile, maxLines) {
    return __awaiter(this, void 0, void 0, function () {
        var startTime, resultFolder, workbook, layerSheet, tempLevel_1, layerData, filteredLayers, shuffledLayers, tempLayerName_1, factionSheet, factionData, filteredFactions, shuffledFactions_1, factionGroups_1, rotationContent_1, processedCombinations_1, rotationText, outputFilePath, endTime, elapsedTime;
        return __generator(this, function (_a) {
            try {
                startTime = Date.now();
                resultFolder = path.join(__dirname, 'result');
                if (!fs.existsSync(resultFolder)) {
                    fs.mkdirSync(resultFolder);
                }
                workbook = xlsx.readFile('layers.xlsx');
                layerSheet = workbook.Sheets['Layers'];
                layerData = xlsx.utils.sheet_to_json(layerSheet, { header: 1 })
                    .slice(1) // Exclude header row
                    .filter(function (row) { return row[1] !== undefined; })
                    .map(function (row, index, rows) {
                    if (row[0] !== undefined) {
                        tempLevel_1 = row[0]; // Update tempLevelName if level field is defined
                    }
                    return {
                        level: row[0] ? row[0] : tempLevel_1,
                        id: row[1],
                        layerName: row[2],
                        gameMode: row[3],
                        lighting: row[4],
                        tickets: row[5],
                        commander: row[6],
                        layerSize: row[7],
                    };
                });
                filteredLayers = layerData.filter(function (layer) {
                    var selected = gameTypeParam.some(function (type) {
                        return layer.gameMode.toLowerCase() === type.toLowerCase();
                    });
                    return selected;
                });
                shuffledLayers = shuffleArray(filteredLayers);
                factionSheet = workbook.Sheets['Layer FactionUnit Availability'];
                factionData = xlsx.utils.sheet_to_json(factionSheet, { header: 1 })
                    .slice(4) // Exclude header row
                    .filter(function (row) { return row[2] !== ''; })
                    .filter(function (row) { return row[2] !== undefined; })
                    .map(function (row) {
                    if (row[0] !== undefined) {
                        tempLevel_1 = row[0]; // Update tempLevelName if level field is defined
                    }
                    if (row[1] !== undefined) {
                        tempLayerName_1 = row[1]; // Update tempLayerName if Layer field is defined
                    }
                    return {
                        level: row[0] ? row[0] : tempLevel_1,
                        layerName: row[1] ? row[1] : tempLayerName_1,
                        faction: row[2],
                        unitName: row[4],
                        usableTeams: row[5],
                    };
                });
                filteredFactions = factionData.filter(function (layer) {
                    var selected = factionParam.some(function (type) { return layer.faction.toLowerCase() === type.toLowerCase(); });
                    return selected;
                });
                shuffledFactions_1 = shuffleArray(filteredFactions);
                factionGroups_1 = {
                    blueFor: [],
                    redFor: [],
                    pac: [],
                    independant: [],
                };
                filteredFactions.forEach(function (faction) {
                    var group = determineGroup(faction.faction);
                    if (group) { // Check if group is defined
                        factionGroups_1[group].push(faction);
                    }
                });
                rotationContent_1 = [];
                processedCombinations_1 = new Set();
                // Iterate through shuffled layers
                shuffledLayers.forEach(function (layer) {
                    // Iterate through available factions for this layer
                    shuffledFactions_1
                        .filter(function (each) { return each.layerName === layer.layerName; })
                        .filter(function (each) { return each.usableTeams.includes("Team1"); })
                        .forEach(function (faction1) {
                        // Check if faction1 belongs to blueFor, redFor, pac, or independant
                        var faction1Group = determineGroup(faction1.faction);
                        // Iterate through available factions for this layer again
                        shuffledFactions_1
                            .filter(function (each) { return each.layerName === layer.layerName; })
                            .filter(function (each) { return each.usableTeams.includes("Team2"); })
                            .forEach(function (faction2) {
                            // Check if faction2 belongs to blueFor, redFor, pac, or independant
                            var faction2Group = determineGroup(faction2.faction);
                            var isIndependantMatchupAllowed = (faction1Group === "independant" && faction2Group === "independant" && faction1.faction !== faction2.faction);
                            // Ensure that teams from the same group do not fight against each other
                            if (faction1Group !== faction2Group || isIndependantMatchupAllowed) {
                                // Sort the factions alphabetically
                                var sortedFactions = [faction1.faction, faction2.faction].sort();
                                // Generate a unique key for this combination of factions
                                var key = "".concat(layer.layerName, "|").concat(sortedFactions[0], "|").concat(sortedFactions[1]);
                                // Check if this combination has already been processed
                                if (!processedCombinations_1.has(key)) {
                                    // Append rotation entry for this combination
                                    rotationContent_1.push("".concat(layer.layerName, "|").concat(faction1.faction, "|").concat(faction2.faction));
                                    // Add this combination to the set of processed combinations
                                    processedCombinations_1.add(key);
                                }
                            }
                        });
                    });
                });
                // Shuffle the rotation content array
                rotationContent_1 = shuffleArray(rotationContent_1);
                // Limit the number of lines if maxLines is provided
                if (maxLines && maxLines < rotationContent_1.length) {
                    rotationContent_1 = rotationContent_1.slice(0, maxLines);
                }
                rotationText = rotationContent_1.join('\n');
                outputFilePath = path.join(resultFolder, outputFile);
                fs.writeFileSync(outputFilePath, rotationText);
                endTime = Date.now();
                elapsedTime = (endTime - startTime) / 1000;
                console.log("Time elapsed: ".concat(elapsedTime.toFixed(2), " seconds"));
                console.log("Rotation file generated successfully: ".concat(outputFilePath));
            }
            catch (error) {
                console.error('Error reading local Excel file:', error);
            }
            return [2 /*return*/];
        });
    });
}
// Parse command line arguments
var args = process.argv.slice(2);
console.log('Command line arguments:', args);
if (args.length < 3) {
    console.error('Usage: ts-node rotation_maker.ts "game_type1,game_type2,..." "faction1,faction2,..." <output_file> Optional<->');
    process.exit(1);
}
var gameTypeParam = args[0].split(','); // Parse gameType argument as string array
var factionParam = args[1].split(','); // Parse faction argument as string array
var outputFile = args[2];
var maxLines = Number(args[3]);
if (factionParam.length === 0 || gameTypeParam.length === 0 || !outputFile) {
    console.error('Usage: ts-node rotation_maker.ts "game_type1,game_type2,..." "faction1,faction2,..."  <output_file>');
    process.exit(1);
}
generateRotationFile(gameTypeParam, factionParam, outputFile, maxLines).catch(function (err) {
    console.error('Error generating rotation file:', err);
});
