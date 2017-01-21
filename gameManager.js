function GameManager() {
    this.timer = new Timer();
    this.timeLimit = 60;
    this.endGameHandlers = [];
    this.onScoreChangeHandler;
    this.onChangeTime = null;
    this.score = 0;
    this.maxSroreList = [1000, 2000, 3000, 4000, 5000];
}
GameManager.prototype.addScore = function (score) {
    this.score += score;
    this.onScoreChangeHandler(this.score);
};
GameManager.prototype.time = function () {
    return this.timer.getTime()
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
        this.onChangeTime()
    }, 100);

    //start gen items.
    this._itemGen = true;
    var putting = function () {
        this.itemManager.randomPut();
        if (this._itemGen) {
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
