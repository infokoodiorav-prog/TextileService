document.addEventListener("DOMContentLoaded", () => {
  // -- DOM elemendid --
  const toggle = document.getElementById("chatbot-toggle");
  const bot = document.getElementById("chatbot");
  const chatMessages = document.getElementById("chatMessages");
  const chatOptions = document.getElementById("chatOptions");
  const formContainer = document.getElementById("formContainer");

  // -- State --
  let botTranslations = {};
  let steps = [];
  let currentStep = 0;
  let botData = {};
  let currentLang;
  try {
    currentLang = localStorage.getItem("lang") || "ee";
  } catch {
    currentLang = "ee";
  }

  // -- Toggle bot --
  toggle.onclick = () => {
    bot.style.display = bot.style.display === "flex" ? "none" : "flex";
    bot.style.flexDirection = "column";
    if (!botTranslations.chatbot) {
      loadChatbot(currentLang);
    }
  };

  // -- chatbot translations --
  async function loadChatbot(lang) {
    try {
      currentLang = lang === "et" ? "ee" : lang; // igaks juhuks
      localStorage.setItem("lang", currentLang);

      const res = await fetch(`lang/${currentLang}.json`);
      if (!res.ok) throw new Error("JSON not found");

      botTranslations = await res.json();

      generateSteps();
      botData = {};
      currentStep = 0;
      chatMessages.innerHTML = "";
      chatOptions.innerHTML = "";

      startChatbot();
    } catch (err) {
      console.error("Chatbot load error:", err);
    }
  }

  function generateSteps() {
    steps = [
      // -- Teenused --
      {
        question: botTranslations.chatbot.question_service,
        options: [
          botTranslations.chatbot.option_service_vaibad,
          botTranslations.chatbot.option_service_tooriided,
          botTranslations.chatbot.option_service_hygiene,
        ],
        key: "teenus",
      },

      // -- Vaibad --
      {
        question: botTranslations.chatbot.question_vaip_asukoht,
        options: [
          botTranslations.chatbot.option_vaip_enterance,
          botTranslations.chatbot.option_vaip_office,
          botTranslations.chatbot.option_vaip_factory,
          botTranslations.chatbot.option_vaip_toilet,
          botTranslations.chatbot.option_vaip_other,
        ],
        key: "asukoht",
        dependsOn: botTranslations.chatbot.option_service_vaibad,
      },
      {
        question: botTranslations.chatbot.option_vaip_other_clar,
        options: [],
        key: "asukoht_muu",
        dependsOn: botTranslations.chatbot.option_vaip_other,
        isFreeText: true,
      },
      {
        question: botTranslations.chatbot.question_vaip_amount,
        options: [
          botTranslations.chatbot.option_vaip_1,
          botTranslations.chatbot.option_vaip_2,
          botTranslations.chatbot.option_vaip_3,
          botTranslations.chatbot.option_vaip_4,
          botTranslations.chatbot.option_vaip_5,
          botTranslations.chatbot.option_vaip_6,
        ],
        key: "kogus",
        dependsOn: botTranslations.chatbot.option_service_vaibad,
      },
      {
        question: botTranslations.chatbot.question_vaip_frequency,
        options: [
          botTranslations.chatbot.option_vaip_1times,
          botTranslations.chatbot.option_vaip_2times,
          botTranslations.chatbot.option_vaip_1month,
          botTranslations.chatbot.option_vaip_other_frequency,
        ],
        key: "sagedus",
        dependsOn: botTranslations.chatbot.option_service_vaibad,
      },
      {
        question: botTranslations.chatbot.option_vaip_type,
        options: [
          botTranslations.chatbot.option_vaip_type1,
          botTranslations.chatbot.option_vaip_type2,
          botTranslations.chatbot.option_vaip_type3,
        ],
        key: "tüüp",
        dependsOn: botTranslations.chatbot.option_service_vaibad,
      },
      {
        question: botTranslations.chatbot.option_vaip_size,
        options: [
          botTranslations.chatbot.option_vaip_size_yes,
          botTranslations.chatbot.option_vaip_size_no,
        ],
        key: "suurus_teada",
        dependsOn: botTranslations.chatbot.option_service_vaibad,
      },
      {
        question: botTranslations.chatbot.option_vaip_size_clar,
        options: [],
        key: "suurus",
        dependsOn: botTranslations.chatbot.option_vaip_size_yes,
        isFreeText: true,
      },

      // -- Tööriided --
      {
        question: botTranslations.chatbot.option_riie_which,
        options: [
          botTranslations.chatbot.option_riie_which1,
          botTranslations.chatbot.option_riie_which2,
          botTranslations.chatbot.option_riie_which3,
          botTranslations.chatbot.option_riie_which4,
          botTranslations.chatbot.option_riie_which5,
          botTranslations.chatbot.option_riie_which6,
          botTranslations.chatbot.option_riie_which7,
        ],
        key: "tooriided_tuup",
        dependsOn: botTranslations.chatbot.option_service_tooriided,
      },
      {
        question: botTranslations.chatbot.option_riie_feature,
        options: [
          botTranslations.chatbot.option_riie_feature1,
          botTranslations.chatbot.option_riie_feature2,
          botTranslations.chatbot.option_riie_feature3,
          botTranslations.chatbot.option_riie_feature4,
          botTranslations.chatbot.option_riie_feature5,
        ],
        key: "tooriided_omadused",
        dependsOn: botTranslations.chatbot.option_service_tooriided,
      },
      {
        question: botTranslations.chatbot.option_riie_amount,
        options: [
          botTranslations.chatbot.option_riie_1,
          botTranslations.chatbot.option_riie_2,
          botTranslations.chatbot.option_riie_3,
          botTranslations.chatbot.option_riie_4,
          botTranslations.chatbot.option_riie_5,
          botTranslations.chatbot.option_riie_another,
        ],
        key: "tooriided_kogus",
        dependsOn: botTranslations.chatbot.option_service_tooriided,
      },
      {
        question: botTranslations.chatbot.option_riie_size,
        options: [
          botTranslations.chatbot.option_riie_size_s,
          botTranslations.chatbot.option_riie_size_m,
          botTranslations.chatbot.option_riie_size_l,
          botTranslations.chatbot.option_riie_size_xl,
          botTranslations.chatbot.option_riie_size_xxl,
          botTranslations.chatbot.option_riie_size_dunno,
        ],
        key: "tooriided_suurused",
        dependsOn: botTranslations.chatbot.option_service_tooriided,
      },
      {
        question: botTranslations.chatbot.option_riie_color,
        options: [
          botTranslations.chatbot.option_riie_color_1,
          botTranslations.chatbot.option_riie_color_2,
          botTranslations.chatbot.option_riie_color_3,
          botTranslations.chatbot.option_riie_color_4,
        ],
        key: "tooriided_kohandused",
        dependsOn: botTranslations.chatbot.option_service_tooriided,
      },

      // -- WC Tarvikud --
      {
        question: botTranslations.chatbot.option_hygiene,
        options: [
          botTranslations.chatbot.option_hygiene_1,
          botTranslations.chatbot.option_hygiene_2,
          botTranslations.chatbot.option_hygiene_3,
          botTranslations.chatbot.option_hygiene_4,
          botTranslations.chatbot.option_hygiene_5,
        ],
        key: "hygiene_type",
        dependsOn: botTranslations.chatbot.option_service_hygiene,
      },
      {
        question: botTranslations.chatbot.option_hygiene_amount,
        options: [
          botTranslations.chatbot.option_hygiene_amount_1,
          botTranslations.chatbot.option_hygiene_amount_2,
          botTranslations.chatbot.option_hygiene_amount_3,
          botTranslations.chatbot.option_hygiene_amount_4,
        ],
        key: "hygiene_kogus",
        dependsOn: botTranslations.chatbot.option_service_hygiene,
      },
      {
        question: botTranslations.chatbot.question_hygiene_frequency,
        options: [
          botTranslations.chatbot.option_hygiene_1times,
          botTranslations.chatbot.option_hygiene_2times,
          botTranslations.chatbot.option_hygiene_1month,
          botTranslations.chatbot.option_hygiene_other_frequency,
        ],
        key: "hygiene_sagedus",
        dependsOn: botTranslations.chatbot.option_service_hygiene,
      },
      {
        question: botTranslations.chatbot.option_hygiene_feature,
        options: [
          botTranslations.chatbot.option_hygiene_feature_yes,
          botTranslations.chatbot.option_hygiene_feature_no,
          botTranslations.chatbot.option_hygiene_feature_other,
        ],
        key: "hygiene_eriline",
        dependsOn: botTranslations.chatbot.option_service_hygiene,
      },
    ];
  }

  // -- Start chatbot --
  function startChatbot() {
    addBotMessage(botTranslations.chatbot.greeting);
    showStep(steps[currentStep]);
  }

  // -- Step --
  function showStep(step) {
    if (!step) return;

    if (step.dependsOn && botData.teenus !== step.dependsOn) {
      nextStep();
      return;
    }

    addBotMessage(step.question);
    chatOptions.innerHTML = "";

    step.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = opt;
      btn.onclick = () => handleChoice(step.key, opt);
      chatOptions.appendChild(btn);
    });
  }

  function handleChoice(key, value) {
    botData[key] = value;
    addUserMessage(value);
    chatOptions.innerHTML = "";

    //-- Muu asukoht --
    if (
      key === "asukoht" &&
      value === botTranslations.chatbot.option_vaip_other
    ) {
      askFreeText(
        botTranslations.chatbot.option_vaip_other_clar,
        "asukoht_muu",
      );
      return;
    }

    // -- Suurus Teada --
    if (
      key === "suurus_teada" &&
      value === botTranslations.chatbot.option_vaip_size_yes
    ) {
      askFreeText(botTranslations.chatbot.option_vaip_size_clar, "suurus");
      return;
    }

    nextStep();
  }

  function askFreeText(question, key) {
    addBotMessage(question);
    chatOptions.innerHTML = "";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = botTranslations.chatbot.placeholder_free_text;
    input.className = "chat-input";

    const btn = document.createElement("button");
    btn.textContent = botTranslations.chatbot.button_next;

    chatOptions.append(input, btn);

    btn.onclick = () => {
      if (!input.value.trim()) return;
      botData[key] = input.value.trim();
      addUserMessage(input.value);
      chatOptions.innerHTML = "";
      nextStep();
    };
  }

  function nextStep() {
    currentStep++;
    if (currentStep < steps.length) {
      showStep(steps[currentStep]);
    } else {
      finishBot();
    }
  }

  // -- Finish --
  function finishBot() {
    let summary = "";

    // -- Vaibad --
    if (botData.teenus === botTranslations.chatbot.option_service_vaibad) {
      summary += `<strong>${botTranslations.chatbot.summary_service}:</strong> ${botData.teenus}<br>`;
      summary += `<strong>${botTranslations.chatbot.summary_location}:</strong> ${botData.asukoht_muu || botData.asukoht}<br>`;
      summary += `<strong>${botTranslations.chatbot.summary_quantity}:</strong> ${botData.kogus}<br>`;
      summary += `<strong>${botTranslations.chatbot.question_vaip_frequency}:</strong> ${botData.sagedus}<br>`;
      summary += `<strong>${botTranslations.chatbot.option_vaip_type}:</strong> ${botData.tüüp}<br>`;
      summary += `<strong>${botTranslations.chatbot.option_vaip_size}:</strong> ${botData.suurus || botTranslations.chatbot.option_vaip_size_no}<br>`;
    }
    // -- Tööriided --
    else if (
      botData.teenus === botTranslations.chatbot.option_service_tooriided
    ) {
      summary += `<strong>${botTranslations.chatbot.summary_service}:</strong> ${botData.teenus}<br>`;
      summary += `<strong>${botTranslations.chatbot.option_service_tooriided}:</strong> ${botData.tooriided_tuup}<br>`;
      summary += `<strong>${botTranslations.chatbot.option_riie_feature}:</strong> ${botData.tooriided_omadused}<br>`;
      summary += `<strong>${botTranslations.chatbot.option_riie_amount}:</strong> ${botData.tooriided_kogus}<br>`;
      summary += `<strong>${botTranslations.chatbot.option_riie_size}:</strong> ${botData.tooriided_suurused}<br>`;
      summary += `<strong>${botTranslations.chatbot.option_riie_color}:</strong> ${botData.tooriided_kohandused}<br>`;
    }
    // -- WC Tarvikud --
    else if (
      botData.teenus === botTranslations.chatbot.option_service_hygiene
    ) {
      summary += `<strong>${botTranslations.chatbot.summary_service}:</strong> ${botData.teenus}<br>`;
      summary += `<strong>${botTranslations.chatbot.option_service_hygiene}:</strong> ${botData.hygiene_type}<br>`;
      summary += `<strong>${botTranslations.chatbot.option_hygiene_amount}:</strong> ${botData.hygiene_kogus}<br>`;
      summary += `<strong>${botTranslations.chatbot.question_hygiene_frequency}:</strong> ${botData.hygiene_sagedus}<br>`;
      summary += `<strong>${botTranslations.chatbot.option_hygiene_feature}:</strong> ${botData.hygiene_eriline || botTranslations.chatbot.option_hygiene_feature_no}<br>`;
    }

    // -- Overlay vorm --
    const overlay = document.getElementById("modalOverlay");
    const closeBtn = document.getElementById("closeModal");

    formContainer.innerHTML = `
        <form id="contactForm">
            <h2>${botTranslations.chatbot.form_header}</h2>
            <p><strong>${botTranslations.chatbot.form_p}</strong><br>${summary}</p>

            <label>
                ${botTranslations.chatbot.form_label}
                <textarea id="paringuTekst" rows="4"></textarea>
            </label>

            <label><input type="text" placeholder="${botTranslations.chatbot.form_label_name}" required></label>
            <label><input type="email" placeholder="${botTranslations.chatbot.form_label_email}" required></label>
            <label><input type="tel" placeholder="+372 XXXXXXXX"></label>

            <button type="submit">${botTranslations.chatbot.button_submit}</button>
        </form>
    `;

    overlay.style.display = "flex";

    // -- Sulge --
    closeBtn.onclick = () => {
      overlay.style.display = "none";
      botData = {};
      currentStep = 0;

      chatMessages.innerHTML = "";
      chatOptions.innerHTML = "";

      addBotMessage(
        `${botTranslations.chatbot.greeting}<br>${botTranslations.chatbot.start_intro}`,
      );
      showStep(steps[currentStep]);
    };

    overlay.onclick = (e) => {
      if (e.target === overlay) overlay.style.display = "none";
    };

    // -- Submit --
    const contactForm = document.getElementById("contactForm");
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      alert("Pakkumise päring saadetud!");
      overlay.style.display = "none";

      console.log({
        kommentaar: contactForm.querySelector("#paringuTekst").value,
        nimi: contactForm.querySelector(
          `input[placeholder="${botTranslations.chatbot.form_label_name}"]`,
        ).value,
        email: contactForm.querySelector(
          `input[placeholder="${botTranslations.chatbot.form_label_email}"]`,
        ).value,
        telefon: contactForm.querySelector('input[type="tel"]').value,
        botSummary: botData,
      });
    });
  }

  function addBotMessage(text) {
    const p = document.createElement("p");
    p.className = "bot-message";
    p.innerHTML = text;
    chatMessages.appendChild(p);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addUserMessage(text) {
    const p = document.createElement("p");
    p.className = "user-message";
    p.textContent = text;
    chatMessages.appendChild(p);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // -- Lang switch --
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      loadChatbot(btn.dataset.lang);
    });
  });
});
