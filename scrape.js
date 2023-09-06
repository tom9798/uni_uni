const puppeteer = require('puppeteer');

const prompt = require('prompt-sync')();

const funcs_lst = ["","grades", "timeTable", "exams"]

async function main(querry, semIndex = 0, func = "grades") {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // enter uni site and enter username, id and password
    await login(page)
    // await page.screenshot({ path: 'example.png', fullPage: true })
    let schedual = []
    let grades = []
    let timeTable = []
    
    if (querry == "exams"){
        // enter exmams schedule
        schedual = await exams_schedule(page, semIndex, querry)
        await delay(100)
        // await page.screenshot({ path: 'example2.png', fullPage: true })
        return schedual
    }

    if (querry == "sems"){
        // enter sems
        const funcChoice = func
        const sems = await get_sems(page, funcChoice)
        return sems
        // await page.screenshot({ path: 'example3.png', fullPage: true })
    }

    if (querry == "grades"){
        // enter grades
        grades =await  get_grades(page, semIndex)
        return grades
        // await page.screenshot({ path: 'example3.png', fullPage: true })
    }

    if (querry == "timeTable"){
        // enter timeTable
        timeTable = await get_timeTable(page)
        return timeTable
        // await page.screenshot({ path: 'example3.png', fullPage: true })
    }
}


// functions for main:

// login to uni site function
async function login(page) {
    await page.goto('https://www.ims.tau.ac.il/Tal/?err=timeout&mj=1');
    await page.type('input[name=txtUser]', 'tomsoustiel', { delay: 20 })
    await page.type('input[name=txtId]', '206712218', { delay: 20 })
    await page.type('input[name=txtPass]', 'Lego017669541244', { delay: 20 })

    // enter and wait for the magic to happen
    await page.keyboard.press('Enter');
    await page.waitForNavigation();
}

// show exams schedule function
async function exams_schedule(page, semIndex, func) {
    let exams = []
    const index = funcs_lst.indexOf(func)
    const schedual = await page.waitForXPath(`/html/body/table/tbody/tr[2]/td[1]/ul/li[${index}]`)
    await schedual.click();
    await delay(100)

    const iframe1 = await page.$('#jordan')
    const frame1 = await iframe1.contentFrame();


    const options = await frame1.evaluate(() => {
        const options = document.querySelectorAll('#frmgrid > select > option');
        return Array.from(options, option => option.value);
    });
    await frame1.waitForSelector(`select[name=lstSem]`)
    await frame1.select('[name="lstSem"]', options[semIndex])
    await delay(100)


    // const table = await frame1.$('table')
    const result = await frame1.evaluate(() => {
        const rows = document.querySelectorAll('table tr');
        return Array.from(rows, row => {
            const columns = row.querySelectorAll('td');
            return Array.from(columns, column => column.innerText);
        });
    });

    for (i = 0, len = result.length; i < len; i++) {
        if (result[i][2] != null) {
            if (result[i][4].length > 3){
                exams.push({key: result[i][2], value: result[i][4]})
            }   
        }
    }
    return exams
}

// show semester function
async function get_sems(page, func) {
    const index = funcs_lst.indexOf(func)
    const schedual = await page.waitForXPath(`/html/body/table/tbody/tr[2]/td[1]/ul/li[${index}]`)
    await schedual.click();
    await delay(50)
    const iframe1 = await page.$('#jordan')
    const frame1 = await iframe1.contentFrame();
    await delay(100)

    // var frame1 = get_frame(page, func)
    // await delay(1000)

    if (func == "grades"){
        const ishur = await frame1.$('#btnishur')
        await delay(100)
        await ishur.click();
        await frame1.waitForNavigation();
    }

    // function to show all options in the select
    const options = await frame1.evaluate(() => {
        const options = document.querySelectorAll('#frmgrid > select > option');
        return Array.from(options, option => option.innerText);
    });
    return options 
}

// show grades of specific semester function
async function get_grades(page, semIndex) {
    let grades = []
    const schedual = await page.waitForXPath('/html/body/table/tbody/tr[2]/td[1]/ul/li[1]')
    await schedual.click();
    await delay(50)

    const iframe1 = await page.$('#jordan')
    const frame1 = await iframe1.contentFrame();
    await delay(100)
    const ishur = await frame1.$('#btnishur')
    await delay(100)
    await ishur.click();
    await frame1.waitForNavigation();

    const options = await frame1.evaluate(() => {
        const options = document.querySelectorAll('#frmgrid > select > option');
        return Array.from(options, option => option.value);
    });

    await frame1.waitForSelector(`select[name=lstSem]`)
    await frame1.select('[name="lstSem"]', options[semIndex])
    await delay(100)


    const result = await frame1.evaluate(() => {
        const rows = document.querySelectorAll('table tr');
        return Array.from(rows, row => {
            const columns = row.querySelectorAll('td');
            return Array.from(columns, column => column.innerText);
        });
    });

    for (i = 9, len = result.length-3; i < len; i++) {
        grades.push({ key: result[i][2], value: [parseFloat(result[i][5]), parseFloat(result[i][10])]})
    }
    return grades
}

// show time table function
async function get_timeTable(page){
    let timeTable = []
    const schedual = await page.waitForXPath('/html/body/table/tbody/tr[2]/td[1]/ul/li[2]')
    await schedual.click();
    await delay(50)
    const iframe1 = await page.$('#jordan')
    const frame1 = await iframe1.contentFrame();
    await delay(100)

    const result = await frame1.evaluate(() => {
        const rows = document.querySelectorAll('table tr');
        return Array.from(rows, row => {
            const columns = row.querySelectorAll('td');
            return Array.from(columns, column => column.innerText);
        });
    });

    for (i = 1, len = result.length-2; i < len; i++) {
        timeTable.push({ key: result[i][3], value: result[i][9] })
    }
    // console.log(timeTable)
    return timeTable
}



// delay function
function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}




// call the main function

const grades = main("grades")
grades.then(function(result){
    console.log(result)
})

const sems = main("sems", 0, "grades")
sems.then(function(result){
    console.log(result)
})

// const timeTable = main("timeTable")
// timeTable.then(function (result) {
//     console.log(result)
// })

// const exams = main("exams", 6, "exams")
// exams.then(function (result) {
//     console.log(result)
// })