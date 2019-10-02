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

function generate_all_sms() {
    let template = $('#sms-template').children().first();
    $('.sms-select').each(function () {
        replace_select_with_sms($(this), template);
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

    generate_all_sms();
    connect_events();

});
