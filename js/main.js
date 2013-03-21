$(function(){
	$.getJSON('list.php',function(data){
		var ul = $('<ul>').addClass('list-file');
		var json = data;
		$(json).each(function(index) {
			text = json[index].replace(/\.json/, '').split('_');
			flag = $('<div>').addClass('flag flag-'+text[0].toLowerCase());
			ul.append(
				$('<li>').text(text[1].replace(/-/g,' ')).prepend(flag).addClass('selectable').data('id',json[index])
			);
		});
		
		bootbox.dialog(ul);
		$('.modal-body').prepend("Choose the file:");
	});
	
	function loadJson(file){
	//load glossary
		var path = 'glossary/'+ file;
		
		$.getJSON(path,function(data){
				var items = [];
				categories = [];
				letter = [];
				check = [];
				check2 = [];
				$.each(data.glossary, function(key, val) {
					//create list of categories
					if(typeof check[val.category] == 'undefined' ) {
						categories.push(val.category);
						check[val.category] = 1;
					}
					//create list of firstletter
					firstLetter = val.term.charAt(0);
					if(typeof check2[firstLetter] == 'undefined') {
						letter.push(firstLetter);
						check2[firstLetter] = 1;
					}

					items.push('<li id="' + val.term + '" class="'+val.category+' '+ firstLetter +' all"><h4>' + val.term + ':</h4><blockquote>' + val.definition + '</blockquote></li>');
				});
				$('<ul/>', {'class': 'list',html: items.sort().join('')}).prependTo('.list-glossary');
				
				$('.author').text(data.author).attr('href',data.site);
				$('.description').text(data.description);
				$('.version').text(data.version);
				
				createMenu(categories.sort());
				createListLetter(letter.sort());
		});
	}

	function createMenu(categories){
	//create categories menu
		var menus = [];
		menus.push('<li class="menu-child"><a class="menu-category" data-type="all" href="#all">All</a></li>');

		$.each(categories,function(i,val) {
			menus.push('<li class="menu-child"><a class="menu-category" data-type="'+val+'" href="#'+val+'">' + val +'</a></li>');
		});
		
		$('<ul/>', {'class': 'menu nav nav-list',html: menus.join('')}).appendTo('.menu-span');
		
	}

	function createListLetter(list){
		//create letter list
		var lists = [];

		$.each(list,function(i,val) {
			lists.push('<li class="list-child"><b><a class="list-char" data-type="'+val+'" href="#'+val+'">' + val +'</a></b></li>');
		});

		$('<ul/>', {'class': 'letter inline',html: lists.join('')}).appendTo('.list-chars');
	}

	$(document).on('click','.menu-category',function(){
		//filter by category
		$('.list-char').css('font-weight','normal');
		$('.menu-category').css('font-weight','normal');
		$(this).css('font-weight','bold');
		$('.list li').slideDown().not('.'+$(this).data('type')).slideUp();
	});

	$(document).on('click','.list-char',function(){
		//filter by letter
		$('.menu-category').css('font-weight','normal');
		$('.list-char').css('font-weight','normal');
		$(this).css('font-weight','bold');
		$('.list li').slideDown().not('.'+$(this).data('type')).slideUp();
	});

	$(document).on('click','.selectable',function(){
		loadJson($(this).data('id'));
		bootbox.hideAll()
	});
	
	function listFilter(list) { 
    var  input = $('.search-query');

		$(input).change( function () {
			var filter = $(this).val();
			if(filter) {
			// this finds all links in a list that contain the input,
			// and hide the ones not containing the input while showing the ones that do
				$(list).find("h4:not(:containsi(" + filter + "))").parent().slideUp();
				$(list).find("h4:containsi(" + filter + ")").parent().slideDown();
			} else {
				$(list).find("li").slideDown();
			}
			return false;
		}).keyup( function () {
        // fire the above change event after every letter
			$(this).change();
		});
	}

	//Contain selecotr of jquery is case-sensitive with this function have a selector case-insensitive
	//http://stackoverflow.com/questions/187537/is-there-a-case-insensitive-jquery-contains-selector
	$.extend($.expr[':'], {'containsi': function(elem, i, match, array){
		return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
		}
	});

  listFilter($(".list-glossary"));
});
