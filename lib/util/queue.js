'use strict';

function Queue (el) {
  this.in = [];
  this.out = [];
  if (el) { this.in.push(el) }
  this.length = this.in.length;
}

Queue.prototype.enqueue = function (el) {
  this.in.push(el);
  this.length += 1;
};

Queue.prototype.dequeue = function () {
  if (this.out.length === 0) {
    while (this.in.length > 0) {
      this.out.push(this.in.pop());
    }
  }
  if (this.out[0]) { this.length -= 1 }
  return this.out.pop();
}

module.exports = Queue;
