<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Liability Waiver</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; background:#0b0b0b; color:#f2f2f2; }
    .wrap { max-width: 900px; margin: 0 auto; padding: 24px; }
    .card { background:#141414; border:1px solid #2a2a2a; border-radius: 16px; padding: 18px; }
    h1 { margin: 0 0 10px; font-size: 26px; }
    h2 { margin: 18px 0 8px; font-size: 18px; }
    p, li, label { color:#d6d6d6; line-height: 1.4; }
    .muted { color:#a7a7a7; font-size: 13px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    @media (max-width: 720px){ .grid{ grid-template-columns: 1fr; } }
    input, select, textarea {
      width: 100%; padding: 10px 12px; border-radius: 10px;
      border: 1px solid #2a2a2a; background:#0e0e0e; color:#f2f2f2;
      box-sizing: border-box;
    }
    .row { margin-top: 10px; }
    .waiver-box {
      height: 260px; overflow: auto; padding: 12px; border-radius: 12px;
      border: 1px solid #2a2a2a; background:#0e0e0e;
    }
    .hr { height:1px; background:#2a2a2a; margin: 16px 0; }
    .pill { display:inline-block; padding: 6px 10px; border-radius: 999px; border:1px solid #2a2a2a; background:#101010; }
    .error { color:#ff8080; margin-top: 10px; }
    .success { color:#9fffb0; margin-top: 10px; }
    button {
      width: 100%; margin-top: 14px; padding: 12px 14px; border: 0; border-radius: 12px;
      background: #1f7a4a; color:#fff; font-size: 16px; cursor: pointer;
    }
    button:disabled { opacity: .5; cursor: not-allowed; }
    .inline { display:flex; gap:10px; align-items:flex-start; }
    .inline input[type="checkbox"], .inline input[type="radio"] { width:auto; margin-top: 3px; }
    .note { font-size: 13px; color:#bdbdbd; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <h1>Off-Road Vehicle Use & Liability Waiver</h1>
      <div class="muted">
        This form is required prior to vehicle use, rentals, guided expeditions, trail travel, or related activities.
      </div>

      <div class="hr"></div>

      <h2>Participant Information</h2>
      <div class="grid">
        <div class="row">
          <label>Full Legal Name</label>
          <input id="fullName" name="fullName" autocomplete="name" required />
        </div>
        <div class="row">
          <label>Phone Number</label>
          <input id="phone" name="phone" autocomplete="tel" required />
        </div>
        <div class="row">
          <label>Email</label>
          <input id="email" name="email" type="email" autocomplete="email" required />
        </div>
        <div class="row">
          <label>Date of Birth</label>
          <input id="dob" name="dob" type="date" required />
        </div>
      </div>

      <div class="row">
        <label>Driver License / State ID (optional but recommended)</label>
        <input id="license" name="license" placeholder="DL Number + State (e.g., AK 1234567)" />
      </div>

      <div class="hr"></div>

      <h2>Waiver Text</h2>
      <div class="waiver-box" id="waiverText" tabindex="0" aria-label="Waiver text">
        <p><strong>Alaska Offroad Expedition / Alaska Offroad Expeditions</strong> (“Company”)</p>

        <p><strong>1. Acknowledgment of Risk</strong><br/>
        I acknowledge and understand that participation in off-road driving, guided expeditions, vehicle rentals, trail travel, and related activities involves inherent risks, including but not limited to vehicle rollovers or collisions, mechanical failures, terrain hazards (rocks, mud, snow, water crossings, steep grades), remote travel with limited emergency access, and injury, death, or property damage. I voluntarily choose to participate and fully accept all risks, whether known or unknown.</p>

        <p><strong>2. Release of Liability</strong><br/>
        To the fullest extent permitted by law, I release, waive, discharge, and hold harmless the Company, its owner(s), employees, guides, contractors, volunteers, and representatives from any and all claims, demands, damages, losses, or causes of action arising out of or related to my participation, including but not limited to personal injury, death, property damage, or financial loss, whether caused by negligence or otherwise.</p>

        <p><strong>3. Assumption of Responsibility</strong><br/>
        I acknowledge that I am solely responsible for my actions while operating or occupying any vehicle. I agree to follow all safety instructions and guidelines, operate vehicles responsibly and within my skill level, and accept full responsibility for any damage caused by my actions.</p>

        <p><strong>4. Vehicle Damage & Financial Responsibility</strong><br/>
        I understand and agree that I am financially responsible for any damage caused to vehicles, equipment, property, or third parties as a result of my actions. The Company is not responsible for personal property loss or damage.</p>

        <p><strong>5. Insurance Responsibility</strong><br/>
        I understand that I must either provide my own valid insurance information (if applicable) or elect the Company insurance option and pay the required fee. I understand I may still be responsible for damage, misuse, negligence, exclusions, limitations, or deductibles that are not covered.</p>

        <p><strong>6. Indemnification</strong><br/>
        I agree to defend, indemnify, and hold harmless the Company from any claims, costs, attorney fees, or damages arising from my participation or actions.</p>

        <p><strong>7. Medical Authorization</strong><br/>
        I authorize the Company to obtain emergency medical treatment on my behalf if necessary and agree that all medical costs are my responsibility.</p>

        <p><strong>8. Governing Law</strong><br/>
        This agreement shall be governed by and interpreted under the laws of the State of Alaska.</p>

        <p><strong>9. Agreement & Electronic Signature</strong><br/>
        By signing electronically, I confirm I have read and fully understand this waiver, I am signing voluntarily, and this agreement is legally binding and enforceable.</p>
      </div>

      <div class="hr"></div>

      <h2>Insurance Selection</h2>

      <div class="row inline">
        <input type="radio" id="insA" name="insuranceChoice" value="personal" />
        <label for="insA">
          <strong>Option A — Personal Auto Insurance</strong><br/>
          <span class="note">I confirm I have valid insurance and accept responsibility for claims, deductibles, and uncovered damages.</span>
        </label>
      </div>

      <div id="personalInsuranceFields" style="display:none; margin-top:10px;">
        <div class="grid">
          <div class="row">
            <label>Insurance Provider</label>
            <input id="provider" name="provider" />
          </div>
          <div class="row">
            <label>Policy Number</label>
            <input id="policyNumber" name="policyNumber" />
          </div>
          <div class="row">
            <label>Policy Expiration Date</label>
            <input id="policyExp" name="policyExp" type="date" />
          </div>
          <div class="row">
            <label>Policy Holder Name (if different)</label>
            <input id="policyHolder" name="policyHolder" />
          </div>
        </div>
      </div>

      <div class="row inline" style="margin-top:12px;">
        <input type="radio" id="insB" name="insuranceChoice" value="company" />
        <label for="insB">
          <strong>Option B — Company Insurance Coverage (+$500)</strong><br/>
          <span class="note">I elect the Company option and agree to pay the $500 upcharge. I understand coverage may have limitations and I may still be responsible for damages not covered.</span>
        </label>
      </div>

      <div id="companyInsuranceFields" style="display:none; margin-top:10px;">
        <div class="pill">Insurance Upcharge: <strong>$500</strong></div>
        <div class="row inline" style="margin-top:10px;">
          <input type="checkbox" id="agree500" />
          <label for="agree500"><strong>I agree to pay the $500 insurance upcharge.</strong></label>
        </div>
      </div>

      <div class="hr"></div>

      <h2>Damage Responsibility Acknowledgment</h2>
      <div class="row inline">
        <input type="checkbox" id="damageAck" />
        <label for="damageAck">
          <strong>I agree that I am financially responsible for any damage caused by the driver/participant.</strong>
        </label>
      </div>

      <h2>Signature & Agreement</h2>
      <div class="row inline">
        <input type="checkbox" id="agreeAll" />
        <label for="agreeAll"><strong>I AGREE TO ALL TERMS OF THIS LIABILITY WAIVER.</strong></label>
      </div>

      <div class="grid" style="margin-top:10px;">
        <div class="row">
          <label>Typed Signature (Full Legal Name)</label>
          <input id="typedSignature" name="typedSignature" required />
          <div class="muted">Must match the Full Legal Name above.</div>
        </div>
        <div class="row">
          <label>Date</label>
          <input id="signDate" name="signDate" type="date" required />
        </div>
      </div>

      <div class="row">
        <label>Optional Notes (medical concerns, special considerations, etc.)</label>
        <textarea id="notes" name="notes" rows="3" placeholder="Optional"></textarea>
      </div>

      <div id="msg" class="error" style="display:none;"></div>

      <button id="submitBtn" type="button">Submit Waiver & Continue</button>

      <div class="muted" style="margin-top:10px;">
        By submitting, you consent to electronic records and signature. Your submission should be stored with timestamp and IP address on the server.
      </div>
    </div>
  </div>

  <script>
    // Set default date to today
    const today = new Date();
    const iso = today.toISOString().slice(0,10);
    document.getElementById("signDate").value = iso;

    const personalFields = document.getElementById("personalInsuranceFields");
    const companyFields = document.getElementById("companyInsuranceFields");

    function showHideInsurance() {
      const choice = document.querySelector('input[name="insuranceChoice"]:checked')?.value;
      personalFields.style.display = (choice === "personal") ? "block" : "none";
      companyFields.style.display = (choice === "company") ? "block" : "none";
    }

    document.getElementById("insA").addEventListener("change", showHideInsurance);
    document.getElementById("insB").addEventListener("change", showHideInsurance);

    function showError(text) {
      const msg = document.getElementById("msg");
      msg.textContent = text;
      msg.className = "error";
      msg.style.display = "block";
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }

    function showSuccess(text) {
      const msg = document.getElementById("msg");
      msg.textContent = text;
      msg.className = "success";
      msg.style.display = "block";
    }

    function isBlank(v){ return !v || !String(v).trim(); }

    document.getElementById("submitBtn").addEventListener("click", async () => {
      document.getElementById("msg").style.display = "none";

      const data = {
        fullName: document.getElementById("fullName").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        dob: document.getElementById("dob").value,
        license: document.getElementById("license").value,
        insuranceChoice: document.querySelector('input[name="insuranceChoice"]:checked')?.value || "",
        personalInsurance: {
          provider: document.getElementById("provider").value,
          policyNumber: document.getElementById("policyNumber").value,
          policyExp: document.getElementById("policyExp").value,
          policyHolder: document.getElementById("policyHolder").value,
        },
        companyInsurance: {
          agree500: document.getElementById("agree500").checked
        },
        damageAck: document.getElementById("damageAck").checked,
        agreeAll: document.getElementById("agreeAll").checked,
        typedSignature: document.getElementById("typedSignature").value,
        signDate: document.getElementById("signDate").value,
        notes: document.getElementById("notes").value,
        waiverVersion: "1.0",
      };

      // Validation
      if (isBlank(data.fullName)) return showError("Please enter your Full Legal Name.");
      if (isBlank(data.phone)) return showError("Please enter your phone number.");
      if (isBlank(data.email)) return showError("Please enter your email.");
      if (isBlank(data.dob)) return showError("Please enter your date of birth.");

      if (!data.insuranceChoice) return showError("Please select an insurance option (Option A or Option B).");

      if (data.insuranceChoice === "personal") {
        if (isBlank(data.personalInsurance.provider)) return showError("Please enter your Insurance Provider.");
        if (isBlank(data.personalInsurance.policyNumber)) return showError("Please enter your Policy Number.");
        if (isBlank(data.personalInsurance.policyExp)) return showError("Please enter your Policy Expiration Date.");
      }

      if (data.insuranceChoice === "company") {
        if (!data.companyInsurance.agree500) return showError("Please confirm you agree to pay the $500 insurance upcharge.");
      }

      if (!data.damageAck) return showError("Please confirm you accept financial responsibility for damages caused by the driver/participant.");
      if (!data.agreeAll) return showError("You must agree to all terms of the waiver to continue.");

      if (isBlank(data.typedSignature)) return showError("Please type your full legal name as your signature.");
      if (data.typedSignature.trim().toLowerCase() !== data.fullName.trim().toLowerCase()) {
        return showError("Typed Signature must match Full Legal Name.");
      }

      if (isBlank(data.signDate)) return showError("Please select the signature date.");

      // Submit to your server
      // IMPORTANT: Replace "/api/waiver-submit" with YOUR endpoint.
      // Your endpoint should store: payload + timestamp + IP address + user agent.
      try {
        const res = await fetch("/api/waiver-submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const t = await res.text().catch(() => "");
          return showError("Submission failed. Please double-check your info and try again. " + (t ? ("(" + t + ")") : ""));
        }

        showSuccess("Waiver submitted successfully. You may now continue.");

        // Optional redirect after success:
        // window.location.href = "/checkout";
      } catch (err) {
        showError("Network error. Please try again.");
      }
    });
  </script>
</body>
</html>
