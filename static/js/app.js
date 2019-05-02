// Function to render table with data given
function renderTable(inputData){
    let tbl = document.getElementsByTagName("tbody")[0];
    if (!tbl){
        let table = d3.select("#ufo-table");
        table.append("tbody");
    }
    let tbody = d3.select("tbody");

    inputData.forEach(
        (ufoReport) => {
            const row = tbody.append("tr");
            for (key in ufoReport){
                const cell = tbody.append("td");
                cell.text(ufoReport[key]);
            }
        }
    );
    // console.log("Table rendered!");
}

// Function to delete the existing table
function delTable(){
    let tbl = document.getElementsByTagName("tbody")[0];
    // console.log(tbl);

    if (tbl) {
        tbl.parentNode.removeChild(tbl);
    }
    // console.log("Table removed!")
}

// Generate distinct datasets
function genDistinct(data, key){
    let attrData = data.map(
        e => e[key]
    );
    const distinctData = [... new Set(attrData)];
    return distinctData;
}

const distinctCities = genDistinct(data, "city");
const distinctStates = genDistinct(data, "state");
const distinctCountries = genDistinct(data, "country");
const distinctShapes = genDistinct(data, "shape");

const dataArray = [
    distinctCountries,
    distinctStates,
    distinctCities,
    distinctShapes
];

// Create dropdown manus
let filters = d3.select("#filters");

const keyArray = [
        "country",
        "state",
        "city",
        "shape"
];

for (index in dataArray){
    arrayToUse = dataArray[index];

    let li = filters.append("li");
    li.attr("class", "filter list-group-item");

    let label = li.append("label");
    label.text("Select a " + keyArray[index]);
    // label.attr("style", "margin-left: 10px;");

    let dropDown = li.append("select");
    // Add id attribute
    dropDown.attr("id", keyArray[index]);

    let option = dropDown.append("option");
    option.text("-- No " + keyArray[index] + " filter --");

    for (key in arrayToUse){
        let option = dropDown.append("option");
        option.text(arrayToUse[key]);
    }
}

// Render table when load the page the first time
renderTable(data);

// Logic of the filters
// Select the submit button
const submit = d3.select("#filter-btn");

submit.on("click",
    function(){
        // Prevent the page from refreshing
        d3.event.preventDefault();

        let filteredData = data;

        // Datetime filter
        // Select the input element and get the raw HTML node
        let inputElement = d3.select("#datetime");
        // Get the value property of the input element
        let inputValue = String(inputElement.property("value"));
        // console.log(inputValue);

        if (inputValue !== ""){
            // Use Regex
            let reg = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
            if (reg.test(inputValue)){
                let dateArray = inputValue.split("/");
                let month = dateArray[0];
                let day = dateArray[1];
                let year = dateArray[2];

                if (month.length == 2){
                    month = month[1];
                }
                if (day.length == 2){
                    day = day[1];
                }
                let normalizedDate = month + "/" + day + "/" + year;

                filteredData = filteredData.filter(report => report.datetime === normalizedDate);
                console.log(filteredData);

            }
            else {
                alert("Please input a correct date format: mm/dd/year or m/d/year! m, d and year should be integers!");
                inputElement.property("value", "");
            }
        }

        // 4 dropdown filters
        for (key in keyArray){
            let sel = document.getElementById(keyArray[key]);
            let optionValue = sel.options[sel.selectedIndex].value;
            if (optionValue !== "-- No " + keyArray[key] + " filter --"){
                filteredData = filteredData.filter(report => report[keyArray[key]] === optionValue);
                console.log(filteredData);
            }
        }
        // Delete and re-render the table
        delTable();
        renderTable(filteredData);
        if (filteredData.length < 1){
            confirm("No data found!");
        }
    }
);

// Button to clear all of the filters
const clear = d3.select("#clear-btn");

clear.on("click",
    function(){
        // Prevent the page from refreshing
        d3.event.preventDefault();

        let filteredData = data;

        delTable();
        renderTable(filteredData);

        for (key in keyArray){
            document.getElementById(keyArray[key]).selectedIndex = "0";
        }

        let inputElement = d3.select("#datetime");
        inputElement.property("value", "");
    }
);
