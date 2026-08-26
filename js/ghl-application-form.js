(function () {
  var WEBHOOK_URL =
    "https://services.leadconnectorhq.com/hooks/yRoezXR4YpDB8gOpnmgS/webhook-trigger/53ffff8d-91ec-4bfb-abd4-dd42e64f0f67";
  var FORM_ID = "wf-form-Application-Form";

  function trim(value) {
    return String(value || "").trim();
  }

  function payloadFromForm(form) {
    var data = new FormData(form);
    return {
      formName: form.getAttribute("data-name") || "Application Form",
      pageId: form.getAttribute("data-wf-page-id") || "",
      elementId: form.getAttribute("data-wf-element-id") || "",
      domain:
        document.documentElement.getAttribute("data-wf-domain") ||
        window.location.hostname,
      sourceUrl: window.location.href,
      test: false,
      dolphin: false,
      fullName: trim(data.get("name")),
      email: trim(data.get("email")),
      phone: trim(data.get("Phone")),
      website: trim(data.get("Website")),
      revenue: data.get("Revenue") || "",
      budget: data.get("Budget") || "",
      comments: trim(data.get("Comments")),
    };
  }

  function formWrap(form) {
    return form.parentElement;
  }

  function showDone(form) {
    var wrap = formWrap(form);
    form.style.display = "none";
    var done = wrap.querySelector(".w-form-done");
    var fail = wrap.querySelector(".w-form-fail");
    if (done) done.style.display = "block";
    if (fail) fail.style.display = "none";
  }

  function showFail(form) {
    var fail = formWrap(form).querySelector(".w-form-fail");
    if (fail) fail.style.display = "block";
  }

  function hideFail(form) {
    var fail = formWrap(form).querySelector(".w-form-fail");
    if (fail) fail.style.display = "none";
  }

  function setWaiting(button, waiting) {
    if (!button) return;
    if (waiting) {
      if (!button.getAttribute("data-original-value")) {
        button.setAttribute("data-original-value", button.value);
      }
      button.value = button.getAttribute("data-wait") || "Please wait...";
      button.disabled = true;
    } else {
      button.value = button.getAttribute("data-original-value") || "Submit";
      button.disabled = false;
    }
  }

  function postJson(body) {
    var json = JSON.stringify(body);

    return fetch(WEBHOOK_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res;
    }).catch(function () {
      // Simple request: no CORS preflight. Opaque response still means the
      // POST left the browser; HighLevel inbound webhooks do not return ACAO.
      return fetch(WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: json,
      });
    });
  }

  function onSubmit(event) {
    var form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === "function") {
      event.stopImmediatePropagation();
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var button = form.querySelector('input[type="submit"]');
    setWaiting(button, true);
    hideFail(form);

    postJson(payloadFromForm(form))
      .then(function () {
        showDone(form);
      })
      .catch(function () {
        setWaiting(button, false);
        showFail(form);
      });
  }

  function init() {
    var form = document.getElementById(FORM_ID);
    if (!form) return;
    form.setAttribute("data-wf-ignore", "true");
    form.addEventListener("submit", onSubmit, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
