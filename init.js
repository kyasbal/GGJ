const sound = new Howl({
    src: ['./audio/wind.mp3'],
    loop: true,
    volume: 0.5
});
const GM = new GameManager();
gr(function () {
    GM.init();
    const $$ = gr("#sea");
    const waveContainer = $$(".wave-container").get(0);
    const itemContainer = $$(".item-container").get(0);
    const text = document.getElementsByClassName('score-text')[0];
    text.innerHTML = "0/" + GM.maxScoreList[GM.currentHina];
    WAVES = [];
    ITEMS = [];
    GM.onHinaGrown = function () {
        console.log("hina grown!!!!!!!!!!!!!!!!");
        const bar = document.getElementsByClassName('score-inner')[0];
        const text = document.getElementsByClassName('score-text')[0];
        text.innerHTML = '0/' + GM.maxScoreList[GM.currentHina];
        bar.style.width = 0 + "px";
        const img = document.getElementsByClassName('hina hina' + GM.currentHina)[0];
        img.src = "../img/kamome.png";
        Audios.piyopiyo.play();
    }
    GM.onScoreChangeHandler = function (score) {
        const bar = document.getElementsByClassName('score-inner')[0];
        const text = document.getElementsByClassName('score-text')[0];
        const max = GM.maxScoreList[GM.currentHina];
        const ratio = score / max;
        bar.style.width = ratio * 300 + "px";
        text.innerHTML = score + '/' + max;
    }
    GM.addOnEndGameHandler(function () {
        console.log("end"); //TODO:do something on gameover.
        GM.gameStart(); //TODO:remove
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
    GM.gameStart();
    $("html,body").animate({
        scrollTop: $(document).scrollTop()
    });
    sound.play();
});
