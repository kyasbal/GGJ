function Timer() {
    this.startTime = Date.now();
}

Timer.prototype.getTime = function () {
    return Date.now() - this.startTime;
}

Timer.prototype.reset = function () {
    this.startTime = Date.now();
}
