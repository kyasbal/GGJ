const sound = new Howl({
    src: ['./audio/wind.mp3'],
    loop: true,
    volume: 0.5
});
const GM = new GameManager();
gr(function() {
    const $$ = gr("#sea");
    const waveContainer = $$(".wave-container").get(0);
    const itemContainer = $$(".item-container").get(0);
    WAVES = [];
    ITEMS = [];
    GM.gameStart();

    GM.onScoreChangeHandler = function(score) {
        const bar = document.getElementsByClassName('score-inner')[0];
        console.log(bar);
        bar.style.width = "150px";
        console.log(GM.score); //TODO: score bar
    }
    GM.addOnEndGameHandler(function() {
        console.log("end"); //TODO:do something on gameover.
        GM.gameStart();
    })
    for (let i = 0; i < 110; i++) {
        WAVES.push(waveContainer.addChildByName("wave-cube", {
            position: `${Math.random()*3},0,-${i}`,
            color: "#0084cf",
            offset: i,
            id: "wave-" + i
        }));
    }
    var manager = new ItemManager();
    manager.register("apple", 100);
    manager.register("gull", 100);


    var putting = function() {
        manager.randomPut()
        setTimeout(putting, Math.random() * 500);
    }
    putting();

});
