# Layer Generator

Generate Squad game playable layers by parsing OWI provided Googlesheets. 

## Description

This simple Javascript is set to run on a node environment taking in whitelist Arugments of allowed playmodes and whitelist allowed factions to generate all possible combinations of layers possible.

## Getting Started

### Dependencies

* Node env
* Either local xslx sheet or online GoogleSpreadsheets
* 1 million node modules

### Installing

* npm install or yarn install

### Executing program

* The program is executed inside of a terminal/console by navigating to the project folder and executing the following commands

* Generate/Compile the js file from the ts file: 
```
tsc .\rotation.ts
```

* Execute the generated js file with two whitelist commands
    * Gamemodes whitelisting (All possible gamemodes: AAS, RAAS, Invasion, Seed, Skirmish, Insurgency, TerritoryControl, Destruction)
    * Factions whitelist 
        * Bluefor       : ADF, BAF, CAF, USA, USMC
        * Independant   : IMF, INS, MEA, TLF
        * PAC           : PLA, PLAAGF, PLANMC
        * Redfor        : RGF, VDV
    * Filename (File gets generated into result folder)
    * LimitBy (Optional: Limits total output by the number specified. or else outputs all) 
```
node .\rotation.ts [gamemodes] [factions] fileName.cfg [Optional: Limit]
```

* Once the commandline call completes, it will generate the file directly under the result folder. Example call for would look like 

```
node .\rotation.js "AAS, RAAS, Invasion" "USA,ADF,USMC,BAF,CAF,INS,IMF,MEA,TLF,RGF,VDV,PLA,PLANMC,PLAAGF" all.cfg 10
```

* An Independant only example would look like

```
node .\rotation.js "AAS,RAAS,Invasion" "INS,IMF,TLF,MEA" independant.cfg 25
```

* Blue vs Red

```
node .\rotation.js "AAS, RAAS, Invasion" "USA,ADF,USMC,BAF,CAF,RGF,VDV" redblue.cfg 12
```

## Help

If OWI decided to change the excel sheets, Problems may arise with matching sheet names to retrieve those table values as csv. Might have to just change name of the sheets in that case. 

eg. if somehow layers is all small letters, do the same change in code. 
```
const layerSheet = workbook.Sheets['Layers'];
```

If the columns are renamed and moved around, a hardcoded column parsing approach is utilized, which is to be readjusted based on the changes. 

eg.  Here the columns can be rearranged or a new one could be introduced with array indices. 
```
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
```


## Authors

Contributors names and contact info

Vickzzzzz @ https://discord.gg/RhcSxTt6
