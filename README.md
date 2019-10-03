

# bs-searchable-multiselect  
  
## How to start  
  
 1. Import *bootstrap* and *jQuery*  
 2. Run *./generate_templates.js*  
 3. Import *sms_templates.js* which was generated in last step  
 4. Import *sms.js*  
 5. Add `class='sms-select'` to your `<select>` tag  
   
**Done!**  

## Using custom templates
If you want to further customize your select, there are a few simple steps that you have to perform:

 1. Create your custom template. You can start with the one from *sms_templates.html*
	 - Remember to give it at least two classes: *sms-searchable-multiselect* and one that starts with *sms-template*, eg. *sms-template-custom*
 2. Run *./generate_templates.js* with a path to your template as a first param. For example:
 `./generate_templates.js /foo/bar/custom_sms_templates.html`
 3. Add your new custom template class to your select. It should look like this:
 `<select class='sms-select sms-template-custom'>`

And that's all. *./generate_templates.js* updated *sms_templates.js* file, adding your new template to it.

**NOTE**: 
If you want to add more than one template, just put them all in one file, one after another.
  
> Written with [StackEdit](https://stackedit.io/).