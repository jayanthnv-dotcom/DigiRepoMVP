/* Boots a detail page: loads the item, renders it with its type view, wires sharing. */
(function () {
  const USE = window.USE;
  USE.views = USE.views || {};

  USE.detailPage = (type) => {
    USE.layout(type);
    const root = USE.qs('#app');
    const item = USE.store.get(type, USE.param('id'));
    if (!item) return USE.notFound(root, type);
    document.title = item.title + ' · USE Network';
    const view = USE.views[type];
    const ctx = view.render(item, root) || {};
    USE.hydrateSrc(root);
    USE.share.init(Object.assign({ item }, ctx.share || {}));
  };
})();
