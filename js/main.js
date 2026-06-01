// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Fade-in on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.about, .skills, .projects, .experience, .certifications, .contact').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(el);
});

// ========================================
// CERTIFICATE MODAL
// ========================================
function openCertModal(pdfPath) {
    document.getElementById('certIframe').src = pdfPath;
    document.getElementById('certModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCertModal() {
    document.getElementById('certModal').classList.remove('active');
    document.getElementById('certIframe').src = '';
    document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCertModal();
});

// ========================================
// CONTACT FORM
// ========================================
const contactForm = document.getElementById('contactForm');
const formStatus  = document.getElementById('formStatus');

function showStatus(type, html) {
    formStatus.innerHTML = html;
    formStatus.className = 'form-status ' + type;
    formStatus.style.display = 'block';
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name    = contactForm.querySelector('input[name="name"]').value.trim();
        const email   = contactForm.querySelector('input[name="email"]').value.trim();
        const message = contactForm.querySelector('textarea[name="message"]').value.trim();
        const btn     = contactForm.querySelector('.btn-submit');
        const btnText = btn.textContent;

        formStatus.className = 'form-status';
        formStatus.style.display = 'none';

        if (!name) { showStatus('error', '⚠ Please enter your name.'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showStatus('error', '⚠ Please enter a valid email.'); return; }
        if (message.length < 10) { showStatus('error', '⚠ Message too short (min 10 characters).'); return; }

        btn.textContent = 'Sending…';
        btn.disabled = true;

        const phTime = new Intl.DateTimeFormat('en-PH', {
            timeZone: 'Asia/Manila',
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        }).format(new Date());

        const formData = new FormData(contactForm);
        formData.append('philippine_time', phTime);

        try {
            const res = await fetch(contactForm.action, {
                method: 'POST', body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                showStatus('success', '✓ Message sent! I\'ll get back to you soon.');
                contactForm.reset();
                setTimeout(() => { formStatus.style.display = 'none'; }, 8000);
            } else {
                const data = await res.json();
                const msg = data.errors ? data.errors.map(e => e.message).join(', ') : 'Something went wrong.';
                showStatus('error', '⚠ ' + msg);
            }
        } catch {
            showStatus('error', '⚠ Network error. Please check your connection.');
        } finally {
            btn.textContent = btnText;
            btn.disabled = false;
        }
    });
}