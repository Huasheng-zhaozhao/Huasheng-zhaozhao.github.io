/* 隐藏式目录：只显示当前阅读位置附近 ±2 条，其余收起，跟随滚动流动 */
(function () {
  function init() {
    var toc = document.querySelector('#card-toc .toc');
    if (!toc) return;
    var items = Array.prototype.slice.call(toc.querySelectorAll('.toc-item'));
    if (items.length < 5) return; // 项太少不需要收起

    function update() {
      var activeLink = toc.querySelector('.toc-link.active');
      if (!activeLink) activeLink = toc.querySelector('.toc-item.active .toc-link');
      var actItem = activeLink ? activeLink.closest('.toc-item') : null;
      var ai = actItem ? items.indexOf(actItem) : -1;

      var visible = new Set();
      if (ai !== -1) {
        var lo = Math.max(0, ai - 2);
        var hi = Math.min(items.length - 1, ai + 2);
        for (var k = lo; k <= hi; k++) {
          var el = items[k];
          while (el) {
            visible.add(el);
            el = el.parentElement ? el.parentElement.closest('.toc-item') : null;
          }
        }
      }
      items.forEach(function (it) {
        it.classList.toggle('toc-fold-hidden', ai !== -1 && !visible.has(it));
      });
    }

    // 监听 Butterfly 高亮 active 的变化
    var mo = new MutationObserver(function () { requestAnimationFrame(update); });
    mo.observe(toc, { subtree: true, attributes: true, attributeFilter: ['class'] });
    window.addEventListener('scroll', function () { requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('load', update);
    setTimeout(update, 600);
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('pjax:complete', init);
})();
