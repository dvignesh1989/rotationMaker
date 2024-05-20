import * as fs from 'fs';
import * as xlsx from 'xlsx';
import * as path from 'path';

// Shuffle array function
function shuffleArray<T>(array: T[]): T[] {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

// Function to determine faction group
function determineGroup(faction: string): string {
    if (blueFor.includes(faction)) {
        return 'blueFor';
    } else if (redfor.includes(faction)) {
        return 'redFor';
    } else if (pac.includes(faction)) {
        return 'pac';
    } else if (independant.includes(faction)) {
        return 'independant';
    }
    return '';
}

interface LayerInfo {
    level: string;
    id: string;
    layerName: string;
    gameMode: string;
    lighting: string;
    tickets: string;
    layerSize: string;
}

interface FactionAvailability {
    level: string;
    layerName: string;
    faction: string;
    unitName: string;
    usableTeams: string;
}

const blueFor = ["ADF", "BAF", "CAF", "USA", "USMC"];
const independant = ["IMF", "INS", "MEA", "TLF"];
const pac = ["PLA", "PLAAGF", "PLANMC"];
const redfor = ["RGF", "VDV"];

async function generateRotationFile(gameTypeParam: string[], factionParam: string[], outputFile: string, maxLines?: number): Promise<void> {
    try {
        const startTime = Date.now(); // Record start time

        // Ensure the "result" folder exists
        const resultFolder = path.join(__dirname, 'result');
        if (!fs.existsSync(resultFolder)) {
            fs.mkdirSync(resultFolder);
        }

        // Load Excel file
        const workbook = xlsx.readFile('layers.xlsx'); // Updated file path to 'test.xlsx'

        // Parse 'Layer' sheet
        const layerSheet = workbook.Sheets['Layers'];

        let tempLevel: string;

        const layerData: LayerInfo[] = xlsx.utils.sheet_to_json(layerSheet, { header: 1 })
            .slice(1) // Exclude header row
            .filter(row => row[1] !== undefined)
            .map((row, index, rows) => {
                if (row[0] !== undefined) {
                    tempLevel = row[0]; // Update tempLevelName if level field is defined
                }
                return {
                    level: row[0] ? row[0] : tempLevel,
                    id: row[1],
                    layerName: row[2],
                    gameMode: row[3],
                    lighting: row[4],
                    tickets: row[5],
                    commander: row[6],
                    layerSize: row[7],
                };
            });

        // Filter layers based on gameType
        const filteredLayers = layerData.filter(layer => {
            const selected = gameTypeParam.some(type => {
                return layer.gameMode.toLowerCase() === type.toLowerCase();
            });
            return selected;
        });

        // Shuffle the filtered layers array to randomize layer order
        const shuffledLayers = shuffleArray(filteredLayers);

        let tempLayerName: string;

        // Parse 'Layer FactionUnit Availability' sheet
        const factionSheet = workbook.Sheets['Layer FactionUnit Availability'];
        const factionData: FactionAvailability[] = xlsx.utils.sheet_to_json(factionSheet, { header: 1 })
            .slice(4) // Exclude header row
            .filter(row => row[2] !== '')
            .filter(row => row[2] !== undefined)
            .map(row => {
                if (row[0] !== undefined) {
                    tempLevel = row[0]; // Update tempLevelName if level field is defined
                }
                if(row[1] !== undefined) {
                    tempLayerName = row[1]; // Update tempLayerName if Layer field is defined
                }
                return {
                    level: row[0] ? row[0] : tempLevel,
                    layerName: row[1] ? row[1] : tempLayerName,
                    faction: row[2],
                    unitName: row[4],
                    usableTeams: row[5],
                };
            });

        // Filter factions based on filtered layers
        const filteredFactions = factionData.filter(layer => {
            const selected = factionParam.some(type => layer.faction.toLowerCase() === type.toLowerCase());
            return selected;
        });

        // Shuffle the factions array to randomize faction positions
        const shuffledFactions = shuffleArray(filteredFactions);

        // Group factions by their respective groups
        const factionGroups: { [group: string]: FactionAvailability[] } = {
            blueFor: [],
            redFor: [],
            pac: [],
            independant: [],
        };

        filteredFactions.forEach(faction => {
            const group = determineGroup(faction.faction);
            if (group) { // Check if group is defined
                factionGroups[group].push(faction);
            }
        });

        // Generate the rotation file content
        let rotationContent: string[] = [];
        // Create a set to keep track of processed combinations of factions for all layers
        const processedCombinations = new Set<string>();

        // Iterate through shuffled layers
        filteredLayers.forEach(layer => {
            // Iterate through available factions for this layer
            filteredFactions
                .filter(each => each.layerName === layer.layerName)
                .filter(each => each.usableTeams.includes("Team1"))
                .forEach (faction1 => {
                // Check if faction1 belongs to blueFor, redFor, pac, or independant
                const faction1Group = determineGroup(faction1.faction);

                // Iterate through available factions for this layer again
                filteredFactions
                    .filter(each => each.layerName === layer.layerName)
                    .filter(each => each.usableTeams.includes("Team2"))
                    .forEach(faction2 => {
                    // Check if faction2 belongs to blueFor, redFor, pac, or independant
                    const faction2Group = determineGroup(faction2.faction);

                    const isIndependantMatchupAllowed = (faction1Group === "independant" && faction2Group === "independant" &&  faction1.faction !== faction2.faction);
                                       
                    // Ensure that teams from the same group do not fight against each other
                    if (faction1Group !== faction2Group || isIndependantMatchupAllowed) {
                        
                        // Sort the factions alphabetically
                        const sortedFactions = [faction1.faction, faction2.faction].sort();

                        // Generate a unique key for this combination of factions
                        const key = `${layer.layerName}|${sortedFactions[0]}|${sortedFactions[1]}`;

                        // Check if this combination has already been processed
                        if (!processedCombinations.has(key)) {
                            // Append rotation entry for this combination
                            rotationContent.push(`${layer.layerName}|${faction1.faction}|${faction2.faction}`);

                            // Add this combination to the set of processed combinations
                            processedCombinations.add(key);
                        }
                    }
                });
            });
        });

        // Shuffle the rotation content array
        //rotationContent = shuffleArray(rotationContent);

        // Limit the number of lines if maxLines is provided
        if (maxLines && maxLines < rotationContent.length) {
            rotationContent = rotationContent.slice(0, maxLines);
        }

        // Convert the rotation content array back to a string
        const rotationText = rotationContent.join('\n');

        // Write to output file
        const outputFilePath = path.join(resultFolder, outputFile);
        fs.writeFileSync(outputFilePath, rotationText);

        const endTime = Date.now(); // Record end time
        const elapsedTime = (endTime - startTime) / 1000; // Calculate elapsed time in seconds

        console.log(`Time elapsed: ${elapsedTime.toFixed(2)} seconds`);
        console.log(`Rotation file generated successfully: ${outputFilePath}`);
    } catch (error) {
        console.error('Error reading local Excel file:', error);
    }
}

// Parse command line arguments
const args: string[] = process.argv.slice(2);

console.log('Command line arguments:', args);

if (args.length < 3) {
    console.error('Usage: ts-node rotation_maker.ts "game_type1,game_type2,..." "faction1,faction2,..." <output_file> Optional<->');
    process.exit(1);
}

const gameTypeParam: string[] = args[0].split(','); // Parse gameType argument as string array
const factionParam: string[] = args[1].split(','); // Parse faction argument as string array
const outputFile: string = args[2];
const maxLines: number = Number(args[3]);

if (factionParam.length === 0 || gameTypeParam.length === 0 || !outputFile) {
    console.error('Usage: ts-node rotation_maker.ts "game_type1,game_type2,..." "faction1,faction2,..."  <output_file>');
    process.exit(1);
}

generateRotationFile(gameTypeParam, factionParam, outputFile, maxLines).catch(err => {
    console.error('Error generating rotation file:', err);
});
