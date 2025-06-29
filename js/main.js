(function ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Vendor carousel
    $('.vendor-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:2
            },
            576:{
                items:3
            },
            768:{
                items:4
            },
            992:{
                items:5
            },
            1200:{
                items:6
            }
        }
    });


    // Related carousel
    $('.related-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:2
            },
            768:{
                items:3
            },
            992:{
                items:4
            }
        }
    });


    // Product Quantity
    $('.quantity button').on('click', function () {
        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        if (button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        button.parent().parent().find('input').val(newVal);
    });
    
})(jQuery);

async function updateCartQuantity() {
  const username = localStorage.getItem('username');
  const elements = document.querySelectorAll('.cartquantity');

  if (!username) {
    elements.forEach(el => el.textContent = '0');
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/cart?username=${encodeURIComponent(username)}`);
    const cart = await res.json();
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

    elements.forEach(el => el.textContent = totalQuantity);
  } catch (error) {
    console.error('โหลดจำนวนสินค้าในตะกร้าล้มเหลว:', error);
    elements.forEach(el => el.textContent = '0');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartQuantity();
});

async function quickAddToCart(productId, category) {
  const username = localStorage.getItem('username');
  if (!username) {
    alert('โปรด login');
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/products/${category}/${productId}`);
    if (!res.ok) throw new Error('โหลดสินค้าล้มเหลว');
    const product = await res.json();

    const firstOption = product.prices?.[0];
    if (!firstOption) {
      alert('ไม่มีราคาสินค้าให้เลือก');
      return;
    }

    const data = {
      username: username,
      id: productId,
      productname: product.name,
      price: firstOption.salePrice,
      quantity: 1,
      image: product.image,
      category: category,
      option: firstOption.value
    };

    const cartRes = await fetch('http://localhost:5000/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!cartRes.ok) {
      const errData = await cartRes.json();
      throw new Error(errData.error || 'เพิ่มสินค้าลงตะกร้าไม่สำเร็จ');
    }

    alert('เพิ่มสินค้าเรียบร้อยแล้ว');
  } catch (err) {
    console.error('Quick Add Error:', err);
    alert('เกิดข้อผิดพลาด: ' + err.message);
  }
}





