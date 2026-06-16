/* Hero keyword typewriter — character reveal + blinking caret, gradient fill, seamless loop.
   Caret lives INSIDE .l2 so rebuilding the headline (Tweaks) doesn't fight the observer. */
(function () {
  var h1 = document.querySelector('.hero h1');
  if (!h1) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var runId = 0;

  function makeCaret() {
    var c = document.createElement('span');
    c.className = 'tw-caret';
    c.setAttribute('aria-hidden', 'true');
    return c;
  }

  // purple -> blue -> teal gradient, sampled per character index
  var STOPS = [[166, 123, 255], [110, 168, 255], [70, 227, 189]];
  function gradColor(f) {
    f = Math.max(0, Math.min(1, f));
    var seg = f < 0.5 ? 0 : 1;
    var t = f < 0.5 ? f / 0.5 : (f - 0.5) / 0.5;
    var a = STOPS[seg], b = STOPS[seg + 1];
    var r = Math.round(a[0] + (b[0] - a[0]) * t);
    var g = Math.round(a[1] + (b[1] - a[1]) * t);
    var bl = Math.round(a[2] + (b[2] - a[2]) * t);
    return 'rgb(' + r + ',' + g + ',' + bl + ')';
  }
  function colorOf(word, i) {
    var n = Math.max(1, word.replace(/\s+$/, '').length - 1);
    return gradColor(i / n);
  }
  function styleChar(s, color) {
    s.style.color = color;
    s.style.webkitTextFillColor = color;
  }

  function start() {
    var l2 = h1.querySelector('.l2');
    if (!l2) return;
    var word = (l2.getAttribute('data-word') || l2.textContent || '').trim();
    if (!word) return;
    l2.setAttribute('data-word', word);
    var myId = ++runId;

    var caret = makeCaret();

    if (reduce) {
      l2.textContent = '';
      for (var k = 0; k < word.length; k++) {
        var rs = document.createElement('span');
        rs.className = 'tw-char in';
        rs.textContent = word[k];
        if (word[k] !== ' ') styleChar(rs, colorOf(word, k));
        l2.appendChild(rs);
      }
      l2.appendChild(caret);
      return;
    }

    var i = 0;
    l2.textContent = '';
    l2.appendChild(caret);

    function keepCaretLast() { if (l2.lastChild !== caret) l2.appendChild(caret); }

    function typeNext() {
      if (myId !== runId) return;
      if (i < word.length) {
        var s = document.createElement('span');
        s.className = 'tw-char';
        s.textContent = word[i];
        if (word[i] !== ' ') styleChar(s, colorOf(word, i));
        l2.insertBefore(s, caret);
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { s.classList.add('in'); });
        });
        var ch = word[i];
        i++;
        var delay = ch === ' ' ? 150 : (68 + Math.random() * 52);
        setTimeout(typeNext, delay);
      } else {
        setTimeout(eraseAll, 2100);
      }
    }

    function eraseAll() {
      if (myId !== runId) return;
      var chars = l2.querySelectorAll('.tw-char');
      if (chars.length === 0) {
        setTimeout(function () { if (myId === runId) { i = 0; typeNext(); } }, 520);
        return;
      }
      var last = chars[chars.length - 1];
      last.classList.remove('in');
      setTimeout(function () {
        if (myId !== runId) return;
        if (last.parentNode) last.parentNode.removeChild(last);
        keepCaretLast();
        eraseAll();
      }, 38);
    }

    typeNext();
  }

  // Re-run if the headline node is rebuilt (e.g. Tweaks headline change).
  // Our own edits only touch .l2's children (a subtree we don't observe), so no loop.
  new MutationObserver(function () { start(); }).observe(h1, { childList: true });
  start();
})();
