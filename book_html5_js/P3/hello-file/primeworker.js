var count = 0;
onmessage = function(event) {
  var num, primes = [];
  var target = parseInt(event.data) || 100000;
  for (var num = 2; num <= target; num++) {
    var is_prime = true;
    for (var i = 2; i <= Math.sqrt(num); i++) {
      if (num % i == 0) {
        is_prime = false;
        break;
      }
    }
    if (is_prime) {
      primes.push(num);
      count++;
      postMessage("발견한 소수는 " + count + "개이며, 가장 큰 소수는 " + num
        + "/" + primes.toString());
    }
  }
}
