(() => {
  const copyOnClickElements = document.querySelectorAll("[data-copy-on-click]");
  copyOnClickElements.forEach((el) => {
    el.onclick = () => {
      const text = el.value;

      navigator.permissions
        .query({ name: "clipboard-write" })
        .then((result) => {
          if (result.state === "granted" || result.state === "prompt") {
            navigator.clipboard.writeText(text);
          }
        });

      el.select();
    };
  });

  console.info(`👋 hello`);
})();
