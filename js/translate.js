let currentLang = localStorage.getItem("lang") || "ee";
localStorage.setItem("lang", currentLang);

//-- JSON väärtus --
function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

async function translatePage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);

  try {
    const response = await fetch(`lang/${lang}.json`);
    const translations = await response.json();

    //-- Data-i18n --
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = getNestedValue(translations, key);
      if (!value) return;

      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = value;
      } else if (el.tagName === "OPTION") {
        el.textContent = value;
      } else if (el.tagName === "BUTTON") {
        el.textContent = value;
      } else {
        el.textContent = value;
      }
    });

    //-- Vaip - opt --
    const og = document.getElementById("vaip-optgroup");
    const ogKey = "vaip.vaip";
    const ogValue = getNestedValue(translations, ogKey);
    if (ogValue) og.label = ogValue;

    document
      .querySelectorAll("#vaip-optgroup option[data-i18n]")
      .forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const value = getNestedValue(translations, key);
        if (value) el.text = value;
      });

    document.querySelectorAll("option[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = getNestedValue(translations, key);
      if (!value) return;

      el.setAttribute("label", value);
      el.innerText = value;
    });

    //-- Riided - opt --
    const ogRiided = document.getElementById("riided-optgroup");
    const ogKeyRiided = "riided.riided";
    const ogValueRiided = getNestedValue(translations, ogKeyRiided);
    if (ogValueRiided) ogRiided.label = ogValueRiided;

    document
      .querySelectorAll("#riided-optgroup option[data-i18n]")
      .forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const value = getNestedValue(translations, key);
        if (value) el.text = value;
      });

    //-- Hügeen - opt --
    const ogwc = document.getElementById("wc-optgroup");
    const ogKeywc = "wc.wc";
    const ogValuewc = getNestedValue(translations, ogKeywc);
    if (ogValuewc) ogwc.label = ogValuewc;

    document
      .querySelectorAll("#wc-optgroup option[data-i18n]")
      .forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const value = getNestedValue(translations, key);
        if (value) el.text = value;
      });

    //-- Mopid - opt --
    const ogMoppid = document.getElementById("moppid-optgroup");
    const ogKeyMoppid = "mopp.mopp";
    const ogValueMoppid = getNestedValue(translations, ogKeyMoppid);
    if (ogValueMoppid) ogMoppid.label = ogValueMoppid;

    document
      .querySelectorAll("#moppid-optgroup option[data-i18n]")
      .forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const value = getNestedValue(translations, key);
        if (value) el.text = value;
      });

    //-- Data-i18n-attr --
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      const key = el.getAttribute("data-i18n-attr");
      const value = getNestedValue(translations, key);
      if (!value) return;

      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.setAttribute("placeholder", value);
      } else if (el.tagName === "IMG") {
        el.setAttribute("alt", value);
      } else {
        el.setAttribute("data-text", value);
      }
    });
  } catch (err) {
    console.error("Translation load error:", err);
  }
}

translatePage(currentLang);

//-- Keel --
document.querySelectorAll("[data-lang]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    translatePage(btn.dataset.lang);
  });
});
