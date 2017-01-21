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
    text.innerHTML = "0/" + GM.maxScore;
    WAVES = [];
    ITEMS = [];
    GM.onScoreChangeHandler = function (score) {
        const bar = document.getElementsByClassName('score-inner')[0];
        const text = document.getElementsByClassName('score-text')[0];
        const ratio = Math.min(GM.score, GM.maxScore) / GM.maxScore;
        bar.style.width = ratio * GM.maxScoreWidth + "px";
        const currentScore = Math.floor(ratio * GM.maxScore);
        text.innerHTML = currentScore + '/' + GM.maxScore;
        if (currentScore >= GM.maxScoreList[GM.currentHina] &&
            GM.currentHina < GM.maxScoreList.length) {
            GM.currentHina++;
            GM.maxScore = GM.maxScoreList[GM.currentHina];
            text.innerHTML = 0 + '/' + GM.maxScore;
            bar.style.width = 0 + "px"
            GM.score = 0;
            const img = document.getElementsByClassName('hina hina' + GM.currentHina)[0];
            img.src = "../img/kamome.png";
            console.log(GM.currentHina + "番目の雛が成長しました！");
        }

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
