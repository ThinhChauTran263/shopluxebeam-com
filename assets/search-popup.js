// Search Popup JavaScript
// Handles product search functionality with highlighting and filtering

function createProductCard(product) {
  const title = product.title || 'Product';
  const handle = product.handle || '#';
  
  // Get search query for highlighting
  const searchQuery = document.getElementById('searchInput')?.value.trim().toLowerCase() || '';
  
  // Highlight search term in title
  let displayTitle = title;
  if (searchQuery && searchQuery.length > 0) {
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    displayTitle = title.replace(regex, '<mark>$1</mark>');
  }
  
  // Handle images
  let imageUrl = '';
  
  if (product.featured_image) {
    imageUrl = product.featured_image;
  } else if (product.image) {
    imageUrl = product.image;
  } else if (product.images && product.images.length > 0) {
    imageUrl = product.images[0];
  } else if (product.featured_media && product.featured_media.preview_image) {
    imageUrl = product.featured_media.preview_image.src;
  }
  
  // Handle image URL formats
  if (imageUrl) {
    if (typeof imageUrl === 'object' && imageUrl.src) {
      imageUrl = imageUrl.src;
    }
    
    if (typeof imageUrl === 'string') {
      const baseUrl = imageUrl.split('?')[0];
      imageUrl = baseUrl + '?width=200';
    } else {
      imageUrl = '';
    }
  }
  
  if (!imageUrl) {
    imageUrl = 'data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23f5f5f5"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
  }
  
  // Handle pricing
  let price = '$0.00';
  let comparePrice = null;
  
  if (product.price !== undefined && product.price !== null) {
    if (typeof product.price === 'number') {
      price = '$' + (product.price / 100).toFixed(2);
    } else if (typeof product.price === 'string') {
      price = product.price.includes('$') ? product.price : '$' + product.price;
    }
  } else if (product.price_min !== undefined && product.price_min !== null) {
    if (typeof product.price_min === 'number') {
      price = '$' + (product.price_min / 100).toFixed(2);
    } else {
      price = '$' + product.price_min;
    }
  } else if (product.variants && product.variants.length > 0 && product.variants[0].price) {
    const variantPrice = product.variants[0].price;
    if (typeof variantPrice === 'number') {
      price = '$' + (variantPrice / 100).toFixed(2);
    } else {
      price = '$' + variantPrice;
    }
  }
  
  // Handle compare at price
  const compareAtPrice = product.compare_at_price || product.compare_at_price_max || 
                        (product.variants && product.variants[0] && product.variants[0].compare_at_price);
  
  if (compareAtPrice) {
    const priceValue = product.price || product.price_min || (product.variants && product.variants[0] && product.variants[0].price);
    if (compareAtPrice > priceValue) {
      if (typeof compareAtPrice === 'number') {
        comparePrice = '$' + (compareAtPrice / 100).toFixed(2);
      } else {
        comparePrice = compareAtPrice.includes('$') ? compareAtPrice : '$' + compareAtPrice;
      }
    }
  }

  return `
    <div class="product-card" onclick="goToProduct('${handle}')">
      <img src="${imageUrl}" alt="${title}" class="product-image" loading="lazy" width="200" height="180">
      <div class="product-info">
        <h4 class="product-title">${displayTitle}</h4>
        <div class="product-price">
          <span class="current-price">${price}</span>
          ${comparePrice ? `<span class="original-price">${comparePrice}</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

// Export for use in header
window.createProductCard = createProductCard;
