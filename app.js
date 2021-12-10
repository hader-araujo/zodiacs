const axios = require('axios')

const defaultParam = {
    "_ApplicationId": "CtQ62LvQpO7aQ5YXWUp3AfzPkQAU8PASxvUhfl2S",
    "_SessionToken": para definir
}


carList = []
carIndex = 0
raceIndex = 0



function getUserData() {

    axios.post("https://8za04rmw3eb0.grandmoralis.com:2053/server/functions/user_getData", defaultParam)
        .then(
            r => {
                carList = r["data"]["result"]["userCars"].map(it => it["objectId"])
                carRun()
            },
            error => {
                console.log("errorerrorerrorerror");
                console.log(error);

            }
        )
}


function carRun() {
    if (carIndex >= carList.length - 1) {
        console.log("Fim.");
        return
    }

    raceIndex++

    const userCarId = carList[carIndex]

    console.log(`Carro id ${carIndex + 1} - ${userCarId} iniciado - corrida ${raceIndex}`);

    const param = { ...defaultParam, userCarId }

    axios.post("https://8za04rmw3eb0.grandmoralis.com:2053/server/functions/battlefield_startRace", param)

        .then(
            r => {
                console.log("Corrida realizada com sucesso");
                setTimeout(() => {
                    checkResult(param)
                }, 10 * 1000);
            },
            error => {
                if (error["response"]["data"]["error"] == "You reach the racing quota per day. Please try again tomorrow (UTC time).") {
                    console.log(`Carro id ${carIndex + 1} - ${userCarId} ja realizou as 12 corridas`);
                    raceIndex = 0
                    carIndex++
                    carRun()
                } else if (error["response"]["data"]["error"] == "Please wait...") {
                    setTimeout(() => {
                        checkResult(param)
                    }, 10 * 1000);

                } else {
                    console.log("Ja existia uma corrida realizada");
                    checkResult(param)
                }
            }
        )
}

function checkResult(param) {

    axios.post("https://8za04rmw3eb0.grandmoralis.com:2053/server/functions/battlefield_claimReward", param)
        .then(
            r => {
                console.log("Resultado coletado com sucesso");
                const racingCount = r["data"]['result']['userCar']['racingCount']
                if (racingCount >= 12) {
                    raceIndex = 0
                    carIndex++
                }

                carRun()
            },
            error => {
                console.log("ALERTA  - VERIFICAR");

                console.log(error["response"]["data"]["error"])
                carRun()
            }

        )

}

getUserData();





