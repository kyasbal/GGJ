const GM = new GameManager();

function initAnimation() {
    return new Promise((resolve, reject) => {
        const $$ = gr("#sea");
        var player = $$("#player_gull").first();
        UT.animate(1, 0, 1000, function (z) {
            var x = (1 - z * z * z * z) * 10;
            var p = player.getAttribute("position");
            player.setAttribute("position", [p.X, x / 10 * 3 - 3.8, 20 - 2.1 * x]); //TODO: to be better
        }, function () {
            resolve()
        });
    });
}
gr(function () {
    GM.init();
    const $$ = gr("#sea");
    const goml = $$("goml").get(0);
    goml.on("asset-load-completed",function(){
      Audios.wind.play();
      Audios.bgm.play();
      initAnimation().then(t => {
          GM.gameStart();
      });
    });
    const waveContainer = $$(".wave-container").get(0);
    const itemContainer = $$(".item-container").get(0);
    const text = document.getElementsByClassName('score-text')[0];
    text.innerHTML = "0/" + GM.maxScoreList[GM.currentHina];
    WAVES = [];
    ITEMS = [];

    // set countdown.
    GM.addTimetable(5, function () { Audios.countdown.play(); });
    GM.addTimetable(4, function () { Audios.countdown.play(); });
    GM.addTimetable(3, function () { Audios.countdown.play(); });
    GM.addTimetable(2, function () { Audios.countdown.play(); });
    GM.addTimetable(1, function () { Audios.countdown.play(); });

    GM.onchangeSecond = function () {
        console.log(`commbo:${GM.commbo}`);
    }
    GM.onChangeTime = function (t, l) {
        const time = t / 1000 / this.timeLimit;
        const colors = [
        [-0.0001, "#224483"],
        [0.5, "#3290D3"],
        [0.75, "#77ABCC"],
        [0.80, "#DD806A"],
        [0.95, "#DE7536"],
        [1.05, "#DD806A"]
      ];
        let ac;
        for (let i = 0; i < colors.length; i++) {
            if (colors[i + 1][0] > time) {
                const progress = (time - colors[i][0]) / (colors[i + 1][0] - colors[i][0]);
                ac = chroma.mix(colors[i][1], colors[i + 1][1], progress).hex();
                break;
            }
        }
        $(".background").css("background-color", ac)
        gr("#sea")("wave-cube").setAttribute("color", ac)
    };
    GM.onHinaGrown = function () {
        console.log("hina grown!!!!!!!!!!!!!!!!");
        const bar = document.getElementsByClassName('score-inner')[0];
        const text = document.getElementsByClassName('score-text')[0];
        text.innerHTML = '0/' + GM.currentMaxScoreStr();
        bar.style.width = 0 + "px";
        const img = document.getElementsByClassName('hina hina' + GM.currentHina)[0];
        img.src = "./img/kamome.png";
        Audios.trans.play();
    }
    GM.onScoreChangeHandler = function (score, isLast) {
        const bar = document.getElementsByClassName('score-inner')[0];
        const text = document.getElementsByClassName('score-text')[0];
        if (isLast) {
            bar.style.width = "300px";
            text.innerHTML = score + '/∞';
        } else {

            const max = GM.maxScoreList[GM.currentHina];
            const ratio = score / max;
            bar.style.width = ratio * 300 + "px";
            text.innerHTML = score + '/' + max;
        }
    }
    GM.addOnEndGameHandler(function () {
        console.log("game end");
        console.log(GM.takenItems);
        var params = []
        for (var key in GM.takenItems) {
            params.push(`${key}=${GM.takenItems[key]}`);
            // url += `${key}=${GM.takenItems[key]}`;
        }
        params.push(`hina=${GM.currentHina + 1}`);
        var url = './result.html?' + params.join("&");//TODO:アイテム一つも取らないとバグる？
        url += `&score=${GM.getTotalScore()}`
        window.location.href = url;
    })

    //init waves
    for (let i = 0; i < 110; i++) {
        WAVES.push(waveContainer.addChildByName("wave-cube", {
            position: `${Math.random()*3},0,-${i}`,
            color: "#0084cf",
            offset: i,
            id: "wave-" + i
        }));
    }
});;
