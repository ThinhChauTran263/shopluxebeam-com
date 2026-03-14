// Auto-submit cart form when quantity changes
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('input[name="updates[]"]').forEach(input => {
    input.addEventListener('change', function() {
      this.closest('form').submit();
    });
  });
});
