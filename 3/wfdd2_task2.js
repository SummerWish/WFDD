for (var i = 2; i <= 100; ++i) {
  var flag = false;
  for (var j = 2; j < i; ++j) {
    if (i % j == 0) {
      flag = true;
      break;
    }
  }
  if (!flag) {
    console.log(i);
  }
}