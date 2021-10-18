(() => {
  console.log("main.js");

  // Edit the page title to indicate that the extension is running.
  const title = document.querySelector("body table:first-child h6:first-child");
  title.style = "padding-top: 24px; padding-right: 30px; color: #d40511";
  const subtitle = document.querySelector(
    "body table:first-child h6:last-child"
  );
  subtitle.style = "padding-right: 30px; color: #d40511; font-size: 1.5em";
  subtitle.innerHTML = "with Couriers Please<br/>EDI Gateway Enhancer add-on";
})();
