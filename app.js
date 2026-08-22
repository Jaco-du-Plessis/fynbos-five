(function () {
  "use strict";

  var STORAGE_KEY = "fynbos-five-progress";
  var LETTERS = ["A", "B", "C", "D"];
  var THROW_DISTANCE = 90;
  var QUIZ_AFTER_THROW_MS = 1800;
  var ANSWER_FEEDBACK_MS = 900;
  var WRONG_ANSWER_FEEDBACK_MS = 2400;

  var content = window.CONTENT;
  var insects = content.insects;
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
    seedPod: document.getElementById("seed-pod"),
    seedPodWrap: document.getElementById("seed-pod-wrap"),
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
    messageDismiss: document.getElementById("message-dismiss"),
  };

  var state = loadState();
  var activeId = null;
  var throwLocked = false;
  var pendingFinale = false;
  var drag = null;

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
        insect.image +
        '"></div>' +
        '<span class="slot-guild">' +
        insect.guild +
        "</span>" +
        '<span class="slot-name">' +
        (caught ? insect.commonName : "Not caught yet") +
        "</span>";
      btn.addEventListener("click", function () {
        if (isCaught(insect.id)) {
          showFacts(insect);
        } else {
          showMessage(content.lockedTitle, content.lockedHint, "OK", null);
        }
      });
      els.guilds.appendChild(btn);
    });
  }

  function showCapture(insect) {
    activeId = insect.id;
    throwLocked = false;
    resetPod();
    els.captureInsect.classList.remove("is-sucked", "is-pop");
    els.captureGuild.textContent = insect.guild;
    els.captureName.textContent = insect.commonName;
    els.captureSci.textContent = insect.scientificName;
    els.captureInsect.src = insect.image;
    els.captureInsect.alt = insect.commonName;
    els.captureHint.textContent = content.captureHint;
    els.capture.hidden = false;
    els.capture.classList.remove("is-quizzing");
    els.quiz.hidden = true;
    document.body.style.overflow = "hidden";
  }

  function closeCapture() {
    activeId = null;
    throwLocked = false;
    els.capture.hidden = true;
    els.capture.classList.remove("is-quizzing");
    els.quiz.hidden = true;
    resetPod();
    document.body.style.overflow = "";
  }

  function resetPod() {
    var wrap = els.seedPodWrap;
    els.seedPod.classList.remove("is-shake");
    wrap.classList.remove("is-throwing", "is-centered");
    wrap.style.transition = "";
    wrap.style.transform = "";
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
        popOut();
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

  function popOut() {
    throwLocked = false;
    els.captureInsect.classList.remove("is-sucked");
    els.captureInsect.classList.add("is-pop");
    resetPod();
    window.setTimeout(function () {
      els.captureInsect.classList.remove("is-pop");
    }, 450);
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
    els.messageBody.textContent = body;
    els.messageDismiss.textContent = dismiss;
    els.message.hidden = false;
    els.messageDismiss.onclick = function () {
      els.message.hidden = true;
      if (onClose) onClose();
    };
  }

  function throwPod() {
    if (throwLocked || !activeId) return;
    throwLocked = true;
    var wrap = els.seedPodWrap;
    var insect = els.captureInsect;
    wrap.classList.add("is-throwing");
    wrap.style.transition = "";
    wrap.style.transform = "";
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        wrap.classList.add("is-centered");
      });
    });

    window.setTimeout(function () {
      insect.classList.add("is-sucked");
    }, 280);

    window.setTimeout(function () {
      els.seedPod.classList.add("is-shake");
    }, 420);

    window.setTimeout(function () {
      var current = byId[activeId];
      if (current) showQuiz(current);
    }, QUIZ_AFTER_THROW_MS);
  }

  function onPointerDown(event) {
    if (throwLocked) return;
    event.preventDefault();
    drag = {
      pointerId: event.pointerId,
      startY: event.clientY,
      lastY: event.clientY,
    };
    els.seedPod.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event) {
    if (!drag || event.pointerId !== drag.pointerId || throwLocked) return;
    drag.lastY = event.clientY;
    var dy = Math.min(20, event.clientY - drag.startY);
    els.seedPodWrap.style.transform = "translateX(-50%) translateY(" + dy + "px)";
  }

  function onPointerUp(event) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    var dy = drag.lastY - drag.startY;
    drag = null;
    if (dy <= -THROW_DISTANCE) {
      throwPod();
    } else {
      els.seedPodWrap.style.transition = "transform 0.22s ease-out";
      els.seedPodWrap.style.transform = "translateX(-50%)";
      window.setTimeout(function () {
        if (!throwLocked) els.seedPodWrap.style.transition = "";
      }, 220);
    }
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
    if (!window.confirm(content.resetConfirm)) return;
    state = defaultState();
    saveState();
    pendingFinale = false;
    goHome();
    renderBoard();
  });

  els.captureBack.addEventListener("click", goHome);
  els.factsClose.addEventListener("click", function () {
    els.facts.hidden = true;
  });

  els.seedPod.addEventListener("pointerdown", onPointerDown, { passive: false });
  els.seedPod.addEventListener("pointermove", onPointerMove);
  els.seedPod.addEventListener("pointerup", onPointerUp);
  els.seedPod.addEventListener("pointercancel", onPointerUp);

  window.addEventListener("hashchange", route);

  renderBoard();
  route();
})();
