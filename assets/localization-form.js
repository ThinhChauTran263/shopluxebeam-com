/**
 * Localization Form Handler
 * Simplified version for LuxeBeam theme
 */

class LocalizationForm extends HTMLElement {
  constructor() {
    super();
    this.elements = {
      input: this.querySelector('input[name="language_code"], input[name="country_code"]'),
      button: this.querySelector('button'),
      panel: this.querySelector('.disclosure__list-wrapper, .localization-form__select')
    };
    
    // Initialize event listeners
    this.init();
  }

  init() {
    // Button click handler
    if (this.elements.button) {
      this.elements.button.addEventListener('click', this.openSelector.bind(this));
    }

    // Keyboard navigation
    this.addEventListener('keyup', this.onContainerKeyUp.bind(this));

    // Item selection
    this.querySelectorAll('a, button[data-value]').forEach(item => {
      item.addEventListener('click', this.onItemClick.bind(this));
    });

    // Language select change
    const languageSelect = this.querySelector('select[name="language_code"]');
    if (languageSelect) {
      languageSelect.addEventListener('change', this.onLanguageChange.bind(this));
    }

    // Country select change  
    const countrySelect = this.querySelector('select[name="country_code"]');
    if (countrySelect) {
      countrySelect.addEventListener('change', this.onCountryChange.bind(this));
    }
  }

  hidePanel() {
    if (this.elements.button) {
      this.elements.button.setAttribute('aria-expanded', 'false');
    }
    if (this.elements.panel) {
      this.elements.panel.setAttribute('hidden', true);
    }
  }

  onContainerKeyUp(event) {
    if (event.code.toUpperCase() !== 'ESCAPE') return;

    this.hidePanel();
    if (this.elements.button) {
      this.elements.button.focus();
    }
  }

  onItemClick(event) {
    event.preventDefault();
    const form = this.querySelector('form');
    const value = event.currentTarget.dataset.value;
    
    if (this.elements.input && value) {
      this.elements.input.value = value;
    }
    
    if (form) {
      form.submit();
    }
  }

  onLanguageChange(event) {
    const form = this.querySelector('form');
    if (form) {
      form.submit();
    }
  }

  onCountryChange(event) {
    const form = this.querySelector('form');
    if (form) {
      form.submit();
    }
  }

  openSelector() {
    if (this.elements.button) {
      this.elements.button.focus();
    }
    
    if (this.elements.panel) {
      this.elements.panel.toggleAttribute('hidden');
      const isExpanded = !this.elements.panel.hasAttribute('hidden');
      
      if (this.elements.button) {
        this.elements.button.setAttribute('aria-expanded', isExpanded.toString());
      }
    }
  }
}

// Register custom element
if (!customElements.get('localization-form')) {
  customElements.define('localization-form', LocalizationForm);
}

// Legacy support for older browsers
document.addEventListener('DOMContentLoaded', function() {
  // Initialize localization forms that aren't custom elements
  const forms = document.querySelectorAll('.localization-form:not(localization-form)');
  forms.forEach(form => {
    const button = form.querySelector('button, .localization-selector__button');
    const panel = form.querySelector('.localization-selector__list, .disclosure__list-wrapper');
    
    if (button && panel) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const isHidden = panel.hasAttribute('hidden') || panel.style.display === 'none';
        
        if (isHidden) {
          panel.removeAttribute('hidden');
          panel.style.display = 'block';
          button.setAttribute('aria-expanded', 'true');
        } else {
          panel.setAttribute('hidden', '');
          panel.style.display = 'none';
          button.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Handle item clicks
    form.querySelectorAll('a[data-value], button[data-value]').forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        const formElement = form.querySelector('form');
        const input = form.querySelector('input[name="language_code"], input[name="country_code"]');
        
        if (input && this.dataset.value) {
          input.value = this.dataset.value;
        }
        
        if (formElement) {
          formElement.submit();
        }
      });
    });
  });
});