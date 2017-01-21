function GameManager() {
    this.timeLimit = 60;
    this.timer = new Timer();
    this.endGameHandlers = [];
    this.onScoreChangeHandler = function () {};
    this.onChangeTime = function (t) {
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
    this.score = 0;
    this.maxScoreList = [100, 200, 300, 400, 500];
    this.itemManager = new ItemManager();
    this.currentHina = 0;
}
GameManager.prototype.addScore = function (score) {
    this.score = Math.max(0, score + this.score);
    if (this.score > this.maxScoreList[this.currentHina]) {
        this.score -= this.maxScoreList[this.currentHina];
        this.currentHina++;
        this.onHinaGrown(this.currentHina);
    }
    this.onScoreChangeHandler(this.score);
};
GameManager.prototype.time = function () {
    return this.timer.getTime()
}
GameManager.prototype.init = function () {
    console.log("initilize game manager.");
    if (this._initialized) {
        console.error("GM init calld twice");
        return;
    }
    this._initialized = true;
    this.itemManager.register("apple", 100);
    this.itemManager.register("yacht", 100);
    this.itemManager.register("fish", 100);
    this.itemManager.register("lotusRoot", 100);
    this.itemManager.register("turtle", 100);
}
GameManager.prototype.gameStart = function () {
    this.timer.reset();
    var self = this;
    var stopId = setInterval(function () {
        var ct = self.timer.getTime();
        $(".time-text").text(Math.floor(self.timeLimit - ct / 5000));
        if (self.timeLimit * 1000 < ct) {
            clearInterval(stopId);
            Audios.timeup.play()
            self.endGameHandlers.forEach(function (h) {
                h();
            })
            return;
        }
        self.onChangeTime(ct)
    }, 100);

    //start gen items.
    self._itemGen = true;
    var putting = function () {
        self.itemManager.randomPut();
        if (self._itemGen) {
            setTimeout(putting, Math.random() * 300);
        }
    }
    putting();
}
GameManager.prototype.stopGenItem = function () {
    this._itemGen = false;
}
GameManager.prototype.addOnEndGameHandler = function (handler) {
    this.endGameHandlers.push(handler);
}
