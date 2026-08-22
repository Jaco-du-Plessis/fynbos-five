(function () {
  "use strict";

  var STORAGE_KEY = "fynbos-five-progress";
  var LETTERS = ["A", "B", "C", "D"];
  var BAIT_WRONG_MS = 1800;
  var BAIT_ATTRACT_MS = 1100;
  var ANSWER_FEEDBACK_MS = 900;
  var WRONG_ANSWER_FEEDBACK_MS = 2400;

  var content = window.CONTENT;
  var insects = content.insects;
  var baits = content.baits;
  var baitById = {};
  baits.forEach(function (bait) {
    baitById[bait.id] = bait;
  });
  var byId = {};
  insects.forEach(function (insect) {
    byId[insect.id] = insect;
  });

  var els = {
    title: document.getElementById("title"),
    tagline: document.getElementById("tagline"),
    guilds: document.getElementById("guilds"),
    catchBee: document.getElementById("catch-bee"),
    reset: document.getElementById("reset"),
    capture: document.getElementById("capture"),
    captureBack: document.getElementById("capture-back"),
    captureGuild: document.getElementById("capture-guild"),
    captureName: document.getElementById("capture-name"),
    captureSci: document.getElementById("capture-sci"),
    captureInsect: document.getElementById("capture-insect"),
    captureHint: document.getElementById("capture-hint"),
    placedBait: document.getElementById("placed-bait"),
    baitStatus: document.getElementById("bait-status"),
    baitPicker: document.getElementById("bait-picker"),
    placeBait: document.getElementById("place-bait"),
    quiz: document.getElementById("quiz"),
    quizQuestion: document.getElementById("quiz-question"),
    quizOptions: document.getElementById("quiz-options"),
    quizFeedback: document.getElementById("quiz-feedback"),
    facts: document.getElementById("facts"),
    factsGuild: document.getElementById("facts-guild"),
    factsName: document.getElementById("facts-name"),
    factsSci: document.getElementById("facts-sci"),
    factsImage: document.getElementById("facts-image"),
    factsBody: document.getElementById("facts-body"),
    factsClose: document.getElementById("facts-close"),
    message: document.getElementById("message"),
    messageTitle: document.getElementById("message-title"),
    messageBody: document.getElementById("message-body"),
    messageCancel: document.getElementById("message-cancel"),
    messageDismiss: document.getElementById("message-dismiss"),
  };

  var state = loadState();
  var activeId = null;
  var selectedBaitId = null;
  var baitLocked = false;
  var pendingFinale = false;
  var baitTimer = null;

  function defaultState() {
    return { caught: [], seenFirstCatch: false };
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      var parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.caught)) return defaultState();
      return {
        caught: parsed.caught.filter(function (id) {
          return Boolean(byId[id]);
        }),
        seenFirstCatch: Boolean(parsed.seenFirstCatch),
      };
    } catch (err) {
      return defaultState();
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function isCaught(id) {
    return state.caught.indexOf(id) !== -1;
  }

  function insectFromHash() {
    var hash = (location.hash || "").replace(/^#/, "");
    var match = /^catch\/([a-z]+)$/.exec(hash);
    if (!match) return null;
    return byId[match[1]] || null;
  }

  function goHome() {
    if (location.hash) {
      history.replaceState(null, "", location.pathname + location.search);
    }
    closeCapture();
    route();
  }

  function openCatch(id) {
    location.hash = "catch/" + id;
  }

  function renderBoard() {
    els.title.textContent = content.title;
    els.tagline.textContent = content.tagline;
    els.catchBee.textContent = content.catchBeeLabel;
    els.reset.textContent = content.resetLabel;
    els.catchBee.hidden = isCaught("bee");
    els.guilds.innerHTML = "";

    insects.forEach(function (insect) {
      var caught = isCaught(insect.id);
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "slot" + (caught ? " is-caught" : "");
      btn.dataset.id = insect.id;
      btn.innerHTML =
        '<div class="slot-art"><img alt="" src="' +
        (caught ? insect.image : insect.lockedImage) +
        '"></div>' +
        '<span class="slot-guild">' +
        insect.guild +
        "</span>" +
        '<span class="slot-name">' +
        (caught ? insect.commonName : "Not found yet") +
        "</span>";
      btn.addEventListener("click", function () {
        if (isCaught(insect.id)) {
          showFacts(insect);
        } else {
          showMessage(
            content.lockedTitle,
            insect.qrHint || "Find this insect in the garden and scan the QR.",
            "OK",
            null
          );
        }
      });
      els.guilds.appendChild(btn);
    });
  }

  function renderBaitPicker() {
    els.baitPicker.innerHTML = "";
    baits.forEach(function (bait) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "bait-choice" + (selectedBaitId === bait.id ? " is-selected" : "");
      btn.setAttribute("role", "option");
      btn.setAttribute("aria-selected", selectedBaitId === bait.id ? "true" : "false");
      btn.innerHTML =
        '<img alt="" src="' +
        bait.image +
        '"><span>' +
        bait.label +
        "</span>";
      btn.addEventListener("click", function () {
        if (baitLocked) return;
        selectedBaitId = bait.id;
        renderBaitPicker();
        els.placeBait.disabled = false;
        els.baitStatus.textContent = "";
        els.baitStatus.className = "bait-status";
      });
      els.baitPicker.appendChild(btn);
    });
  }

  function clearBaitTimer() {
    if (baitTimer) {
      window.clearTimeout(baitTimer);
      baitTimer = null;
    }
  }

  function resetCatch() {
    clearBaitTimer();
    selectedBaitId = null;
    baitLocked = false;
    els.captureInsect.classList.remove("is-attracted");
    els.placedBait.hidden = true;
    els.placedBait.removeAttribute("src");
    els.baitStatus.textContent = "";
    els.baitStatus.className = "bait-status";
    els.placeBait.disabled = true;
    els.placeBait.textContent = content.placeBaitLabel;
    renderBaitPicker();
  }

  function showCapture(insect) {
    activeId = insect.id;
    els.captureGuild.textContent = insect.guild;
    els.captureName.textContent = insect.commonName;
    els.captureSci.textContent = insect.scientificName;
    els.captureInsect.src = insect.image;
    els.captureInsect.alt = insect.commonName;
    els.captureHint.textContent = content.captureHint;
    els.capture.hidden = false;
    els.capture.classList.remove("is-quizzing");
    els.quiz.hidden = true;
    resetCatch();
    document.body.style.overflow = "hidden";
  }

  function closeCapture() {
    activeId = null;
    clearBaitTimer();
    els.capture.hidden = true;
    els.capture.classList.remove("is-quizzing");
    els.quiz.hidden = true;
    resetCatch();
    document.body.style.overflow = "";
  }

  function placeSelectedBait() {
    if (baitLocked || !activeId || !selectedBaitId) return;
    var insect = byId[activeId];
    var bait = baitById[selectedBaitId];
    if (!insect || !bait) return;

    baitLocked = true;
    els.placeBait.disabled = true;
    els.placedBait.src = bait.image;
    els.placedBait.alt = bait.label;
    els.placedBait.hidden = false;

    if (selectedBaitId !== insect.bait) {
      els.baitStatus.textContent = content.wrongBait;
      els.baitStatus.className = "bait-status is-wrong";
      baitTimer = window.setTimeout(function () {
        resetCatch();
      }, BAIT_WRONG_MS);
      return;
    }

    els.baitStatus.textContent = "";
    els.captureInsect.classList.add("is-attracted");
    baitTimer = window.setTimeout(function () {
      showQuiz(insect);
    }, BAIT_ATTRACT_MS);
  }

  function showQuiz(insect) {
    els.quizQuestion.textContent = insect.quiz.question;
    els.quizOptions.innerHTML = "";
    els.quizOptions.classList.remove("is-locked");
    els.quizFeedback.textContent = "";
    els.quizFeedback.className = "quiz-feedback";
    insect.quiz.options.forEach(function (label, index) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option";
      btn.innerHTML =
        '<span class="letter">' + LETTERS[index] + "</span> " + label;
      btn.addEventListener("click", function () {
        onQuizAnswer(insect, index, btn);
      });
      els.quizOptions.appendChild(btn);
    });
    els.capture.classList.add("is-quizzing");
    els.quiz.hidden = false;
  }

  function onQuizAnswer(insect, index, btn) {
    if (els.quizOptions.classList.contains("is-locked")) return;
    var correct = index === insect.quiz.correctIndex;
    els.quizOptions.classList.add("is-locked");
    btn.classList.add(correct ? "is-correct" : "is-wrong");
    els.quizFeedback.className =
      "quiz-feedback " + (correct ? "is-correct" : "is-wrong");
    els.quizFeedback.textContent = correct
      ? content.correctAnswer
      : content.wrongAnswer;

    window.setTimeout(function () {
      els.quiz.hidden = true;
      els.capture.classList.remove("is-quizzing");
      if (correct) {
        catchInsect(insect);
      } else {
        resetCatch();
      }
    }, correct ? ANSWER_FEEDBACK_MS : WRONG_ANSWER_FEEDBACK_MS);
  }

  function catchInsect(insect) {
    var first = state.caught.length === 0;
    if (!isCaught(insect.id)) {
      state.caught.push(insect.id);
    }
    if (first) state.seenFirstCatch = true;
    saveState();
    closeCapture();
    renderBoard();

    var allCaught = insects.every(function (item) {
      return isCaught(item.id);
    });

    if (first) {
      pendingFinale = allCaught;
      showMessage(
        content.firstCatchMessage.title,
        content.firstCatchMessage.body,
        content.firstCatchMessage.dismiss,
        function () {
          if (pendingFinale) {
            pendingFinale = false;
            showFinale();
          }
        }
      );
      return;
    }

    if (allCaught) showFinale();
  }

  function showFacts(insect) {
    els.factsGuild.textContent = insect.guild;
    els.factsName.textContent = insect.commonName;
    els.factsSci.textContent = insect.scientificName;
    els.factsImage.src = insect.image;
    els.factsImage.alt = insect.commonName;
    els.factsBody.textContent = insect.facts;
    els.facts.hidden = false;
  }

  function showFinale() {
    showMessage(
      content.finale.title,
      content.finale.body,
      content.finale.dismiss,
      null
    );
  }

  function showMessage(title, body, dismiss, onClose) {
    els.messageTitle.textContent = title;
    els.messageTitle.hidden = !title;
    els.messageBody.textContent = body;
    els.messageDismiss.textContent = dismiss;
    els.messageCancel.hidden = true;
    els.messageCancel.onclick = null;
    els.message.hidden = false;
    els.messageDismiss.onclick = function () {
      els.message.hidden = true;
      if (onClose) onClose();
    };
  }

  function closeMessage() {
    els.message.hidden = true;
  }

  function showConfirm(title, body, cancelLabel, confirmLabel, onConfirm) {
    els.messageTitle.textContent = title || "";
    els.messageTitle.hidden = !title;
    els.messageBody.textContent = body;
    els.messageCancel.textContent = cancelLabel;
    els.messageDismiss.textContent = confirmLabel;
    els.messageCancel.hidden = false;
    els.message.hidden = false;
    els.messageCancel.onclick = closeMessage;
    els.messageDismiss.onclick = function () {
      closeMessage();
      if (onConfirm) onConfirm();
    };
  }

  function route() {
    var insect = insectFromHash();
    if (!insect) {
      closeCapture();
      els.facts.hidden = true;
      return;
    }
    if (isCaught(insect.id)) {
      closeCapture();
      if (location.hash) {
        history.replaceState(null, "", location.pathname + location.search);
      }
      showMessage(insect.commonName, content.alreadyCaught, "See facts", function () {
        showFacts(insect);
      });
      return;
    }
    showCapture(insect);
  }

  els.catchBee.addEventListener("click", function () {
    openCatch("bee");
  });

  els.reset.addEventListener("click", function () {
    showConfirm(
      content.title,
      content.resetConfirm,
      content.resetCancel,
      content.resetLabel,
      function () {
        state = defaultState();
        saveState();
        pendingFinale = false;
        goHome();
        renderBoard();
      }
    );
  });

  els.captureBack.addEventListener("click", goHome);
  els.placeBait.addEventListener("click", placeSelectedBait);
  els.factsClose.addEventListener("click", function () {
    els.facts.hidden = true;
  });

  els.message.addEventListener("click", function (event) {
    if (event.target !== els.message) return;
    if (els.messageCancel.hidden) return;
    closeMessage();
  });

  window.addEventListener("hashchange", route);

  renderBoard();
  route();
})();
