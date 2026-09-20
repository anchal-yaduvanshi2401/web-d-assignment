// Campus Placement & Internship Management System - Client Side JS

document.addEventListener('DOMContentLoaded', () => {
  // 1. Auto-dismiss flash alerts after 6 seconds
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach((alert) => {
    const timer = setTimeout(() => {
      alert.style.transition = 'opacity 0.5s ease';
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 500);
    }, 6000);

    const closeBtn = alert.querySelector('.alert-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        clearTimeout(timer);
        alert.remove();
      });
    }
  });

  // 2. Confirmation before deleting drives
  const deleteForms = document.querySelectorAll('.form-delete-confirm');
  deleteForms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      const company = form.getAttribute('data-company') || 'this drive';
      const confirmed = window.confirm(
        `Are you sure you want to delete ${company}? All student applications associated with it will also be deleted. This action cannot be undone.`
      );
      if (!confirmed) {
        e.preventDefault();
      }
    });
  });

  // 3. Status update instant submit handler if select has data-auto-submit
  const autoSelects = document.querySelectorAll('select[data-auto-submit="true"]');
  autoSelects.forEach((select) => {
    select.addEventListener('change', () => {
      select.closest('form').submit();
    });
  });
});
