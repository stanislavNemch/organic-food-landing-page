(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
document.addEventListener("DOMContentLoaded", function() {
  const burgerBtn = document.querySelector("header button.burger");
  const burgerBtnIcons = document.querySelectorAll(
    "header button.burger img"
  );
  burgerBtn.addEventListener("click", function() {
    burgerBtnIcons.forEach((icon) => {
      icon.classList.toggle("hidden");
    });
    document.querySelector("header .mobile-menu .nav").classList.toggle("visible");
  });
  const searchBtn = document.querySelector("header button.search-btn");
  searchBtn.addEventListener("click", function() {
    document.querySelector("header .mobile-menu .features .search").classList.toggle("expanded");
  });
});
