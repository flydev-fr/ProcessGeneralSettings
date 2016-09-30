
$(window).load(function() {
    $('.asmListItemStatus').append('<a class="edit" href="#"><i class="fa fa-pencil" aria-hidden="true"></i></a>');
    $('#asmContainer0').prepend('<span class="trash">Trash</span>');

    $('#wrap_ASMOrder ol').after('<a id="addNew" href="'+window.location.href+'&addNewRow=13"><i class="fa fa-plus-circle" aria-hidden="true"></i> Add</a>');

    $('#ModuleEditForm').after('<form id="modalForm"><p id="tips"></p> <fieldset>' 
    	+'<label for="api">API variable</label> <input type="text" name="api" id="api" value="" required class="text ui-widget-content ui-corner-all"><br>'
      	+'<label for="label">Label</label><input type="text" name="label" id="label" value="" required class="text ui-widget-content ui-corner-all"><br>'
        +'<label for="type">Type</label><select type="text" name="type" id="type" class="text ui-widget-content ui-corner-all">'
        +'<option>Text</option><option>Textarea</option><option>Select</option><option>Radios</option><option>Checkbox</option><option>Integer</option><option>Float</option>'
        +'<option>URL</option><option>Email</option><option>Fieldset</option></select><br>'
        +'<label for="width">Width in %</label><input type="number" max="100" min="10" name="width" id="width" value="100" class="text ui-widget-content ui-corner-all"><br>'
        +'<label for="description">Description</label><input type="text" name="description" id="description" value="" class="text ui-widget-content ui-corner-all"><br>'
        +'<label id="select-label" for="select">Comma separated options for select</label><input type="text" name="select" id="select" value="" class="text ui-widget-content ui-corner-all"><br>'
      	+' <!-- Allow form submission with keyboard without duplicating the dialog button --><input type="submit" tabindex="-1" style="position:absolute; top:-1000px">'
    	+'</fieldset></form>');
  	$(function() {	
	    var dialog, form, asmID;
	    var moduleData = jQuery.parseJSON ($('#settings').val());
	 	var asmList = {};
	 	var count = 0;
	 	$('#wrap_ASMOrder .asmListItem').each(function( index ) {
  			asmList[$(this).attr('rel')] = index; 
  			count = index;
		});
		
		function select(val) {
			if (val == 'Select' || val == 'Radios') {
				$('#select').show();
				$('#select-label').show();
			} else {
				$('#select').hide();
				$('#select-label').hide();
			}
		}

		$('#type').on('change', function() {
			select($(this).val());
		});


	 	//on edit
	    function fillForm(event) {
	    	var target = $(event.target);
	    	var labelObj = $(target.closest('.asmListItem').children('.asmListItemLabel'));
	    	asmID = $(target.closest('.asmListItem')).attr('rel');

	    	$(form).find('#api').val(moduleData[asmList[asmID]].api);
	    	$(form).find('#label').val(moduleData[asmList[asmID]].label);
	    	$(form).find('#type').val(moduleData[asmList[asmID]].type);
	    	$(form).find('#width').val(moduleData[asmList[asmID]].width);
	    	$(form).find('#description').val(moduleData[asmList[asmID]].description);
	    	$(form).find('#select').val(moduleData[asmList[asmID]].select);
	    	select($('#type').val());
	    }

	    function checkLength( o, n) {
	      if (o.val().length < 1) {
	        o.addClass( "ui-state-error" );
	        $('#tips').text(n + " can not be empty." );
	        return false;
	      } else {
	        return true;
	      }
	    }
	 
	    function checkRegexp( o, regexp, n ) {
	      if ( !( regexp.test( o.val() ) ) ) {
	        o.addClass( "ui-state-error" );
	        $('#tips').text(n);
	        return false;
	      } else {
	        return true;
	      }
	    }

	    function editFields() {
	      	var valid = true;
	 		//TODO validate entries
	 		valid = valid && checkLength( $('#api'), "API variable" );
	 		valid = valid && checkLength( $('#label'), "Label" );
	 		valid = valid && checkRegexp( $('#api'), /^[a-z]([0-9a-z_])+$/i, "API variable may consist of a-z, 0-9, underscores and must begin with a letter." );

	      	if ( valid ) {
				var api = $(form).find('#api').attr('value');
				var label = $(form).find('#label').attr('value');
				var type = $(form).find('#type').val();
				var width = $(form).find('#width').attr('value');
				//change label of asm select item
				var label = $(form).find('#label').attr('value');
				var fullLabel = '';
				if (type == 'Fieldset') {
					fullLabel = '-- '+label +' -- ' + width+'%';
				} else {	
					fullLabel = label +' (' +api +') - '+ width+'%';
				}
				$('li[rel="'+asmID +'"] .asmListItemLabel').text(fullLabel);
				//change data in asm option
				$('option[rel="'+asmID +'"]').text(label).attr('value', api);
				$('#'+asmID).text(fullLabel).attr('value', api);
				//save to module data
				moduleData[asmList[asmID]].api = api;
				moduleData[asmList[asmID]].label = label;
				moduleData[asmList[asmID]].type = type;
				moduleData[asmList[asmID]].width = width;
				moduleData[asmList[asmID]].description = $(form).find('#description').attr('value');
				moduleData[asmList[asmID]].select = $(form).find('#select').attr('value');
	        	dialog.dialog( "close" );
	      	}
	      	return valid;
	    }
	 	function createDialog() {
	    	dialog = $(form).dialog({
	      		autoOpen: false,
	      		modal: true,
	      		buttons: {
	        		"Save": editFields,
	        		Cancel: function() {
	          			dialog.dialog( "close" );
	      	  		}
	      		},
	      		close: function() {
	       			$(form).find('#api').val('field');
	    			$(form).find('#label').val('New field');
	    			$(form).find('#type').val('Text');
	    			$(form).find('#width').val('100');
	    			$(form).find('#description').val('');
	    			$(form).find('#select').val('');
	      		}
	    	});
	    }

		function edit(event) {
	    	form = $('#modalForm');
	    	fillForm(event);
	    	createDialog();
	      	dialog.dialog( "open" );
	      	event.preventDefault();
	    }

	    $( ".edit" ).button().on( "click", edit);

		$('#addNew').on("click", function(event) {
	  		$('#ASMOrder').append($("<option></option>").text('New field').attr('value', 'new_field').attr("selected", true));
			$('#ASMOrder').change();
	  		var labelObj = $('#wrap_ASMOrder').last('.asmListItem');
			asmID = $('#wrap_ASMOrder .asmListItem:last-of-type').attr('rel');
			count= count + 1
			asmList[asmID] = count; 
			moduleData[asmList[asmID]] = {'api': ''};
	  		//open edit dialog
	  		form = $('#modalForm');
	  		createDialog();
	  		//hide select options
	  		select('anything');
  			dialog.dialog( "open" );

	  		$('.asmListItemStatus').append('<a class="edit" href="#"><i class="fa fa-pencil" aria-hidden="true"></i></a>');
	  		$('.edit').button().bind('click', edit);
			return false;
		});

		$('#ModuleEditForm').on('submit', function(event) {
			//change order if needed and save
			var newOrdered = {};
			$('#wrap_ASMOrder .asmListItem').each(function( index ) {
  				newOrdered[index] = moduleData[asmList[$(this).attr('rel')]];
			});
			$('#settings').attr('value', JSON.stringify(newOrdered));
		});

	});

});
