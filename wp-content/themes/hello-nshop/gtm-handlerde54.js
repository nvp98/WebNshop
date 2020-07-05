jQuery(function($) {
    const ecomm_pagetype = GTM_VARIABLES.ecomm_pagetype;
    let ecomm_prodid = null;
    let ecomm_totalvalue = null;
    let is_single = false;
    if(ecomm_pagetype == 'product') {
        ecomm_prodid = $('#product-data').data('sku');
        ecomm_totalvalue = $('#product-data').data('price');
        is_single = true;
    }
    else if(ecomm_pagetype == 'cart' || ecomm_pagetype == 'purchase') {
        const prodids = $('#remarketing-data').data('skus');
        const totalvalue = $('#remarketing-data').data('totalvalue');
        ecomm_prodid = prodids;
        ecomm_totalvalue = totalvalue;
    }
    else {
        const prodids = [];
        totalvalue = 0;
        $('.products .product .woocommerce-loop-product__title').each(function() {
            const sku = $(this).data('sku');
            const price = $(this).data('price');
            if(prodids.includes(sku) == false) {
                prodids.push(sku);
                totalvalue += price;
            }
        })
        ecomm_prodid = prodids;
        ecomm_totalvalue = totalvalue;
    }

    dataLayer.push({
        ecomm_prodid,
        ecomm_pagetype,
        ecomm_totalvalue
    })

    const EVENT_NAME_BY_PAGETYPE = {
        home: "view_item_list",
        other: "view_item_list",
        product: "view_item",
        cart: "add_to_cart",
        purchase: "purchase",
        searchresults: "view_search_results",
    };

    const smart_event_items = [];
    if(is_single) {
        smart_event_items.push({
            id: ecomm_prodid,
            google_business_vertical: 'retail'
        })
    } else {
        for(const id of ecomm_prodid) {
            smart_event_items.push({
                id,
                google_business_vertical: 'retail'
            })
        }
    }

    dataLayer.push({
        smart_event_name: EVENT_NAME_BY_PAGETYPE[ecomm_pagetype],
        smart_event_value: ecomm_totalvalue,
        smart_event_items
    })

    if($('#conversion-track-data').length > 0) {
        const conversion_data = $('#conversion-track-data').data('conversion');
        const transaction_data = $('#conversion-track-data').data('transaction');
        dataLayer.push(conversion_data);
        dataLayer.push(transaction_data);
    }
})