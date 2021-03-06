

# bs-searchable-multiselect  
  
## How to start  
  
 1. Import *bootstrap* and *jQuery*  
 2. Run *sms-generate-templates* command in directory that you want to store your templates file
 **NOTE:** for this to work you should have Node version 10.0.0 or higher 
 3. Import *sms_templates.js* which was generated in last step  
 4. Import *sms.js*  
 5. Add `class='sms-select'` to your `<select>` tag.  
   
**Done!**  

 You can also add *sms-template-dark* to classes of your select, if you prefer darker colors.


## Using custom templates
If you want to further customize your select, there are a few simple steps that you have to perform:

 1. Create your custom template. You can start with the one from *sms_templates.html*
	 - Remember to give it at least two classes: *sms-searchable-multiselect* and one that starts with *sms-template*, eg. *sms-template-custom*
 2. Run *sms-generate-templates* with a path to your template as a first param. For example:
 `sms-generate-templates /foo/bar/custom_sms_templates.html`
 3. Add your new custom template class to your select. It should look like this:
 `<select class='sms-select sms-template-custom'>`

And that's all. *sms-generate-templates* updated *sms_templates.js* file, adding your new template to it.

**NOTE**: 
If you want to add more than one template, just put them all in one file, one after another.


## Constants
For now there is only one constant that you should be aware of - **sms_max_rows**. When this is set, there will be only that much visible rows. Rest of them will be wrapped with scrollable area.

Remember that this will work correctly only for templates that make use of bootstrap lists, or ones that have row height similar to them.


## Other mildly important things
You can also decide if you do not want to filter selected options. To do so, just add *sms-do-not-filter-chosen* class to your select.

> Written with [StackEdit](https://stackedit.io/).
