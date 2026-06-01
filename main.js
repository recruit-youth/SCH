/* ===========================
   株式会社SCH - メインスクリプト
   =========================== */

// ===========================
// ヘッダースクロール
// ===========================
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
});

// ===========================
// ハンバーガーメニュー
// ===========================
const hamburger = document.getElementById('hamburger');
const globalNav = document.getElementById('global-nav');

hamburger.addEventListener('click', () => {
  const isOpen = globalNav.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

globalNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    globalNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// ===========================
// スクロールアニメーション（Intersection Observer）
// ===========================
const animTargets = document.querySelectorAll(
  '.fade-up, .fade-left, .fade-right, .fade-scale'
);

const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // 一度表示したら監視解除
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

animTargets.forEach(el => animObserver.observe(el));

// ===========================
// ヒーローのタイピングアニメーション
// ===========================
const heroTitle = document.querySelector('.hero h1');
if (heroTitle) {
  heroTitle.style.opacity = '0';
  heroTitle.style.transform = 'translateY(20px)';
  heroTitle.style.transition = 'opacity 1s ease 0.4s, transform 1s ease 0.4s';
  setTimeout(() => {
    heroTitle.style.opacity = '1';
    heroTitle.style.transform = 'none';
  }, 100);
}

const heroDesc = document.querySelector('.hero-desc');
if (heroDesc) {
  heroDesc.style.opacity = '0';
  heroDesc.style.transform = 'translateY(16px)';
  heroDesc.style.transition = 'opacity 0.9s ease 0.9s, transform 0.9s ease 0.9s';
  setTimeout(() => {
    heroDesc.style.opacity = '1';
    heroDesc.style.transform = 'none';
  }, 100);
}

const heroActions = document.querySelector('.hero-actions');
if (heroActions) {
  heroActions.style.opacity = '0';
  heroActions.style.transform = 'translateY(12px)';
  heroActions.style.transition = 'opacity 0.9s ease 1.3s, transform 0.9s ease 1.3s';
  setTimeout(() => {
    heroActions.style.opacity = '1';
    heroActions.style.transform = 'none';
  }, 100);
}

// ===========================
// サービスカードホバーパーティクル（軽量版）
// ===========================
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
  });
});

// ===========================
// 数字カウントアップ（reason-card の num）
// ===========================
function animateCount(el, target, duration = 1200) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = String(target).padStart(2, '0');
      clearInterval(timer);
    } else {
      el.textContent = String(Math.floor(start)).padStart(2, '0');
    }
  }, 16);
}

const numObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target || el.textContent, 10);
      animateCount(el, target);
      numObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.reason-card .num').forEach((el, i) => {
  el.dataset.target = i + 1;
  numObserver.observe(el);
});

// ===========================
// フローステップのウェーブアニメーション
// ===========================
const flowObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const steps = document.querySelectorAll('.flow-step');
      steps.forEach((step, i) => {
        setTimeout(() => {
          step.classList.add('visible');
        }, i * 150);
      });
      flowObserver.disconnect();
    }
  });
}, { threshold: 0.2 });

const flowSection = document.querySelector('.flow-steps');
if (flowSection) flowObserver.observe(flowSection);

// ===========================
// お問い合わせフォーム送信
// ===========================
const contactForm = document.getElementById('contact-form');
const formFields  = document.getElementById('form-fields');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送信中...';

    const data = {
      name:     document.getElementById('name').value,
      company:  document.getElementById('company').value,
      email:    document.getElementById('email').value,
      tel:      document.getElementById('tel').value,
      category: document.getElementById('category').value,
      message:  document.getElementById('message').value,
      submitted_at: new Date().toISOString()
    };

    try {
      await fetch('../tables/sch_contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.error('API save error:', err);
    }

    // 成功画面に切り替え
    formFields.style.opacity = '0';
    formFields.style.transform = 'translateY(10px)';
    formFields.style.transition = 'opacity 0.4s, transform 0.4s';
    setTimeout(() => {
      formFields.style.display = 'none';
      formSuccess.style.display = 'block';
      formSuccess.style.opacity = '0';
      formSuccess.style.transform = 'translateY(10px)';
      formSuccess.style.transition = 'opacity 0.5s, transform 0.5s';
      setTimeout(() => {
        formSuccess.style.opacity = '1';
        formSuccess.style.transform = 'none';
      }, 50);
    }, 400);

    contactForm.reset();
  });
}

// ===========================
// スムーズスクロール（アンカーリンク）
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72; // ヘッダー高さ
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
