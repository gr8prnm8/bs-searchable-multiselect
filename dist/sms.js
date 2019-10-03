const sms_template_prefix = 'sms-template';

function sort_ul(ul) {
    let items = ul.children();
    items.sort(function (a, b) {
        let keyA = $(a).text();
        let keyB = $(b).text();

        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
    });
    $.each(items, function (i, li) {
        ul.append(li); /* This removes li from the old spot and moves it */
    });
}

function generate_options(sms, sms_select) {
    let not_chosen_list = sms.find('.sms-not-chosen-list');
    let chosen_list = sms.find('.sms-chosen-list');
    let not_chosen_option = not_chosen_list.children('li');
    let chosen_option = chosen_list.children('li');

    sms_select.children('option').each(function () {
        let new_option = '';

        if ($(this).is(':selected')) {
            new_option = chosen_option.clone();
            new_option.appendTo(chosen_list);
        } else {
            new_option = not_chosen_option.clone();
            new_option.appendTo(not_chosen_list);
        }

        new_option.removeClass('sms-default-option');
        new_option.text($(this).text());
        new_option.attr('value', $(this).attr('value'));
        new_option.show();
    });
}

function replace_select_with_sms(select, template) {
    let sms = template.clone();
    let sms_select = select.replaceWith(sms);
    sms_select.hide();
    sms_select.appendTo(sms);
    generate_options(sms, sms_select);
}

function get_template_types(templates) {
    let template_types = [];

    templates.each(function () {
        let classes = $(this).attr('class').split(/\s+/);

        // filter only classes which corresponds to template types
        classes = classes.filter(function (class_name) {
            return class_name.startsWith(sms_template_prefix);
        });

        template_types = template_types.concat(classes);
    });

    return template_types;
}

function generate_all_sms(templates_str) {
    const templates = $('<output>').append($.parseHTML(templates_str));

    const template_types = get_template_types(templates.children());

    let selects = $('.sms-select');

    // generate selects that have defined template
    template_types.forEach(function (template_type) {
        selects.each(function () {
            if ($(this).hasClass(template_type)) {
                replace_select_with_sms($(this), templates.find('.'.concat(template_type)));
            }
        });
        // remove selects with this template type from list of selects
        selects = selects.not('.'.concat(template_type));
    });

    // generate selects that have no template selected
    selects.each(function () {
        replace_select_with_sms($(this), templates.find('.sms-template-default'));
    });


}

function choose_option(option) {
    let sms = option.closest('.sms-searchable-multiselect');
    let chosen_list = sms.find('.sms-chosen-list');
    let select = sms.find('.sms-select');

    //add chosen option to select value
    let chosen_array = select.val();
    chosen_array.push(option.val());
    select.val(chosen_array);

    option.appendTo(chosen_list);
    sort_ul(chosen_list);
}

function discard_option(option) {
    let sms = option.closest('.sms-searchable-multiselect');
    let not_chosen_list = sms.find('.sms-not-chosen-list');
    let select = sms.find('.sms-select');

    //remove chosen option from select value
    let chosen_array = select.val();
    chosen_array.splice(chosen_array.indexOf(option.val()), 1);
    select.val(chosen_array);

    option.appendTo(not_chosen_list);
    sort_ul(not_chosen_list);
}

function filter_option(searched_text, option) {
    if (option.text().indexOf(searched_text) >= 0) {
        if (!option.hasClass('sms-default-option')) {
            option.show();
        }
    } else {
        option.hide();
    }
}

function filter_options(searched_text, sms) {
    let chosen_list = sms.find('.sms-chosen-list');
    let not_chosen_list = sms.find('.sms-not-chosen-list');

    chosen_list.children().each(function () {
        filter_option(searched_text, $(this))
    });
    not_chosen_list.children().each(function () {
        filter_option(searched_text, $(this))
    });
}

function connect_events() {
    $('.sms-not-chosen-list').on('click', 'li', function () {
        choose_option($(this));
    });

    $('.sms-chosen-list').on('click', 'li', function () {
        discard_option($(this));
    });

    $(".sms-search-bar").on("change paste keyup", function () {
        filter_options($(this).val(), $(this).closest('.sms-searchable-multiselect'))
    });
}

$(document).ready(function () {

    if (typeof templates_str === 'undefined') {
        console.warn('WARNING: There is no "templates_str" variable. You should create one by running ' +
            './generate_templates.js and then include it on your page. You could also pass your own version of it. ' +
            'For more information check: https://github.com/gr8prnm8/bs-searchable-multiselect');
    } else {
        generate_all_sms(templates_str);
        connect_events();
    }
});
