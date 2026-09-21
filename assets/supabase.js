/*
 * 리맵 효심케어서비스 — Supabase 연동
 *
 * 아래 두 값은 공개되어도 안전한 publishable 키다. 실제 접근 통제는
 * Postgres RLS 정책이 담당한다 (consultations: anon은 INSERT만, SELECT 불가).
 */
const SUPABASE_URL = "https://phgncxgtcclhlclqfyjy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_4_ADz06zVLYMqFLbqGbZnw_WxCw5B6k";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

function showBox(id) {
  document.getElementById(id).classList.remove("hidden");
}

function hideBox(id) {
  document.getElementById(id).classList.add("hidden");
}

function value(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("hyosim-inquiry-form");
  if (!form) return;

  const button = form.querySelector('button[type="submit"]');
  const buttonLabel = button ? button.querySelector("span:last-child") : null;
  const originalLabel = buttonLabel ? buttonLabel.textContent : "";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideBox("submit-success-box");
    hideBox("submit-error-box");

    if (button) button.disabled = true;
    if (buttonLabel) buttonLabel.textContent = "접수 중...";

    // 로그인한 회원이 신청하면 본인 신청으로 묶어 둔다
    const { data: session } = await db.auth.getSession();
    const userId = session && session.session ? session.session.user.id : null;

    const { error } = await db.from("consultations").insert({
      user_id: userId,
      name: value("applicant-name"),
      phone: value("applicant-phone"),
      region: value("parent-region"),
      email: value("applicant-email") || null,
      care_note: value("care-note") || null,
      privacy_agreed: document.getElementById("privacy-agree").checked,
      source: "web",
    });

    if (button) button.disabled = false;
    if (buttonLabel) buttonLabel.textContent = originalLabel;

    if (error) {
      console.error("상담신청 저장 실패:", error);
      showBox("submit-error-box");
      return;
    }

    form.reset();
    showBox("submit-success-box");
  });
});
