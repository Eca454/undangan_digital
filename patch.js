const fs = require('fs');
const path = 'index.html';
let text = fs.readFileSync(path, 'utf8');
const start = text.indexOf('\n\t\t\t\tfunction applyAll() {');
const end = text.indexOf('\n\t\t\t\t// --- Poll DB setiap 10 detik', start);
if (start === -1 || end === -1) {
  throw new Error('Pattern not found');
}
const replacement = `function applyAll() {
					document.querySelectorAll('.wpkoi-elements-countdown-items[data-date]').forEach(function (ul) {
						var cur = ul.getAttribute('data-date') || '';
						var time = (cur.match(/(\\d{1,2}:\\d{2}(?::\\d{2})?)/) || [])[1] || '00:00:00';
						var curY = ymdFrom(cur);
						var tgt = buildTarget(curY || YMD, time);

						if (RE.test(curY)) {
							YMD = curY;
						}

						ul.setAttribute('data-date', tgt);
						if (window.jQuery && !reinit(jQuery(ul), tgt)) {
							setTimeout(function () { fallback(ul, tgt); }, 200);
						}

						replaceDateTexts(ul, YMD);
					});

					try { window.IDB_YMD = YMD; } catch (_) { }
					try { window.parent && window.parent.postMessage({ type: 'idb-ymd', ymd: YMD || '' }, window.location.origin); } catch (_) { }
				}


`;
fs.writeFileSync(path, text.slice(0, start) + replacement + text.slice(end), 'utf8');
console.log('patched', start, end);
