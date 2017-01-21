function GameManager() {
    this.timeLimit = 60;
    this.timer = new Timer();
    this.endGameHandlers = [];
    this.onScoreChangeHandler = function () {};
    this.onChangeTime = function () {};
    this.score = 0;
    this.maxSroreList = [1000, 2000, 3000, 4000, 5000];
    this.maxScore = this.maxSroreList[this.maxSroreList.length - 1];
    this.maxScoreWidth = 300;
    this.itemManager = new ItemManager();
    this.currentHina = 0;
}
GameManager.prototype.addScore = function (score) {
    this.score += score;
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
    this.itemManager.register("gull", 100);
}
GameManager.prototype.gameStart = function () {
    console.log("START!!!");

    this.timer.reset();
    var self = this;
    var stopId = setInterval(function () {
        var ct = self.timer.getTime();
        $(".time-text").text(Math.floor(self.timeLimit - ct / 1000));
        if (self.timeLimit * 1000 < ct) {
            clearInterval(stopId);
            self.endGameHandlers.forEach(function (h) {
                h();
            })
        }
        self.onChangeTime()
    }, 100);

    //start gen items.
    self._itemGen = true;
    var putting = function () {
        self.itemManager.randomPut();
        if (self._itemGen) {
            setTimeout(putting, Math.random() * 500);
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
