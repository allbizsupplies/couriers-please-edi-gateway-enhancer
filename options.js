function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    username: document.querySelector("#username").value,
  });
}

function restoreOptions() {
  function setCurrentChoice(result) {
    document.querySelector("#username").value = result.username || "";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get("username");
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
