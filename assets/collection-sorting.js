// Collection sorting functionality
document.addEventListener('DOMContentLoaded', function() {
  const sortSelect = document.getElementById('sort-by');
  
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      const url = new URL(window.location);
      url.searchParams.set('sort_by', this.value);
      window.location.href = url.toString();
    });
  }
});
