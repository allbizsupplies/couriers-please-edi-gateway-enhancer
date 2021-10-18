(() => {
  const form = document.getElementById("loginForm");
  if (form === null) {
    return;
  }

  browser.storage.sync.get("username").then(
    (item) => {
      if (item.username) {
        document.getElementById("account").value = item.username;
      } else {
        console.error("Error: Username not set.");
      }
    },
    (err) => {
      console.log(`Error: ${err}`);
    }
  );
})();
