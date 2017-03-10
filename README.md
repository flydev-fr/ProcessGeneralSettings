# Global settings for ProcessWire 2.7+

This module provides a solution for keeping general site settings in one place

## Features

- Admin can create unlimited number of settings
- Settings can be grouped
- Admin can set setting label, notes, property name, field width and type
- Settings can be of type text, checkbox, radios, select, email, url, integer
- The output can be language aware

## How to use

In module configuration create as many settings as needed. Customize their label, type, width 
and provide a name you want to use in a template files (property name).
Every time you wish to output site name you can use $settings->site_name or wire('settings')->site_name
You can change global name ($settings) to something else in module configuration.

To get basic markup with all settings and their values use $settings->render().

## Requirements

This version of the module requires ProcessWire 2.7+ 

##Multilanguage
To make fields multilanguage aware create a field with a same property name with '_languageName' appended.
Example: Your site has two languages: default and french, create site_title and site_title_french fields. 
Put in a template $settings->site_title. If a user has set french language, this module output site_title_french, 
otherwise site_title.


---

Copyright 2016 by Piotr Markiewicz 
