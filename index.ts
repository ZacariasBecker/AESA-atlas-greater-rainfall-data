import { IData } from "./i-data";
var fs = require("fs");
const xlsx = require('xlsx');

const moreThenTwentyFiveYears = async (data: IData[]) => {
    let cities: string[] = [];
    let yearCity: string[] = [];

    for await (const register of data) {
        if (!cities.includes(register["Município/Posto"])) {
            cities.push(register["Município/Posto"]);
        }
        if (!yearCity.includes(`${register.Ano} - ${register["Município/Posto"]}`)) {
            yearCity.push(`${register.Ano} - ${register["Município/Posto"]}`);
        }
    }

    let removedYear: string[] = [];
    for await (const register of yearCity) {
        removedYear.push(register.split(' - ')[1]);
    }

    let countCities: [string, number][] = [];

    for await (const cityName of cities) {
        let count = 0;

        for (const cityRepeated of removedYear) {
            if (cityName === cityRepeated) {
                count += 1;
            }
        }
        countCities.push([cityName, count]);
    }

    let focusCities = countCities.filter(city => city[1] >= 25).map(city => city[0]);
    data = data.filter(data => focusCities.includes(data["Município/Posto"]));

    return data;
};

const compiledDaysAndRainFall = async (data: IData): Promise<[string, number][]> => {
    return [
        ["dia 1", parseFloat(data["dia 1"].replace(',', '.'))],
        ["dia 2", parseFloat(data["dia 2"].replace(',', '.'))],
        ["dia 3", parseFloat(data["dia 3"].replace(',', '.'))],
        ["dia 4", parseFloat(data["dia 4"].replace(',', '.'))],
        ["dia 5", parseFloat(data["dia 5"].replace(',', '.'))],
        ["dia 6", parseFloat(data["dia 6"].replace(',', '.'))],
        ["dia 7", parseFloat(data["dia 7"].replace(',', '.'))],
        ["dia 8", parseFloat(data["dia 8"].replace(',', '.'))],
        ["dia 9", parseFloat(data["dia 9"].replace(',', '.'))],
        ["dia 10", parseFloat(data["dia 10"].replace(',', '.'))],
        ["dia 11", parseFloat(data["dia 11"].replace(',', '.'))],
        ["dia 12", parseFloat(data["dia 12"].replace(',', '.'))],
        ["dia 13", parseFloat(data["dia 13"].replace(',', '.'))],
        ["dia 14", parseFloat(data["dia 14"].replace(',', '.'))],
        ["dia 15", parseFloat(data["dia 15"].replace(',', '.'))],
        ["dia 16", parseFloat(data["dia 16"].replace(',', '.'))],
        ["dia 17", parseFloat(data["dia 17"].replace(',', '.'))],
        ["dia 18", parseFloat(data["dia 18"].replace(',', '.'))],
        ["dia 19", parseFloat(data["dia 19"].replace(',', '.'))],
        ["dia 20", parseFloat(data["dia 20"].replace(',', '.'))],
        ["dia 21", parseFloat(data["dia 21"].replace(',', '.'))],
        ["dia 22", parseFloat(data["dia 22"].replace(',', '.'))],
        ["dia 23", parseFloat(data["dia 23"].replace(',', '.'))],
        ["dia 24", parseFloat(data["dia 24"].replace(',', '.'))],
        ["dia 25", parseFloat(data["dia 25"].replace(',', '.'))],
        ["dia 26", parseFloat(data["dia 26"].replace(',', '.'))],
        ["dia 27", parseFloat(data["dia 27"].replace(',', '.'))],
        ["dia 28", parseFloat(data["dia 28"].replace(',', '.'))],
        ["dia 29", parseFloat(data["dia 29"].replace(',', '.'))],
        ["dia 30", parseFloat(data["dia 30"].replace(',', '.'))],
        ["dia 31", parseFloat(data["dia 31"].replace(',', '.'))],
    ];
};

const findGreaterRainfallFromIData = async (data: IData): Promise<string> => {
    let rainfallData: [string, number][] = await compiledDaysAndRainFall(data);
    let greater: [string, number] = rainfallData[0];
    for await (const rainfall of rainfallData) {
        if (rainfall[1] > greater[1]) {
            greater = rainfall;
        }
    };

    return `${data["Município/Posto"]} - ${greater[0]}/${data.Mês}/${data.Ano} - Maior chuva: ${greater[1]}`;
};

