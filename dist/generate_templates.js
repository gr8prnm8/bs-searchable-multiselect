#!/usr/bin/env node

const templates_str_name = 'templates_str';
const templates_path = __dirname.concat('/', 'sms_templates.html');
const generated_file = 'sms_templates.js';

/* functions definitions */
function is_node() {
    // Establish the root object, `window` in the browser, or `global` on the server.
    let root = this;

    // Create a reference to this
    let _ = {};

    let is_node = false;

    // Export the Underscore object for **CommonJS**, with backwards-compatibility
    // for the old `require()` API. If we're not in CommonJS, add `_` to the
    // global object.
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = _;
        root._ = _;
        is_node = true;
    } else {
        root._ = _;
    }

    return is_node;
}

function show_help() {
    console.log('');
    console.log('SYNTAX: ./generate_templates.js [custom templates path]|--help|-h');
    console.log('');
    console.log('Check https://github.com/gr8prnm8/bs-searchable-multiselect for more info.');
    console.log('');
}

function generate_sms_templates(fs, file_promises, templates_str_name) {
    Promise.all(file_promises).then(function (files_content) {
        let templates = files_content[0];

        //if there is second promise passed, it should contain custom templates
        if (files_content.length === 2) {
            templates = templates.concat(files_content[1]);
        }

        templates = templates.replace(/\r?\n|\r/g, '');  //remove new lines
        templates = templates.replace(/ {4,}|\t/g, ''); //remove tabulation

        let new_file_content = `const ${templates_str_name} = '${templates}';`;

        // create file
        fs.writeFile(generated_file, new_file_content, 'utf8')
            .then(function () {
                console.log('sms_templates.js created successfully!');
            })
            .catch(function (err) {
                console.log(err.message);
            });
    }).catch(function (err) {
        console.log(err.message);
    });
}


/* script */
// perform script only if used in Node
if (is_node()) {

    const fs = require('fs').promises;

    // array of promises generated from templates_path and possibly custom_templates_path
    let promises = [fs.readFile(templates_path, 'utf-8')];

    // if there is argument passed
    if (process.argv.length > 2) {
        const custom_templates_path = process.argv[2];

        // if this argument is help request
        if (custom_templates_path === '--help' || custom_templates_path === '-h') {
            show_help();
        } else {
            //append custom_templates_promise to promises
            promises.push(fs.readFile(custom_templates_path, 'utf-8'));

            generate_sms_templates(fs, promises, templates_str_name);
        }
    } else {
        generate_sms_templates(fs, promises, templates_str_name);
    }
} else {
    console.error('This script should not be used in browser! Check https://github.com/gr8prnm8/bs-searchable-multiselect for more info');
}