const sms_template_prefix = 'sms-template';
const sms_max_rows = 5;

function generate_option(template, real_option) {
    let option = template.clone();
    option.removeClass('sms-default-option');
    option.text(real_option.text());
    option.attr('value', real_option.attr('value'));
    option.show();
    return option;
}

function generate_options(sms, sms_select) {
    let not_chosen_list = sms.find('.sms-not-chosen-list');
    let chosen_list = sms.find('.sms-chosen-list');
    let not_chosen_option_template = not_chosen_list.children('li');
    let chosen_option_template = chosen_list.children('li');

    sms_select.children('option').each(function () {
        let new_chosen_option = generate_option(chosen_option_template, $(this));
        let new_not_chosen_option = generate_option(not_chosen_option_template, $(this));
        new_chosen_option.appendTo(chosen_list);
        new_not_chosen_option.appendTo(not_chosen_list);

        if ($(this).is(':selected')) {
            new_not_chosen_option.hide();
            new_chosen_option.addClass('sms-visible-option');
        } else {
            new_chosen_option.hide();
            new_not_chosen_option.addClass('sms-visible-option');
        }
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

    // set max-height if provided
    if (typeof sms_max_rows !== 'undefined') {
        templates.find('.sms-chosen-list, .sms-not-chosen-list').each(function () {
            $(this).css('max-height', (sms_max_rows*3+0.3).toString().concat('em'));
        });
    }

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

function toggle_option(option) {

    let sms = option.closest('.sms-searchable-multiselect');
    let chosen_list = sms.find('.sms-chosen-list');
    let not_chosen_list = sms.find('.sms-not-chosen-list');
    let select = sms.find('.sms-select');
    let option_val = option.val();

    //get array of values chosen in real select
    let chosen_array = select.val();

    if (option.parent().hasClass('sms-not-chosen-list')) {

        chosen_array.push(option_val);
        chosen_list.find(`[value='${option_val}']`).show();
        chosen_list.find(`[value='${option_val}']`).addClass('sms-visible-option');

    } else if (option.parent().hasClass('sms-chosen-list')) {

        //remove chosen option from select value
        chosen_array.splice(chosen_array.indexOf(option.val()), 1);
        not_chosen_list.find(`[value='${option_val}']`).show();
        not_chosen_list.find(`[value='${option_val}']`).addClass('sms-visible-option');

    }

    option.hide();
    option.removeClass('sms-visible-option');

    //save values to real select
    select.val(chosen_array);
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
    let chosen_visible_options = sms.find('.sms-chosen-list > .sms-visible-option');
    let not_chosen_visible_options = sms.find('.sms-not-chosen-list > .sms-visible-option');

    chosen_visible_options.each(function () {
        filter_option(searched_text, $(this))
    });
    not_chosen_visible_options.each(function () {
        filter_option(searched_text, $(this))
    });
}

function connect_events() {
    $('.sms-not-chosen-list').on('click', 'li', function () {
        toggle_option($(this));
    });

    $('.sms-chosen-list').on('click', 'li', function () {
        toggle_option($(this));
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