const groupeCities = async (data: string[]) => {
    let cities: string[] = [];

    for await (const register of data) {
        if (!cities.includes(register.split(' - ')[0])) {
            cities.push(register.split(' - ')[0]);
        }
    }

    let greaterListByCities: [string, string, number][][] = [];
    for (const city of cities) {
        greaterListByCities.push(data.filter(register => register.split(' - ')[0] === city).map(e => [e.split(' - ')[0], e.split(' - ')[1].split('dia ')[1], parseFloat(e.split(' - ')[2].split(': ')[1])]));
    }

    return greaterListByCities;
};

const findGreaterByGroupedCities = async (data: [string, string, number][]) => {

    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    let groupedByMonth: [string, string, number][][] = [];

    for await (const month of months) {
        let monthGroup: [string, string, number][] = [];
        for await (const register of data) {
            if (parseInt(register[1].split('/')[1]) === month) {
                monthGroup.push(register);
            }
        }
        groupedByMonth.push(monthGroup);
    }

    let greaters: [string, string, number][] = [];
    for await (const month of groupedByMonth) {
        let greater = month[0];
        for await (const register of month) {
            if (register[2] > greater[2]) {
                greater = register;
            }
        }
        greaters.push(greater);
    }

    return greaters;
};

const parseToJSON = async (data: [string, string, number][][]) => {
    let jsonList: object[] = [];

    for await (const register of data) {
        jsonList.push(
            {
                "Posto": register[0][0],
                "Janeiro": register[0][1] + ' - ' + ((register[0][2]).toString().includes('.') ? (register[0][2]).toString() : (register[0][2]).toString() + '.0'),
                "Fevereiro": register[1][1] + ' - ' + ((register[1][2]).toString().includes('.') ? (register[1][2]).toString() : (register[1][2]).toString() + '.0'),
                "Março": register[2][1] + ' - ' + ((register[2][2]).toString().includes('.') ? (register[2][2]).toString() : (register[2][2]).toString() + '.0'),
                "Abril": register[3][1] + ' - ' + ((register[3][2]).toString().includes('.') ? (register[3][2]).toString() : (register[3][2]).toString() + '.0'),
                "Maio": register[4][1] + ' - ' + ((register[4][2]).toString().includes('.') ? (register[4][2]).toString() : (register[4][2]).toString() + '.0'),
                "Junho": register[5][1] + ' - ' + ((register[5][2]).toString().includes('.') ? (register[5][2]).toString() : (register[5][2]).toString() + '.0'),
                "Julho": register[6][1] + ' - ' + ((register[6][2]).toString().includes('.') ? (register[6][2]).toString() : (register[6][2]).toString() + '.0'),
                "Agosto": register[7][1] + ' - ' + ((register[7][2]).toString().includes('.') ? (register[7][2]).toString() : (register[7][2]).toString() + '.0'),
                "Setembro": register[8][1] + ' - ' + ((register[8][2]).toString().includes('.') ? (register[8][2]).toString() : (register[8][2]).toString() + '.0'),
                "Outubro": register[9][1] + ' - ' + ((register[9][2]).toString().includes('.') ? (register[9][2]).toString() : (register[9][2]).toString() + '.0'),
                "Novembro": register[10][1] + ' - ' + ((register[10][2]).toString().includes('.') ? (register[10][2]).toString() : (register[10][2]).toString() + '.0'),
                "Dezembro": register[11][1] + ' - ' + ((register[11][2]).toString().includes('.') ? (register[11][2]).toString() : (register[11][2]).toString() + '.0'),
            }
        );
    }

    return jsonList;
};

const convertToXlsx = async (jsonData: object[], outputFilePath: string) => {
    const workbook = await xlsx.utils.book_new();
    const sheet = await xlsx.utils.json_to_sheet(jsonData);
    await xlsx.utils.book_append_sheet(workbook, sheet, 'Sheet 1');
    await xlsx.writeFile(workbook, outputFilePath);

    console.log(`Conversion from JSON to XLSX successful!`);
};

(async function () {
    const rawData: IData[] = await require("./data.json");
    const data = await moreThenTwentyFiveYears(rawData);

    let greaterData: string[] = [];
    for await (const register of data) {
        greaterData.push(await findGreaterRainfallFromIData(register));
    }

    const groupedCities = await groupeCities(greaterData);

    let greaters: [string, string, number][][] = [];
    for await (const city of groupedCities) {
        greaters.push(await findGreaterByGroupedCities(city));
    }

    const jsonList: object[] = await parseToJSON(greaters);

    await convertToXlsx(jsonList, 'maioresChuvasHistoricas.xlsx');

})();
